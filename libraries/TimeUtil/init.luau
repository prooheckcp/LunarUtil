local MINUTES = 60
local HOURS = MINUTES * 60
local DAYS = HOURS * 24

local TIME_SCOPES = {
	{Name = "Day", Value = DAYS},
	{Name = "Hour", Value = HOURS},
	{Name = "Minute", Value = MINUTES},
}

local DEFAULT_DATE_SCOPE: number = 2

export type TimeScope = {
	Name: string,
	Value: number,
}

local TimeUtil = {}

function TimeUtil:GetTextFormattedDate(time: number, scope: number?)
	scope = scope or DEFAULT_DATE_SCOPE
	local finalText = ""

	for i = 1, #TIME_SCOPES do
		local timeScope: TimeScope = TIME_SCOPES[i]

		local filteredTime = math.floor(time/timeScope.Value)
		time -= filteredTime * timeScope.Value -- Deduct from total time

		if filteredTime <= 0 then
			continue
		end
		
		scope -= 1
		finalText = finalText..string.format(
			"%s%d %s%s", 
			finalText ~= "" and ", " or "", 
			filteredTime, 
			timeScope.Name, 
			filteredTime > 1 and "s" or "", 
			scope <= 0
		)
			
		if scope <= 0 then
			break
		end
	end

	return finalText
end

return TimeUtil