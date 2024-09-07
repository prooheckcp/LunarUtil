--!strict

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local Signal = require(ReplicatedStorage.Packages.Signal)
local Trove = require(ReplicatedStorage.Packages.Trove)

type Trove = typeof(Trove)
type Signal = typeof(Signal)

--[=[
    @class Clock

    The clock class is a simple block that ticks every X amount of time
]=]
local Clock = {}
Clock.__index = Clock
Clock._Trove = newproxy() :: Trove
Clock._IsRunning = false :: boolean
Clock._LastTick = 0 :: number
Clock._Interval = 0 :: number
Clock.Started = newproxy() :: Signal
Clock.Stopped = newproxy() :: Signal
Clock.Tick = newproxy() :: Signal

--[=[
    Creates a new instance of a clock that ticks every X amount of time

    @param interval number? -- The amount of time in seconds that the clock should tick

    @return Clock
]=]
function Clock.new(interval: number?): Clock
    local self = setmetatable({}, Clock)
    self._Trove = Trove.new()
    self.Started = Signal.new()
    self.Stopped = Signal.new()
    self.Tick = Signal.new()
    self:SetInterval(interval or self:GetInterval())

    return self
end

--[=[
    Creates a simple clock that ticks every X amount of time automatically

    @param interval number?

    @return Clock
]=]
function Clock.Simple(interval: number?): Clock
    local clock = Clock.new()
    clock:SetInterval(interval or 0)
    clock:Start()

    return clock
end

--[=[
    Sets the interval of the clock

    @param interval number -- The amount of time in seconds that the clock should tick

    @return ()
]=]
function Clock:SetInterval(interval: number): ()
    self._Interval = interval
end

--[=[
    Gets the interval of our clock

    @return number
]=]
function Clock:GetInterval(): number
    return self._Interval
end

--[=[
    Checks if the clock is running

    @return boolean
]=]
function Clock:IsRunning(): boolean
    return self._IsRunning
end

--[=[
    Starts the clock ticking

    @return ()
]=]
function Clock:Start(): ()
    if self:IsRunning() then
        return
    end

    self._IsRunning = true
    self._Trove:Add(RunService.Heartbeat:Connect(function()
        local timeDelta: number = tick() - self._LastTick

        if timeDelta < self:GetInterval() then
            return
        end

        self._LastTick = tick()
        self.Tick:Fire()
    end))

    self.Started:Fire()
end

--[=[
    Stops the clock from ticking

    @return ()
]=]
function Clock:Stop(): ()
    if not self:IsRunning() then
        return
    end
    
    self._IsRunning = false
    self._Trove:Clean()
    self.Stopped:Fire()
end

--[=[
    Destroys the clock

    @return ()
]=]
function Clock:Destroy(): ()
    self:Stop()
    self._Trove:Destroy()
end

export type Clock = typeof(Clock)

return Clock