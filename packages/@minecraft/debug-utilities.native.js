import { Types, CONTEXT } from "../api.js";
import * as __10 from "./common.native.js";
export const RuntimeStats = CONTEXT.registerType(
  "RuntimeStats",
  new Types.InterfaceBindType("RuntimeStats", null)
    .addProperty("arrayCount")
    .addProperty("atomCount")
    .addProperty("atomSize")
    .addProperty("fastArrayCount")
    .addProperty("fastArrayElementCount")
    .addProperty("functionCodeSize")
    .addProperty("functionCount")
    .addProperty("functionLineCount")
    .addProperty("functionSize")
    .addProperty("memoryAllocatedCount")
    .addProperty("memoryAllocatedSize")
    .addProperty("memoryUsedCount")
    .addProperty("memoryUsedSize")
    .addProperty("objectCount")
    .addProperty("objectSize")
    .addProperty("propertyCount")
    .addProperty("propertySize")
    .addProperty("stringCount")
    .addProperty("stringSize"),
);
CONTEXT.resolveAllDynamicTypes();
