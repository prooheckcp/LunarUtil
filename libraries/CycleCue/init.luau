local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Signal = require(ReplicatedStorage.Packages.Signal)
local Trove = require(ReplicatedStorage.Packages.Trove)

type Trove = typeof(Trove.new(...))

local CycleCue = {}
CycleCue.__index = CycleCue
CycleCue.Started = newproxy()
CycleCue.Finished = newproxy()
CycleCue._TimeCounted = 0 :: number
CycleCue._Trove = newproxy() :: Trove
CycleCue._Destroyed = false :: boolean

function CycleCue.new()
    local self = setmetatable({}, CycleCue)

    self._Destroyed = false
    self._Trove = Trove.new()
    self.Started = Signal.new()
    self.Finished = Signal.new()
    
    self._Trove:Add(RunService.Heartbeat:Connect(function(deltaTime: number)
        local oldCounter: number = self._TimeCounted

        self._TimeCounted = math.max(oldCounter - deltaTime, 0)

        if oldCounter > 0 and self._TimeCounted <= 0 then
            self.Finished:Fire()
        end
    end))

    self._Trove:Add(self.Started)
    self._Trove:Add(self.Finished)

    return self
end

function CycleCue:GetTime(): number
    return self._TimeCounted
end

function CycleCue:AddTime(amount: number): ()
    self:SetTime(self:GetTime() + amount)
end

function CycleCue:SetTime(newValue: number): ()
    if self:GetTime() <= 0 and newValue > 0 then
        self.Started:Fire()
    end

    self._TimeCounted = newValue
end

function CycleCue:Destroy()
    if self._Destroyed then return end

    self._Destroyed = true
    self._Trove:Destroy()
end

export type CycleCue = typeof(CycleCue)

return CycleCue