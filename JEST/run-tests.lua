local ReplicatedFirst = game:GetService("ReplicatedFirst")

local runCLI = require(ReplicatedFirst:WaitForChild("DevPackages"):WaitForChild("Jest")).runCLI

local processServiceExists, ProcessService = pcall(function()
	return game:GetService("ProcessService")
end)

local status, result = runCLI(ReplicatedFirst:WaitForChild("scripts"), {
	verbose = false,
	ci = false
}, { ReplicatedFirst.scripts }):awaitStatus()

if status == "Rejected" then
	print(result)
end

if status == "Resolved" and result.results.numFailedTestSuites == 0 and result.results.numFailedTests == 0 then
	if processServiceExists then
		ProcessService:ExitAsync(0)
	end
end

if processServiceExists then
	ProcessService:ExitAsync(1)
end

return nil