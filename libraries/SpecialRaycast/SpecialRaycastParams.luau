local SpecialRaycastParams = {}
SpecialRaycastParams.__index = SpecialRaycastParams
SpecialRaycastParams.CollisionGroup = nil :: string?
SpecialRaycastParams.FilterDescendantsInstances = nil :: {Instance}?
SpecialRaycastParams.IgnoreProperties = nil :: ((part: BasePart) -> boolean)?

function SpecialRaycastParams.new()
	local self = setmetatable({}, SpecialRaycastParams)
	self.FilterDescendantsInstances = {}
	self.IgnoreProperties = {}

	return self
end

export type SpecialRaycastParams = typeof(SpecialRaycastParams)

return SpecialRaycastParams