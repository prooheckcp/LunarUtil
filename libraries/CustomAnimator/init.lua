local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Promise = require(ReplicatedStorage.Packages.Promise)
local filterAssetId = require(ReplicatedStorage.CombatSystem.Shared.Functions.filterAssetId)
local getHumanoid = require(ReplicatedStorage.CombatSystem.Shared.Functions.getHumanoid)
local print = require(ReplicatedStorage.CombatSystem.Shared.Functions.print)
local Signal = require(ReplicatedStorage.Packages.Signal)
local Trove = require(ReplicatedStorage.Packages.Trove)

type Signal = Signal.Signal
type Trove = typeof(Trove.new(...))

local DEFAULT_TIMEOUT: number = 30

--[=[
    @class CustomAnimator

    Custom animators allow us to easily interpolate between animations and preload them into
    a contained space. This was created with the main purpose of feeding our animation
    logic within the combat system, but can be used for other purposes as well.
]=]
local CustomAnimator = {}
CustomAnimator.__index = CustomAnimator
CustomAnimator.Started = Signal.new()
CustomAnimator.Ended = Signal.new()
CustomAnimator._Animator = nil :: Animator?
CustomAnimator._Speed = 1 :: number
CustomAnimator._AnimationTracks = {} :: {[string]: AnimationTrack}
CustomAnimator._AnimationAliases = {} :: {[string]: string} -- To index our animation tracks
CustomAnimator._CurrentAnimation = "" :: string -- Alias
CustomAnimator._Trove = nil :: Trove

--[=[
    Creates a new instance of a custom animator

    @param instance Instance -- The target instance that will be animated

    @return CustomAnimator
]=]
function CustomAnimator.new(instance: Instance): CustomAnimator
    local self = setmetatable({}, CustomAnimator)
    self.Started = Signal.new()
    self.Ended = Signal.new()

    local animatorReference: Animator? = nil    
    local humanoid: Humanoid? = getHumanoid(instance)

    if humanoid then
        local existingAnimator: Animator? = humanoid:FindFirstChildWhichIsA("Animator")

        if not existingAnimator then
            local animator: Animator = Instance.new("Animator")
            animator.Parent = humanoid
        end

        animatorReference = existingAnimator
    else
        local animationController: AnimationController = instance:FindFirstChildWhichIsA("AnimationController") or Instance.new("AnimationController")
        animationController.Parent = instance

        local existingAnimator: Animator? = animationController:FindFirstChildWhichIsA("Animator")

        if not existingAnimator then
            local animator: Animator = Instance.new("Animator")
            animator.Parent = animationController
            existingAnimator = animator
        end

        animatorReference = existingAnimator
    end

    self._Animator = animatorReference
    self._AnimationTracks = {}
    self._AnimationAliases = {}
    self._Trove = Trove.new()

    return self
end

--[=[
    Loads an animation into our system

    ```lua
    --Unload animation example
    ```

    @param animationId string -- The animation id to load

    @return Promise -- A promise that will resolve when the animation is loaded
]=]
function CustomAnimator:LoadAnimation(animationId: (string | number), alias: string, priority: Enum.AnimationPriority?, looped: boolean?)
    local filteredAnimationId: string = "rbxassetid://"..filterAssetId(animationId)

    if self._AnimationTracks[filteredAnimationId] then
        self._AnimationAliases[alias] = filteredAnimationId
        return Promise.new(function(resolve)
            resolve(function()
                self:UnloadAnimation(alias)
            end)
        end)
    end

    local animation: Animation = Instance.new("Animation")
    animation.AnimationId = filteredAnimationId

    return Promise.new(function(resolve)
        local animationTrack: AnimationTrack = self._Animator:LoadAnimation(animation)
        if priority then
            animationTrack.Priority = priority
        end

        if looped == nil then
            looped = looped
        end

        repeat 
            task.wait() 
        until 
            animationTrack.Length > 0

        self._AnimationTracks[filteredAnimationId] = animationTrack
        self._AnimationAliases[alias] = filteredAnimationId

        resolve(function()
            self:UnloadAnimation(alias)
        end)
    end):timeout(DEFAULT_TIMEOUT):catch(function(warningMessage: string)
        print(warningMessage)
        animation:Destroy()
    end)
