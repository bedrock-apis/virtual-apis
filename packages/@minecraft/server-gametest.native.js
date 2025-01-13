import { Types, CONTEXT } from "../api.js";
import * as __10 from "./common.native.js";
import * as __11 from "./server.native.js";
export const GameTestErrorContext = CONTEXT.registerType(
  "GameTestErrorContext",
  new Types.InterfaceBindType("GameTestErrorContext", null)
    .addProperty("absolutePosition")
    .addProperty("relativePosition")
    .addProperty("tickCount"),
);
export const MoveToOptions = CONTEXT.registerType(
  "MoveToOptions",
  new Types.InterfaceBindType("MoveToOptions", null).addProperty("faceTarget").addProperty("speed"),
);
export const FenceConnectivity = CONTEXT.createClassDefinition("FenceConnectivity", null, null, true);
export const GameTestDebug = CONTEXT.createClassDefinition("GameTestDebug", null, null, true)
  .addMethod("crash", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "debugFail",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "message",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "timeout",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "duration",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  );
export const GameTestSequence = CONTEXT.createClassDefinition("GameTestSequence", null, null, true)
  .addMethod(
    "thenExecute",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "thenExecuteAfter",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "delayTicks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "thenExecuteFor",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "tickCount",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "thenFail",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "errorMessage",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "thenIdle",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "delayTicks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod("thenSucceed", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "thenWait",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "thenWaitAfter",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "delayTicks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  );
export const NavigationResult = CONTEXT.createClassDefinition("NavigationResult", null, null, true).addMethod(
  "getPath",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const RegistrationBuilder = CONTEXT.createClassDefinition("RegistrationBuilder", null, null, true)
  .addMethod(
    "batch",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "batchName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "maxAttempts",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "attemptCount",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "maxTicks",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "tickCount",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "padding",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "paddingBlocks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "required",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "isRequired",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "requiredSuccessfulAttempts",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "attemptCount",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "rotateTest",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "rotate",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "setupTicks",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "tickCount",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "structureLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "structureLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "structureName",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "structureName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "tag",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "tag",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  );
export const SculkSpreader = CONTEXT.createClassDefinition("SculkSpreader", null, null, true)
  .addMethod(
    "addCursorsWithOffset",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "offset",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "charge",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "getCursorPosition",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "index",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod("getNumberOfCursors", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getTotalCharge", Types.ParamsDefinition.From(CONTEXT, []));
export const SimulatedPlayer = CONTEXT.createClassDefinition("SimulatedPlayer", __11.Player, null, true)
  .addMethod("attack", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "attackEntity",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
    ]),
  )
  .addMethod(
    "breakBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
        },
        name: "direction",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Direction",
        },
      },
    ]),
  )
  .addMethod(
    "chat",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "message",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("disconnect", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("dropSelectedItem", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("fly", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "giveItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
      {
        details: {
          default_value: false,
        },
        name: "selectSlot",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod("glide", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("interact", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "interactWithBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
        },
        name: "direction",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Direction",
        },
      },
    ]),
  )
  .addMethod(
    "interactWithEntity",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
    ]),
  )
  .addMethod("jump", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "lookAtBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 2,
        },
        name: "duration",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "LookDuration",
        },
      },
    ]),
  )
  .addMethod(
    "lookAtEntity",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: {
          default_value: 2,
        },
        name: "duration",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "LookDuration",
        },
      },
    ]),
  )
  .addMethod(
    "lookAtLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 2,
        },
        name: "duration",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "LookDuration",
        },
      },
    ]),
  )
  .addMethod(
    "move",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "westEast",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "northSouth",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 1,
          min_value: 0,
        },
        name: "speed",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "moveRelative",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "leftRight",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "backwardForward",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 1,
          min_value: 0,
        },
        name: "speed",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "moveToBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "options",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MoveToOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "moveToLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "options",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MoveToOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "navigateToBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 1,
          min_value: 0,
        },
        name: "speed",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "navigateToEntity",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 1,
          min_value: 0,
        },
        name: "speed",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "navigateToLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 1,
          min_value: 0,
        },
        name: "speed",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "navigateToLocations",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "locations",
        type: {
          element_type: {
            from_module: {
              name: "@minecraft/server",
              uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
              version: "2.0.0-alpha",
            },
            is_bind_type: true,
            is_errorable: false,
            name: "Vector3",
          },
          is_bind_type: false,
          is_errorable: false,
          name: "array",
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 1,
          min_value: 0,
        },
        name: "speed",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod("respawn", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "rotateBody",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "angleInDegrees",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "setBodyRotation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "angleInDegrees",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "setItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "slot",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          default_value: false,
        },
        name: "selectSlot",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "startBuild",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 0,
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "slot",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod("stopBreakingBlock", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("stopBuild", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("stopFlying", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("stopGliding", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("stopInteracting", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("stopMoving", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("stopSwimming", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("stopUsingItem", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("swim", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "useItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
    ]),
  )
  .addMethod(
    "useItemInSlot",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "slot",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "useItemInSlotOnBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "slot",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
        },
        name: "direction",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Direction",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "faceLocation",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            from_module: {
              name: "@minecraft/server",
              uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
              version: "2.0.0-alpha",
            },
            is_bind_type: true,
            is_errorable: false,
            name: "Vector3",
          },
        },
      },
    ]),
  )
  .addMethod(
    "useItemOnBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
        },
        name: "direction",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Direction",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "faceLocation",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            from_module: {
              name: "@minecraft/server",
              uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
              version: "2.0.0-alpha",
            },
            is_bind_type: true,
            is_errorable: false,
            name: "Vector3",
          },
        },
      },
    ]),
  );
