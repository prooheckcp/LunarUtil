--!strict

local CLEANUP_TABLE = {
    ["Instance"] = "Destroy",

}

--[=[
    @class Trashcan

    Hello world
]=]
local Trashcan = {}
Trashcan.__index = Trashcan
Trashcan._Connections = {} :: {[string]: any}
Trashcan._CustomCleanup = nil :: {[string]: string}?

function Trashcan.new()
    return setmetatable({}, Trashcan)
end

--[=[
]=]
function Trashcan:Collect<T>(object: T, cleanupMethod: string?): T
    assert(not cleanupMethod or typeof(cleanupMethod) == "string", "Argument 2 must be a string")

    local objectType: string = typeof(object)

    self._Connections[object] = object -- Store by the memory address of our object

    return object
end

--[=[
    Receives the instance, clones it, stores it in the trashcan and returns the clone
]=]
function Trashcan:Clone(object: Instance): Instance
    assert(typeof(object) == "Instance", "Argument 1 must be an instance")

    return self:Collect(object:Clone()) :: Instance
end

function Trashcan:Empty()
    
end

function Trashcan:Destroy()
    setmetatable(self, nil)
end

export type Trashcan = {
    new: () -> Trashcan,
    Collect: <T>(object: T, cleanupMethod: string?) -> T,
    Clone: (object: Instance) -> Instance,
    Empty: () -> (),
    Destroy: () -> ()
}

return Trashcan