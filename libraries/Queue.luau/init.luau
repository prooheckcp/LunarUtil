--[=[
    @class Queue

    Queues are a type of container, specifically designed to operate in a 
    FIFO context (First In, First Out), where elements are inserted into 
    one end of the container and extracted from the other end.
]=]
local Queue = {}
Queue.__index = Queue
Queue._Data = {}

--[=[
    Creates a new instance of a Queue

    @return Queue
]=]
function Queue.new<T>()
    local self = setmetatable({}, Queue)
    self._Data = {} :: {T}

    return self
end

--[=[
    Tests whether the queue is empty or not

    @return boolean
]=]
function Queue:Empty(): boolean
    return #self._Data == 0
end

--[=[
    Returns the number of elements in the queue

    @return number
]=]
function Queue:Size(): number
    return self._Data
end

--[=[
    Returns the first element in the queue

    @return T?
]=]
function Queue:Front<T>(): T?
    return self._Data[1]
end

--[=[
    Returns the last element in the queue

    @return T?
]=]
function Queue:Back<T>(): T?
    return self._Data[#self._Data]
end

--[=[
    Pushes an element to the back of the queue

    @param newValue T

    @return ()
]=]
function Queue:Push<T>(newValue: T): ()
    table.insert(self._Data, newValue)
end

--[=[
    Pops an element from the front of the queue

    @return T
]=]
function Queue:Pop<T>(): T
    local value: T = self._Data[1]
    table.remove(self._Data, 1)

    return value
end

export type Queue = typeof(Queue)

return Queue