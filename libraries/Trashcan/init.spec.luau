return function ()
    local Trashcan = require(script.Parent)
    
    describe("Poop", function()
        it("should be brown", function()
            expect("brown").to.equal("brown")
        end)
    end)
end