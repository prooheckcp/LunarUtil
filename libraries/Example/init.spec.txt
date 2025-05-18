return function ()
    local Trashcan = require(script.Parent)
    
    describe("Empty", function()
        local newTrashcan = Trashcan.new()
        local instance: Instance = Instance.new("Part")
        instance.Parent = workspace
        local connection = instance.AttributeChanged:Connect(function() end)

        newTrashcan:Collect(instance)
        newTrashcan:Collect(connection)

        it("should hold connecitons before being called", function()
            expect(next(newTrashcan._Connections)).to.be.ok()
        end)

        newTrashcan:Empty()

        it("shouldn't hold any connections", function()
            expect(next(newTrashcan._Connections)).never.to.be.ok()
        end)
    end)

    describe("Collect", function()
        local newTrashcan = Trashcan.new()
        local instance: Instance = Instance.new("Part")
        local collectedInstance = newTrashcan:Collect(instance)

        it("should return an instance", function()
            expect(collectedInstance).to.be.a("BasePart")
            expect(collectedInstance).never.to.be.ok()
        end)

        it("should be the same as the original instance", function()
            expect(collectedInstance).to.equal(instance)
        end)

        it("should not accept non-Instance objects", function()
            expect(function()
                newTrashcan:Collect("string")
            end).to.throw()

            expect(function()
                newTrashcan:Collect(123)
            end).to.throw()

            expect(function()
                newTrashcan:Collect({})
            end).to.throw()
        end)

        it("should not accept nil objects", function()
            expect(function()
                newTrashcan:Collect(nil)
            end).to.throw()
        end)
    end)

    describe("Clone", function()
        local newTrashcan = Trashcan.new()
        local instance: Instance = Instance.new("Part")
        local clonedInstance = newTrashcan:Clone(instance)

        it("should return an instance", function()
            expect(clonedInstance).to.be.an("Instance")
            expect(clonedInstance).never.to.be.ok()
        end)

        it("should be different from the original instance", function()
            expect(clonedInstance).never.to.equal(instance)
        end)

        it("should not accept non-Instance objects", function()
            expect(function()
                newTrashcan:Clone("string")
            end).to.throw()

            expect(function()
                newTrashcan:Clone(123)
            end).to.throw()

            expect(function()
                newTrashcan:Clone({})
            end).to.throw()
        end)
    end)

    describe("Destroy", function()
        local newTrashcan = Trashcan.new()
        local instance: Instance = Instance.new("Part")
        instance.Parent = workspace
        local connection = instance.AttributeChanged:Connect(function() end)

        newTrashcan:Collect(instance)
        newTrashcan:Collect(connection)

        newTrashcan:Destroy()

        it("shouldn't hold any connections", function()
            expect(next(newTrashcan._Connections)).never.to.be.ok()
        end)

        it("shouldn't be accessible", function()
            expect(function()
                newTrashcan:Collect(instance)
            end).to.throw()
        end)

        it("should destroy the instance", function()
            expect(instance.Parent).never.to.be.ok()
        end)
    end)
end