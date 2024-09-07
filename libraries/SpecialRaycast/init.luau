local SpecialRaycastParams = require(script.SpecialRaycastParams)

local ATTEMPT_LIMIT: number = 12

local raycastParams: RaycastParams = RaycastParams.new()

--[=[
    @class SpecialRaycast

    Class to manage special raycasts
]=]
local SpecialRaycast = {}
SpecialRaycast.__index = SpecialRaycast
SpecialRaycast.SpecialRaycastParams = SpecialRaycastParams

--[=[
    Used to cast a raycast that filters and ignores certain objects uppon collision. Specially useful for more complex raycasting

    @param origin Vector3
    @param direction Vector3
    @param specialRaycastParams SpecialRaycastParams

    @return RaycastResult?
]=]
function SpecialRaycast:Cast(origin: Vector3, direction: Vector3, specialRaycastParams: SpecialRaycastParams.SpecialRaycastParams): RaycastResult?
	raycastParams.FilterDescendantsInstances = specialRaycastParams.FilterDescendantsInstances or {}
	raycastParams.CollisionGroup = specialRaycastParams.CollisionGroup or ""

	return self:_specialRaycast(origin, direction, raycastParams.FilterDescendantsInstances, specialRaycastParams, 0)
end

--[=[
    Used to cast a raycast that filters and ignores certain objects uppon collision. Specially useful for more complex raycasting

    @param origin CFrame
	@param size Vector3
    @param direction Vector3
    @param specialRaycastParams SpecialRaycastParams

    @return RaycastResult?
]=]
function SpecialRaycast:BlockCast(origin: CFrame, size: Vector3, direction: Vector3, specialRaycastParams: SpecialRaycastParams.SpecialRaycastParams): RaycastResult?
	raycastParams.FilterDescendantsInstances = specialRaycastParams.FilterDescendantsInstances or {}
	raycastParams.CollisionGroup = specialRaycastParams.CollisionGroup or ""

	return self:_blockCast(origin, size, direction, raycastParams.FilterDescendantsInstances, specialRaycastParams, 0)
end

--[=[
    Private method to manage the special raycasts logic

    @private

    @param origin CFrame
	@param size Vector3
    @param direction Vector3
    @param ignoreList {Instance}
    @param specialRaycastParams SpecialRaycastParams

    @return RaycastResult?
]=]
function SpecialRaycast:_blockCast(origin: CFrame, size: Vector3, direction: Vector3, ignoreList: {Instance}, specialRaycastParams: SpecialRaycastParams.SpecialRaycastParams, count: number): RaycastResult?
	raycastParams.FilterDescendantsInstances = ignoreList

	if direction.Magnitude > 1000 then
		return nil
	end
	
	local raycastResult: RaycastResult? = workspace:Blockcast(origin, size, direction, raycastParams)

	if not raycastResult  or count > ATTEMPT_LIMIT then
		return nil
	end

	if not specialRaycastParams.IgnoreProperties then
		return raycastResult
	end

	local foundProperties: boolean = specialRaycastParams.IgnoreProperties(raycastResult.Instance :: BasePart)

	if foundProperties then
		table.insert(ignoreList, raycastResult.Instance)

		return self:_blockCast(origin, size, direction, ignoreList, specialRaycastParams, count + 1)
	end

	return raycastResult
end


--[=[
    Private method to manage the special raycasts logic

    @private

    @param origin Vector3
    @param direction Vector3
    @param ignoreList {Instance}
    @param specialRaycastParams SpecialRaycastParams

    @return RaycastResult?
]=]
function SpecialRaycast:_specialRaycast(origin: Vector3, direction: Vector3, ignoreList: {Instance}, specialRaycastParams: SpecialRaycastParams.SpecialRaycastParams, count: number): RaycastResult?
	raycastParams.FilterDescendantsInstances = ignoreList
	local raycastResult: RaycastResult? = workspace:Raycast(origin, direction, raycastParams)

	if not raycastResult  or count > ATTEMPT_LIMIT then
		return nil
	end

	if not specialRaycastParams.IgnoreProperties then
		return raycastResult
	end

	local foundProperties: boolean = specialRaycastParams.IgnoreProperties(raycastResult.Instance :: BasePart)

	if foundProperties then
		table.insert(ignoreList, raycastResult.Instance)

		return self:_specialRaycast(origin, direction, ignoreList, specialRaycastParams, count + 1)
	end

	return raycastResult
end

export type SpecialRaycastParams = typeof(SpecialRaycastParams)

return SpecialRaycast