export const Tags = CONTEXT.createClassDefinition("Tags", null, null, true);
export const Test = CONTEXT.createClassDefinition("Test", null, null, true)
  .addMethod(
    "assert",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "condition",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
      {
        details: null,
        name: "message",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "assertBlockPresent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "BlockType",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertBlockState",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                from_module: {
                  name: "@minecraft/server",
                  uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                  version: "2.0.0-alpha",
                },
                is_bind_type: true,
                is_errorable: false,
                name: "Block",
              },
            ],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "boolean",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "assertCanReachLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "mob",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "canReach",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertContainerContains",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "assertContainerEmpty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityHasArmor",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "armorSlot",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "armorName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "armorData",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "hasArmor",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityHasComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "componentIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "hasComponent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityInstancePresent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityInstancePresentInArea",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityPresent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 0,
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "searchDistance",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityPresentInArea",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityState",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                from_module: {
                  name: "@minecraft/server",
                  uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                  version: "2.0.0-alpha",
                },
                is_bind_type: true,
                is_errorable: false,
                name: "Entity",
              },
            ],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "boolean",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "assertEntityTouching",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isTouching",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertIsWaterlogged",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isWaterlogged",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertItemEntityCountIs",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "ItemType",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "searchDistance",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "count",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "assertItemEntityPresent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "ItemType",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 0,
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "searchDistance",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "assertRedstonePower",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "power",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "destroyBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: false,
        },
        name: "dropResources",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "fail",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "errorMessage",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "failIf",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "getBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod("getDimension", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getFenceConnectivity",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "getSculkSpreader",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod("getTestDirection", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "idle",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "tickDelay",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod("killAllEntities", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "onPlayerJump",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "mob",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "jumpAmount",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "pressButton",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "print",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "text",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "pullLever",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "pulseRedstone",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "duration",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "relativeBlockLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "worldBlockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "relativeLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "worldLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "removeSimulatedPlayer",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "simulatedPlayer",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "SimulatedPlayer",
        },
      },
    ]),
  )
  .addMethod(
    "rotateDirection",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "direction",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Direction",
        },
      },
    ]),
  )
  .addMethod(
    "rotateVector",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "vector",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "runAfterDelay",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "delayTicks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "runAtTickTime",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "tick",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "setBlockPermutation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockData",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "BlockPermutation",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "setBlockType",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "BlockType",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "setFluidContainer",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "type",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "FluidType",
        },
      },
    ]),
  )
  .addMethod(
    "setTntFuse",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "fuseLength",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "spawn",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "spawnAtLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "spawnItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "spawnSimulatedPlayer",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "Simulated Player",
        },
        name: "name",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: 0,
        },
        name: "gameMode",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "GameMode",
        },
      },
    ]),
  )
  .addMethod(
    "spawnWithoutBehaviors",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "spawnWithoutBehaviorsAtLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "spreadFromFaceTowardDirection",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "fromFace",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Direction",
        },
      },
      {
        details: null,
        name: "direction",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Direction",
        },
      },
    ]),
  )
  .addMethod("startSequence", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("succeed", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "succeedIf",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "succeedOnTick",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "tick",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "succeedOnTickWhen",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "tick",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "int32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "succeedWhen",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "succeedWhenBlockPresent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "BlockType",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "succeedWhenEntityHasComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "componentIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "hasComponent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "succeedWhenEntityPresent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entityTypeIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: true,
        },
        name: "isPresent",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "triggerInternalBlockEvent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "event",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: [],
        },
        name: "eventParameters",
        type: {
          element_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "float",
            valid_range: {
              max: 2147483647,
              min: -2147483648,
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "array",
        },
      },
    ]),
  )
  .addMethod(
    "until",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  )
  .addMethod(
    "walkTo",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "mob",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: null,
        name: "blockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "speedModifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "walkToLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "mob",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 1,
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "speedModifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "worldBlockLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "relativeBlockLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "worldLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "relativeLocation",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  );
CONTEXT.resolveAllDynamicTypes();
