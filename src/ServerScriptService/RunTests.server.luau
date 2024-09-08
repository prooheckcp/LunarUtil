local ReplicatedStorage = game:GetService("ReplicatedStorage")

local TestEz = require(ReplicatedStorage.TestEz)

TestEz.TestBootstrap:run({
    ReplicatedStorage.Packages
})