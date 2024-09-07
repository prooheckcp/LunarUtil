"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[743],{32489:e=>{e.exports=JSON.parse('{"functions":[{"name":"new","desc":"Construct a new Promise that will be resolved or rejected with the given callbacks.\\n\\nIf you `resolve` with a Promise, it will be chained onto.\\n\\nYou can safely yield within the executor function and it will not block the creating thread.\\n\\n```lua\\nlocal myFunction()\\n\\treturn Promise.new(function(resolve, reject, onCancel)\\n\\t\\twait(1)\\n\\t\\tresolve(\\"Hello world!\\")\\n\\tend)\\nend\\n\\nmyFunction():andThen(print)\\n```\\n\\nYou do not need to use `pcall` within a Promise. Errors that occur during execution will be caught and turned into a rejection automatically. If `error()` is called with a table, that table will be the rejection value. Otherwise, string errors will be converted into `Promise.Error(Promise.Error.Kind.ExecutionError)` objects for tracking debug information.\\n\\nYou may register an optional cancellation hook by using the `onCancel` argument:\\n\\n* This should be used to abort any ongoing operations leading up to the promise being settled.\\n* Call the `onCancel` function with a function callback as its only argument to set a hook which will in turn be called when/if the promise is cancelled.\\n* `onCancel` returns `true` if the Promise was already cancelled when you called `onCancel`.\\n* Calling `onCancel` with no argument will not override a previously set cancellation hook, but it will still return `true` if the Promise is currently cancelled.\\n* You can set the cancellation hook at any time before resolving.\\n* When a promise is cancelled, calls to `resolve` or `reject` will be ignored, regardless of if you set a cancellation hook or not.\\n\\n:::caution\\nIf the Promise is cancelled, the `executor` thread is closed with `coroutine.close` after the cancellation hook is called.\\n\\nYou must perform any cleanup code in the cancellation hook: any time your executor yields, it **may never resume**.\\n:::","params":[{"name":"executor","desc":"","lua_type":"(resolve: (...: any) -> (), reject: (...: any) -> (), onCancel: (abortHandler?: () -> ()) -> boolean) -> ()"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"static","source":{"line":349,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"defer","desc":"The same as [Promise.new](/api/Promise#new), except execution begins after the next `Heartbeat` event.\\n\\nThis is a spiritual replacement for `spawn`, but it does not suffer from the same [issues](https://eryn.io/gist/3db84579866c099cdd5bb2ff37947cec) as `spawn`.\\n\\n```lua\\nlocal function waitForChild(instance, childName, timeout)\\n  return Promise.defer(function(resolve, reject)\\n\\tlocal child = instance:WaitForChild(childName, timeout)\\n\\n\\t;(child and resolve or reject)(child)\\n  end)\\nend\\n```","params":[{"name":"executor","desc":"","lua_type":"(resolve: (...: any) -> (), reject: (...: any) -> (), onCancel: (abortHandler?: () -> ()) -> boolean) -> ()"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"static","source":{"line":375,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"resolve","desc":"Creates an immediately resolved Promise with the given value.\\n\\n```lua\\n-- Example using Promise.resolve to deliver cached values:\\nfunction getSomething(name)\\n\\tif cache[name] then\\n\\t\\treturn Promise.resolve(cache[name])\\n\\telse\\n\\t\\treturn Promise.new(function(resolve, reject)\\n\\t\\t\\tlocal thing = getTheThing()\\n\\t\\t\\tcache[name] = thing\\n\\n\\t\\t\\tresolve(thing)\\n\\t\\tend)\\n\\tend\\nend\\n```","params":[{"name":"...","desc":"","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise<...any>"}],"function_type":"static","source":{"line":418,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"reject","desc":"Creates an immediately rejected Promise with the given value.\\n\\n:::caution\\nSomething needs to consume this rejection (i.e. `:catch()` it), otherwise it will emit an unhandled Promise rejection warning on the next frame. Thus, you should not create and store rejected Promises for later use. Only create them on-demand as needed.\\n:::","params":[{"name":"...","desc":"","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise<...any>"}],"function_type":"static","source":{"line":435,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"try","desc":"Begins a Promise chain, calling a function and returning a Promise resolving with its return value. If the function errors, the returned Promise will be rejected with the error. You can safely yield within the Promise.try callback.\\n\\n:::info\\n`Promise.try` is similar to [Promise.promisify](#promisify), except the callback is invoked immediately instead of returning a new function.\\n:::\\n\\n```lua\\nPromise.try(function()\\n\\treturn math.random(1, 2) == 1 and \\"ok\\" or error(\\"Oh an error!\\")\\nend)\\n\\t:andThen(function(text)\\n\\t\\tprint(text)\\n\\tend)\\n\\t:catch(function(err)\\n\\t\\twarn(\\"Something went wrong\\")\\n\\tend)\\n```","params":[{"name":"callback","desc":"","lua_type":"(...: T...) -> ...any"},{"name":"...","desc":"Additional arguments passed to `callback`","lua_type":"T..."}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"static","source":{"line":477,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"all","desc":"Accepts an array of Promises and returns a new promise that:\\n* is resolved after all input promises resolve.\\n* is rejected if *any* input promises reject.\\n\\n:::info\\nOnly the first return value from each promise will be present in the resulting array.\\n:::\\n\\nAfter any input Promise rejects, all other input Promises that are still pending will be cancelled if they have no other consumers.\\n\\n```lua\\nlocal promises = {\\n\\treturnsAPromise(\\"example 1\\"),\\n\\treturnsAPromise(\\"example 2\\"),\\n\\treturnsAPromise(\\"example 3\\"),\\n}\\n\\nreturn Promise.all(promises)\\n```","params":[{"name":"promises","desc":"","lua_type":"{Promise<T>}"}],"returns":[{"desc":"","lua_type":"Promise<{T}>"}],"function_type":"static","source":{"line":591,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"fold","desc":"Folds an array of values or promises into a single value. The array is traversed sequentially.\\n\\nThe reducer function can return a promise or value directly. Each iteration receives the resolved value from the previous, and the first receives your defined initial value.\\n\\nThe folding will stop at the first rejection encountered.\\n```lua\\nlocal basket = {\\"blueberry\\", \\"melon\\", \\"pear\\", \\"melon\\"}\\nPromise.fold(basket, function(cost, fruit)\\n\\tif fruit == \\"blueberry\\" then\\n\\t\\treturn cost -- blueberries are free!\\n\\telse\\n\\t\\t-- call a function that returns a promise with the fruit price\\n\\t\\treturn fetchPrice(fruit):andThen(function(fruitCost)\\n\\t\\t\\treturn cost + fruitCost\\n\\t\\tend)\\n\\tend\\nend, 0)\\n```","params":[{"name":"list","desc":"","lua_type":"{T | Promise<T>}"},{"name":"reducer","desc":"","lua_type":"(accumulator: U, value: T, index: number) -> U | Promise<U>"},{"name":"initialValue","desc":"","lua_type":"U"}],"returns":[],"function_type":"static","since":"v3.1.0","source":{"line":620,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"some","desc":"Accepts an array of Promises and returns a Promise that is resolved as soon as `count` Promises are resolved from the input array. The resolved array values are in the order that the Promises resolved in. When this Promise resolves, all other pending Promises are cancelled if they have no other consumers.\\n\\n`count` 0 results in an empty array. The resultant array will never have more than `count` elements.\\n\\n```lua\\nlocal promises = {\\n\\treturnsAPromise(\\"example 1\\"),\\n\\treturnsAPromise(\\"example 2\\"),\\n\\treturnsAPromise(\\"example 3\\"),\\n}\\n\\nreturn Promise.some(promises, 2) -- Only resolves with first 2 promises to resolve\\n```","params":[{"name":"promises","desc":"","lua_type":"{Promise<T>}"},{"name":"count","desc":"","lua_type":"number"}],"returns":[{"desc":"","lua_type":"Promise<{T}>"}],"function_type":"static","source":{"line":653,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"any","desc":"Accepts an array of Promises and returns a Promise that is resolved as soon as *any* of the input Promises resolves. It will reject only if *all* input Promises reject. As soon as one Promises resolves, all other pending Promises are cancelled if they have no other consumers.\\n\\nResolves directly with the value of the first resolved Promise. This is essentially [[Promise.some]] with `1` count, except the Promise resolves with the value directly instead of an array with one element.\\n\\n```lua\\nlocal promises = {\\n\\treturnsAPromise(\\"example 1\\"),\\n\\treturnsAPromise(\\"example 2\\"),\\n\\treturnsAPromise(\\"example 3\\"),\\n}\\n\\nreturn Promise.any(promises) -- Resolves with first value to resolve (only rejects if all 3 rejected)\\n```","params":[{"name":"promises","desc":"","lua_type":"{Promise<T>}"}],"returns":[{"desc":"","lua_type":"Promise<T>"}],"function_type":"static","source":{"line":677,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"allSettled","desc":"Accepts an array of Promises and returns a new Promise that resolves with an array of in-place Statuses when all input Promises have settled. This is equivalent to mapping `promise:finally` over the array of Promises.\\n\\n```lua\\nlocal promises = {\\n\\treturnsAPromise(\\"example 1\\"),\\n\\treturnsAPromise(\\"example 2\\"),\\n\\treturnsAPromise(\\"example 3\\"),\\n}\\n\\nreturn Promise.allSettled(promises)\\n```","params":[{"name":"promises","desc":"","lua_type":"{Promise<T>}"}],"returns":[{"desc":"","lua_type":"Promise<{Status}>"}],"function_type":"static","source":{"line":699,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"race","desc":"Accepts an array of Promises and returns a new promise that is resolved or rejected as soon as any Promise in the array resolves or rejects.\\n\\n:::warning\\nIf the first Promise to settle from the array settles with a rejection, the resulting Promise from `race` will reject.\\n\\nIf you instead want to tolerate rejections, and only care about at least one Promise resolving, you should use [Promise.any](#any) or [Promise.some](#some) instead.\\n:::\\n\\nAll other Promises that don\'t win the race will be cancelled if they have no other consumers.\\n\\n```lua\\nlocal promises = {\\n\\treturnsAPromise(\\"example 1\\"),\\n\\treturnsAPromise(\\"example 2\\"),\\n\\treturnsAPromise(\\"example 3\\"),\\n}\\n\\nreturn Promise.race(promises) -- Only returns 1st value to resolve or reject\\n```","params":[{"name":"promises","desc":"","lua_type":"{Promise<T>}"}],"returns":[{"desc":"","lua_type":"Promise<T>"}],"function_type":"static","source":{"line":777,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"each","desc":"Iterates serially over the given an array of values, calling the predicate callback on each value before continuing.\\n\\nIf the predicate returns a Promise, we wait for that Promise to resolve before moving on to the next item\\nin the array.\\n\\n:::info\\n`Promise.each` is similar to `Promise.all`, except the Promises are ran in order instead of all at once.\\n\\nBut because Promises are eager, by the time they are created, they\'re already running. Thus, we need a way to defer creation of each Promise until a later time.\\n\\nThe predicate function exists as a way for us to operate on our data instead of creating a new closure for each Promise. If you would prefer, you can pass in an array of functions, and in the predicate, call the function and return its return value.\\n:::\\n\\n```lua\\nPromise.each({\\n\\t\\"foo\\",\\n\\t\\"bar\\",\\n\\t\\"baz\\",\\n\\t\\"qux\\"\\n}, function(value, index)\\n\\treturn Promise.delay(1):andThen(function()\\n\\tprint((\\"%d) Got %s!\\"):format(index, value))\\n\\tend)\\nend)\\n\\n--[[\\n\\t(1 second passes)\\n\\t> 1) Got foo!\\n\\t(1 second passes)\\n\\t> 2) Got bar!\\n\\t(1 second passes)\\n\\t> 3) Got baz!\\n\\t(1 second passes)\\n\\t> 4) Got qux!\\n]]\\n```\\n\\nIf the Promise a predicate returns rejects, the Promise from `Promise.each` is also rejected with the same value.\\n\\nIf the array of values contains a Promise, when we get to that point in the list, we wait for the Promise to resolve before calling the predicate with the value.\\n\\nIf a Promise in the array of values is already Rejected when `Promise.each` is called, `Promise.each` rejects with that value immediately (the predicate callback will never be called even once). If a Promise in the list is already Cancelled when `Promise.each` is called, `Promise.each` rejects with `Promise.Error(Promise.Error.Kind.AlreadyCancelled`). If a Promise in the array of values is Started at first, but later rejects, `Promise.each` will reject with that value and iteration will not continue once iteration encounters that value.\\n\\nReturns a Promise containing an array of the returned/resolved values from the predicate for each item in the array of values.\\n\\nIf this Promise returned from `Promise.each` rejects or is cancelled for any reason, the following are true:\\n- Iteration will not continue.\\n- Any Promises within the array of values will now be cancelled if they have no other consumers.\\n- The Promise returned from the currently active predicate will be cancelled if it hasn\'t resolved yet.","params":[{"name":"list","desc":"","lua_type":"{T | Promise<T>}"},{"name":"predicate","desc":"","lua_type":"(value: T, index: number) -> U | Promise<U>"}],"returns":[{"desc":"","lua_type":"Promise<{U}>"}],"function_type":"static","since":"3.0.0","source":{"line":872,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"is","desc":"Checks whether the given object is a Promise via duck typing. This only checks if the object is a table and has an `andThen` method.","params":[{"name":"object","desc":"","lua_type":"any"}],"returns":[{"desc":"`true` if the given `object` is a Promise.","lua_type":"boolean"}],"function_type":"static","source":{"line":971,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"promisify","desc":"Wraps a function that yields into one that returns a Promise.\\n\\nAny errors that occur while executing the function will be turned into rejections.\\n\\n:::info\\n`Promise.promisify` is similar to [Promise.try](#try), except the callback is returned as a callable function instead of being invoked immediately.\\n:::\\n\\n```lua\\nlocal sleep = Promise.promisify(wait)\\n\\nsleep(1):andThen(print)\\n```\\n\\n```lua\\nlocal isPlayerInGroup = Promise.promisify(function(player, groupId)\\n\\treturn player:IsInGroup(groupId)\\nend)\\n```","params":[{"name":"callback","desc":"","lua_type":"(...: any) -> ...any"}],"returns":[{"desc":"","lua_type":"(...: any) -> Promise"}],"function_type":"static","source":{"line":1020,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"delay","desc":"Returns a Promise that resolves after `seconds` seconds have passed. The Promise resolves with the actual amount of time that was waited.\\n\\nThis function is **not** a wrapper around `wait`. `Promise.delay` uses a custom scheduler which provides more accurate timing. As an optimization, cancelling this Promise instantly removes the task from the scheduler.\\n\\n:::warning\\nPassing `NaN`, infinity, or a number less than 1/60 is equivalent to passing 1/60.\\n:::\\n\\n```lua\\n\\tPromise.delay(5):andThenCall(print, \\"This prints after 5 seconds\\")\\n```","params":[{"name":"seconds","desc":"","lua_type":"number"}],"returns":[{"desc":"","lua_type":"Promise<number>"}],"function_type":"static","source":{"line":1044,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"timeout","desc":"Returns a new Promise that resolves if the chained Promise resolves within `seconds` seconds, or rejects if execution time exceeds `seconds`. The chained Promise will be cancelled if the timeout is reached.\\n\\nRejects with `rejectionValue` if it is non-nil. If a `rejectionValue` is not given, it will reject with a `Promise.Error(Promise.Error.Kind.TimedOut)`. This can be checked with [[Error.isKind]].\\n\\n```lua\\ngetSomething():timeout(5):andThen(function(something)\\n\\t-- got something and it only took at max 5 seconds\\nend):catch(function(e)\\n\\t-- Either getting something failed or the time was exceeded.\\n\\n\\tif Promise.Error.isKind(e, Promise.Error.Kind.TimedOut) then\\n\\t\\twarn(\\"Operation timed out!\\")\\n\\telse\\n\\t\\twarn(\\"Operation encountered an error!\\")\\n\\tend\\nend)\\n```\\n\\nSugar for:\\n\\n```lua\\nPromise.race({\\n\\tPromise.delay(seconds):andThen(function()\\n\\t\\treturn Promise.reject(\\n\\t\\t\\trejectionValue == nil\\n\\t\\t\\tand Promise.Error.new({ kind = Promise.Error.Kind.TimedOut })\\n\\t\\t\\tor rejectionValue\\n\\t\\t)\\n\\tend),\\n\\tpromise\\n})\\n```","params":[{"name":"seconds","desc":"","lua_type":"number"},{"name":"rejectionValue?","desc":"The value to reject with if the timeout is reached","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"method","source":{"line":1180,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"getStatus","desc":"Returns the current Promise status.","params":[],"returns":[{"desc":"","lua_type":"Status"}],"function_type":"method","source":{"line":1204,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"andThen","desc":"Chains onto an existing Promise and returns a new Promise.\\n\\n:::warning\\nWithin the failure handler, you should never assume that the rejection value is a string. Some rejections within the Promise library are represented by [[Error]] objects. If you want to treat it as a string for debugging, you should call `tostring` on it first.\\n:::\\n\\nYou can return a Promise from the success or failure handler and it will be chained onto.\\n\\nCalling `andThen` on a cancelled Promise returns a cancelled Promise.\\n\\n:::tip\\nIf the Promise returned by `andThen` is cancelled, `successHandler` and `failureHandler` will not run.\\n\\nTo run code no matter what, use [Promise:finally].\\n:::","params":[{"name":"successHandler","desc":"","lua_type":"(...: any) -> ...any"},{"name":"failureHandler?","desc":"","lua_type":"(...: any) -> ...any"}],"returns":[{"desc":"","lua_type":"Promise<...any>"}],"function_type":"method","source":{"line":1283,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"catch","desc":"Shorthand for `Promise:andThen(nil, failureHandler)`.\\n\\nReturns a Promise that resolves if the `failureHandler` worked without encountering an additional error.\\n\\n:::warning\\nWithin the failure handler, you should never assume that the rejection value is a string. Some rejections within the Promise library are represented by [[Error]] objects. If you want to treat it as a string for debugging, you should call `tostring` on it first.\\n:::\\n\\nCalling `catch` on a cancelled Promise returns a cancelled Promise.\\n\\n:::tip\\nIf the Promise returned by `catch` is cancelled,  `failureHandler` will not run.\\n\\nTo run code no matter what, use [Promise:finally].\\n:::","params":[{"name":"failureHandler","desc":"","lua_type":"(...: any) -> ...any"}],"returns":[{"desc":"","lua_type":"Promise<...any>"}],"function_type":"method","source":{"line":1310,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"tap","desc":"Similar to [Promise.andThen](#andThen), except the return value is the same as the value passed to the handler. In other words, you can insert a `:tap` into a Promise chain without affecting the value that downstream Promises receive.\\n\\n```lua\\n\\tgetTheValue()\\n\\t:tap(print)\\n\\t:andThen(function(theValue)\\n\\t\\tprint(\\"Got\\", theValue, \\"even though print returns nil!\\")\\n\\tend)\\n```\\n\\nIf you return a Promise from the tap handler callback, its value will be discarded but `tap` will still wait until it resolves before passing the original value through.","params":[{"name":"tapHandler","desc":"","lua_type":"(...: any) -> ...any"}],"returns":[{"desc":"","lua_type":"Promise<...any>"}],"function_type":"method","source":{"line":1331,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"andThenCall","desc":"Attaches an `andThen` handler to this Promise that calls the given callback with the predefined arguments. The resolved value is discarded.\\n\\n```lua\\n\\tpromise:andThenCall(someFunction, \\"some\\", \\"arguments\\")\\n```\\n\\nThis is sugar for\\n\\n```lua\\n\\tpromise:andThen(function()\\n\\treturn someFunction(\\"some\\", \\"arguments\\")\\n\\tend)\\n```","params":[{"name":"callback","desc":"","lua_type":"(...: any) -> any"},{"name":"...?","desc":"Additional arguments which will be passed to `callback`","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"method","source":{"line":1366,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"andThenReturn","desc":"Attaches an `andThen` handler to this Promise that discards the resolved value and returns the given value from it.\\n\\n```lua\\n\\tpromise:andThenReturn(\\"some\\", \\"values\\")\\n```\\n\\nThis is sugar for\\n\\n```lua\\n\\tpromise:andThen(function()\\n\\t\\treturn \\"some\\", \\"values\\"\\n\\tend)\\n```\\n\\n:::caution\\nPromises are eager, so if you pass a Promise to `andThenReturn`, it will begin executing before `andThenReturn` is reached in the chain. Likewise, if you pass a Promise created from [[Promise.reject]] into `andThenReturn`, it\'s possible that this will trigger the unhandled rejection warning. If you need to return a Promise, it\'s usually best practice to use [[Promise.andThen]].\\n:::","params":[{"name":"...","desc":"Values to return from the function","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"method","source":{"line":1396,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"cancel","desc":"Cancels this promise, preventing the promise from resolving or rejecting. Does not do anything if the promise is already settled.\\n\\nCancellations will propagate upwards and downwards through chained promises.\\n\\nPromises will only be cancelled if all of their consumers are also cancelled. This is to say that if you call `andThen` twice on the same promise, and you cancel only one of the child promises, it will not cancel the parent promise until the other child promise is also cancelled.\\n\\n```lua\\n\\tpromise:cancel()\\n```","params":[],"returns":[],"function_type":"method","source":{"line":1414,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"finally","desc":"Set a handler that will be called regardless of the promise\'s fate. The handler is called when the promise is\\nresolved, rejected, *or* cancelled.\\n\\nReturns a new Promise that:\\n- resolves with the same values that this Promise resolves with.\\n- rejects with the same values that this Promise rejects with.\\n- is cancelled if this Promise is cancelled.\\n\\nIf the value you return from the handler is a Promise:\\n- We wait for the Promise to resolve, but we ultimately discard the resolved value.\\n- If the returned Promise rejects, the Promise returned from `finally` will reject with the rejected value from the\\n*returned* promise.\\n- If the `finally` Promise is cancelled, and you returned a Promise from the handler, we cancel that Promise too.\\n\\nOtherwise, the return value from the `finally` handler is entirely discarded.\\n\\n:::note Cancellation\\nAs of Promise v4, `Promise:finally` does not count as a consumer of the parent Promise for cancellation purposes.\\nThis means that if all of a Promise\'s consumers are cancelled and the only remaining callbacks are finally handlers,\\nthe Promise is cancelled and the finally callbacks run then and there.\\n\\nCancellation still propagates through the `finally` Promise though: if you cancel the `finally` Promise, it can cancel\\nits parent Promise if it had no other consumers. Likewise, if the parent Promise is cancelled, the `finally` Promise\\nwill also be cancelled.\\n:::\\n\\n```lua\\nlocal thing = createSomething()\\n\\ndoSomethingWith(thing)\\n\\t:andThen(function()\\n\\t\\tprint(\\"It worked!\\")\\n\\t\\t-- do something..\\n\\tend)\\n\\t:catch(function()\\n\\t\\twarn(\\"Oh no it failed!\\")\\n\\tend)\\n\\t:finally(function()\\n\\t\\t-- either way, destroy thing\\n\\n\\t\\tthing:Destroy()\\n\\tend)\\n\\n```","params":[{"name":"finallyHandler","desc":"","lua_type":"(status: Status) -> ...any"}],"returns":[{"desc":"","lua_type":"Promise<...any>"}],"function_type":"method","source":{"line":1559,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"finallyCall","desc":"Same as `andThenCall`, except for `finally`.\\n\\nAttaches a `finally` handler to this Promise that calls the given callback with the predefined arguments.","params":[{"name":"callback","desc":"","lua_type":"(...: any) -> any"},{"name":"...?","desc":"Additional arguments which will be passed to `callback`","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"method","source":{"line":1573,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"finallyReturn","desc":"Attaches a `finally` handler to this Promise that discards the resolved value and returns the given value from it.\\n\\n```lua\\n\\tpromise:finallyReturn(\\"some\\", \\"values\\")\\n```\\n\\nThis is sugar for\\n\\n```lua\\n\\tpromise:finally(function()\\n\\t\\treturn \\"some\\", \\"values\\"\\n\\tend)\\n```","params":[{"name":"...","desc":"Values to return from the function","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"method","source":{"line":1599,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"awaitStatus","desc":"Yields the current thread until the given Promise completes. Returns the Promise\'s status, followed by the values that the promise resolved or rejected with.","params":[],"returns":[{"desc":"The Status representing the fate of the Promise","lua_type":"Status"},{"desc":"The values the Promise resolved or rejected with.","lua_type":"...any"}],"function_type":"method","yields":true,"source":{"line":1613,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"await","desc":"Yields the current thread until the given Promise completes. Returns true if the Promise resolved, followed by the values that the promise resolved or rejected with.\\n\\n:::caution\\nIf the Promise gets cancelled, this function will return `false`, which is indistinguishable from a rejection. If you need to differentiate, you should use [[Promise.awaitStatus]] instead.\\n:::\\n\\n```lua\\n\\tlocal worked, value = getTheValue():await()\\n\\nif worked then\\n\\tprint(\\"got\\", value)\\nelse\\n\\twarn(\\"it failed\\")\\nend\\n```","params":[],"returns":[{"desc":"`true` if the Promise successfully resolved","lua_type":"boolean"},{"desc":"The values the Promise resolved or rejected with.","lua_type":"...any"}],"function_type":"method","yields":true,"source":{"line":1666,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"expect","desc":"Yields the current thread until the given Promise completes. Returns the values that the promise resolved with.\\n\\n```lua\\nlocal worked = pcall(function()\\n\\tprint(\\"got\\", getTheValue():expect())\\nend)\\n\\nif not worked then\\n\\twarn(\\"it failed\\")\\nend\\n```\\n\\nThis is essentially sugar for:\\n\\n```lua\\nselect(2, assert(promise:await()))\\n```\\n\\n**Errors** if the Promise rejects or gets cancelled.","params":[],"returns":[{"desc":"The values the Promise resolved with.","lua_type":"...any"}],"function_type":"method","errors":[{"lua_type":"any","desc":"Errors with the rejection value if this Promise rejects or gets cancelled."}],"yields":true,"source":{"line":1703,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"now","desc":"Chains a Promise from this one that is resolved if this Promise is already resolved, and rejected if it is not resolved at the time of calling `:now()`. This can be used to ensure your `andThen` handler occurs on the same frame as the root Promise execution.\\n\\n```lua\\ndoSomething()\\n\\t:now()\\n\\t:andThen(function(value)\\n\\t\\tprint(\\"Got\\", value, \\"synchronously.\\")\\n\\tend)\\n```\\n\\nIf this Promise is still running, Rejected, or Cancelled, the Promise returned from `:now()` will reject with the `rejectionValue` if passed, otherwise with a `Promise.Error(Promise.Error.Kind.NotResolvedInTime)`. This can be checked with [[Error.isKind]].","params":[{"name":"rejectionValue?","desc":"The value to reject with if the Promise isn\'t resolved","lua_type":"any"}],"returns":[{"desc":"","lua_type":"Promise"}],"function_type":"method","source":{"line":1889,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"retry","desc":"Repeatedly calls a Promise-returning function up to `times` number of times, until the returned Promise resolves.\\n\\nIf the amount of retries is exceeded, the function will return the latest rejected Promise.\\n\\n```lua\\nlocal function canFail(a, b, c)\\n\\treturn Promise.new(function(resolve, reject)\\n\\t\\t-- do something that can fail\\n\\n\\t\\tlocal failed, thing = doSomethingThatCanFail(a, b, c)\\n\\n\\t\\tif failed then\\n\\t\\t\\treject(\\"it failed\\")\\n\\t\\telse\\n\\t\\t\\tresolve(thing)\\n\\t\\tend\\n\\tend)\\nend\\n\\nlocal MAX_RETRIES = 10\\nlocal value = Promise.retry(canFail, MAX_RETRIES, \\"foo\\", \\"bar\\", \\"baz\\") -- args to send to canFail\\n```","params":[{"name":"callback","desc":"","lua_type":"(...: P) -> Promise<T>"},{"name":"times","desc":"","lua_type":"number"},{"name":"...?","desc":"","lua_type":"P"}],"returns":[{"desc":"","lua_type":"Promise<T>"}],"function_type":"static","since":"3.0.0","source":{"line":1934,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"retryWithDelay","desc":"Repeatedly calls a Promise-returning function up to `times` number of times, waiting `seconds` seconds between each\\nretry, until the returned Promise resolves.\\n\\nIf the amount of retries is exceeded, the function will return the latest rejected Promise.","params":[{"name":"callback","desc":"","lua_type":"(...: P) -> Promise<T>"},{"name":"times","desc":"","lua_type":"number"},{"name":"seconds","desc":"","lua_type":"number"},{"name":"...?","desc":"","lua_type":"P"}],"returns":[{"desc":"","lua_type":"Promise<T>"}],"function_type":"static","since":"v3.2.0","source":{"line":1962,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"fromEvent","desc":"Converts an event into a Promise which resolves the next time the event fires.\\n\\nThe optional `predicate` callback, if passed, will receive the event arguments and should return `true` or `false`, based on if this fired event should resolve the Promise or not. If `true`, the Promise resolves. If `false`, nothing happens and the predicate will be rerun the next time the event fires.\\n\\nThe Promise will resolve with the event arguments.\\n\\n:::tip\\nThis function will work given any object with a `Connect` method. This includes all Roblox events.\\n:::\\n\\n```lua\\n-- Creates a Promise which only resolves when `somePart` is touched\\n-- by a part named `\\"Something specific\\"`.\\nreturn Promise.fromEvent(somePart.Touched, function(part)\\n\\treturn part.Name == \\"Something specific\\"\\nend)\\n```","params":[{"name":"event","desc":"Any object with a `Connect` method. This includes all Roblox events.","lua_type":"Event"},{"name":"predicate?","desc":"A function which determines if the Promise should resolve with the given value, or wait for the next event to check again.","lua_type":"(...: P) -> boolean"}],"returns":[{"desc":"","lua_type":"Promise<P>"}],"function_type":"static","since":"3.0.0","source":{"line":2004,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}},{"name":"onUnhandledRejection","desc":"Registers a callback that runs when an unhandled rejection happens. An unhandled rejection happens when a Promise\\nis rejected, and the rejection is not observed with `:catch`.\\n\\nThe callback is called with the actual promise that rejected, followed by the rejection values.","params":[{"name":"callback","desc":"A callback that runs when an unhandled rejection happens.","lua_type":"(promise: Promise, ...: any)"}],"returns":[{"desc":"Function that unregisters the `callback` when called","lua_type":"() -> ()"}],"function_type":"static","since":"v3.2.0","source":{"line":2056,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}}],"properties":[{"name":"Status","desc":"A table containing all members of the `Status` enum, e.g., `Promise.Status.Resolved`.","lua_type":"Status","tags":["enums"],"readonly":true,"source":{"line":212,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}}],"types":[{"name":"Status","desc":"An enum value used to represent the Promise\'s status.","fields":[{"name":"Started","lua_type":"\\"Started\\"","desc":"The Promise is executing, and not settled yet."},{"name":"Resolved","lua_type":"\\"Resolved\\"","desc":"The Promise finished successfully."},{"name":"Rejected","lua_type":"\\"Rejected\\"","desc":"The Promise was rejected."},{"name":"Cancelled","lua_type":"\\"Cancelled\\"","desc":"The Promise was cancelled before it finished."}],"tags":["enum"],"source":{"line":205,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}}],"name":"Promise","desc":"A Promise is an object that represents a value that will exist in the future, but doesn\'t right now.\\nPromises allow you to then attach callbacks that can run once the value becomes available (known as *resolving*),\\nor if an error has occurred (known as *rejecting*).","source":{"line":220,"path":"src/ReplicatedStorage/Vendor/Promise.lua"}}')}}]);