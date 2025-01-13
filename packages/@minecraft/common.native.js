import { Types, CONTEXT } from "../api.js";
export const NumberRange = CONTEXT.registerType(
  "NumberRange",
  new Types.InterfaceBindType("NumberRange", null).addProperty("max").addProperty("min"),
);
CONTEXT.resolveAllDynamicTypes();