end

--[=[
    Unloads an animation from our custom animator

    @param alias string

    @return ()
]=]
function CustomAnimator:UnloadAnimation(alias: string): ()
    local filteredAnimationId: string? = self._AnimationAliases[alias]

    if not filteredAnimationId then
        return
    end

    self._AnimationAliases[alias] = nil
    self._AnimationTracks[filteredAnimationId] = nil
end

--[=[
    Gets the length of the animation by the given alias

    @param alias string

    @return number
]=]
function CustomAnimator:GetLength(alias: string): number
    if not self:_GetAnimation(alias) then
        return 0
    end
    
    return self:_GetAnimation(alias).Length or 0
end

--[=[
    Plays the animation by the given alias

    @param alias string

    @return ()
]=]
function CustomAnimator:Play(alias: string, fadeTime: number?): ()
    local animationTrack: AnimationTrack? = self:_GetAnimation(alias)

    if not animationTrack then
        return
    end

    self:Stop()
    self.Started:Fire()
    animationTrack:Play(fadeTime)
    animationTrack:AdjustSpeed(self._Speed)
    self._Trove:Add(animationTrack.Stopped:Once(function()
        self.Ended:Fire(alias)
    end))
     
    self._CurrentAnimation = alias
end

--[=[
    Stops the animation from the given alias

    @param alias string

    @return ()
]=]
function CustomAnimator:StopAlias(alias: string, fadeTime: number?): ()
    local animationTrack: AnimationTrack? = self:_GetAnimation(alias)

    if not animationTrack then
        return
    end

    animationTrack:Stop(fadeTime)
end

--[=[
    Adjusts the speed of our animator to the new value

    @param newSpeed number

    @return ()
]=]
function CustomAnimator:AdjustSpeed(newSpeed: number): ()
    self._Speed = newSpeed
    
    local currentAnimationTrack: AnimationTrack? = self:_GetAnimation(self._CurrentAnimation)

    if not currentAnimationTrack then
        return
    end

    currentAnimationTrack:AdjustSpeed(newSpeed)
end

--[=[
    Returns if the given animation or last animation is currently playing

    @param alias string?

    @return boolean
]=]
function CustomAnimator:IsPlaying(alias: string?): boolean
    local animationTrack: AnimationTrack? = self:_GetAnimation(alias or self._CurrentAnimation)

    if not animationTrack then
        return false
    end

    return animationTrack.IsPlaying
end

--[=[
    Gets the current alias that is being played by our custom animator

    ```lua
    customAnimator:Play("Animation1")
    print(customAnimator:GetCurrentAnimationAlias()) -- Animation1
    customAnimator:Play("Animation2")
    print(customAnimator:GetCurrentAnimationAlias()) -- Animation2
    ```

    @return string
]=]
function CustomAnimator:GetCurrentAnimationAlias(): string
    return self._CurrentAnimation
end

--[=[
    Stops the animation that is currently being played

    @return ()
]=]
function CustomAnimator:Stop(): ()
    for _, animationTrack: AnimationTrack in self._AnimationTracks do
        if not animationTrack.IsPlaying then
            continue
        end

        animationTrack:Stop()
    end

    self._CurrentAnimation = ""
end

--[=[
    Used to listen to animations from our Custom animator

    @param eventName string
    @param alias string?

    @return Signal
]=]
function CustomAnimator:GetMarkerReachedSignal(eventName: string, alias: string?): Signal
    local animationTrack: AnimationTrack? = self:_GetAnimation(alias)
    
    if animationTrack then
        return animationTrack:GetMarkerReachedSignal(eventName)
    end

    return Signal.new() -- Clones RBXScriptSignal behavior
end

--[=[
    Gets an animation from the custom animator via the alias of said animation

    @private
    @param alias string

    @return AnimationTrack?
]=]
function CustomAnimator:_GetAnimation(alias: string): AnimationTrack?
    local filteredAnimationId: string? = self._AnimationAliases[alias]

    if not filteredAnimationId then
        return nil
    end

    return self._AnimationTracks[filteredAnimationId]
end

function CustomAnimator:Destroy(): ()
    self:Stop()
    self._Trove:Destroy()
end

export type CustomAnimator = typeof(CustomAnimator)

return CustomAnimator