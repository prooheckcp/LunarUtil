--!strict

local CLEANUP_TABLE = {
    Instance = "Destroy",
    RBXScriptConnection = "Disconnect",
    table = "Destroy",
}

local SPECIAL_CLEANUP = {
    thread = function(thread: thread)
        task.cancel(thread)
    end,
    ["function"] = function(func: (...any) -> ...any)
        func()
    end,
    promise = function()

    end
}

local function isPromise(object): boolean
    return 
        typeof(object) == "table" and 
        typeof(object.getStatus) == "function" and
        typeof(object.finally) == "function" and
        typeof(object.cancel) == "function"
end

--[=[
    @class Trashcan

    Trashcan is an object used to track objects during runtime and clean them up when they are no longer needed. 
    This is useful for managing memory and preventing memory leaks

    ```lua
    local trashcan = Trashcan.new()

    local part = Instance.new("Part")
    trashcan:Collect(part) -- Will store the part in the trashcan

    trashcan:Empty() -- Will make the trashcan empty

    trashcan:Destroy() -- Will destroy the trashcan
    ```
]=]
local Trashcan = {}
Trashcan.__index = Trashcan
Trashcan._Connections = {} :: {[any]: true}
Trashcan._CustomCleanup = nil :: {[string]: string}?

--[=[
    Constructs a new trashcan object

    ```lua
    local trove = Trashcan.new()
    ```

    @return Trashcan
]=]
function Trashcan.new(): Trashcan
    return setmetatable({}, Trashcan)
end

--[=[
    Receives an object and stores it in the trashcan

    @within Trashcan
    @param object T -- Whatever object you wish to track
    @param cleanupMethod string? The method to call on the object when it is time to clean it up. Primarily useful to cleanup custom objects

    @return any The object that was passed in
]=]
function Trashcan:Collect<T>(object: T, cleanupMethod: string?): T
    assert(object ~= nil, "Argument 1 must not be nil")
    assert(not cleanupMethod or typeof(cleanupMethod) == "string", "Argument 2 must be a string")

    self._Connections[object] = true -- Store by the memory address of our object

    if cleanupMethod then
        if not self._CustomCleanup then
            self._CustomCleanup = {}
        end

        self._CustomCleanup[object] = cleanupMethod
    end

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
    for object in self._Connections do
        self:_CleanObject(object)
    end

    self._Connections = nil
    self._CustomCleanup = nil
end

--[=[
    ::: warning

    :::

    ```lua
    trashcan:Destroy()
    ```

    @within Trashcan
    @return ()
]=]
function Trashcan:Destroy()
    setmetatable(self, nil)
end

--[=[
    Cleans up the object by calling the appropriate cleanup method

    @within Trashcan
    @param object any -- The object to clean up

    @return ()
]=]
function Trashcan:_CleanObject(object: any): ()
    local objectType: string = typeof(object)
    local cleanupMethod: string? = (
            self._CustomCleanup and 
            self._CustomCleanup[object] 
            or CLEANUP_TABLE[objectType]
        )
    
    if not cleanupMethod then
        local specialCleanup = SPECIAL_CLEANUP[objectType] or (isPromise(object) and SPECIAL_CLEANUP.promise)

        if specialCleanup then
            specialCleanup(object)
            return
        end

        error("No cleanup method found for object of type " .. typeof(object)) -- Developer mistake; should error
    end

    cleanupMethod[object](object)
end

export type Trashcan = {
    new: () -> Trashcan,
    Collect: <T>(object: T, cleanupMethod: string?) -> T,
    Clone: (object: Instance) -> Instance,
    Empty: () -> (),
    Destroy: () -> ()
}

return Trashcan