import { Types, CONTEXT } from "../api.js";
import * as __10 from "./common.native.js";
import * as __11 from "./server.native.js";
export const BlockMaskList = CONTEXT.registerType(
  "BlockMaskList",
  new Types.InterfaceBindType("BlockMaskList", null).addProperty("blockList").addProperty("maskType"),
);
export const BrushShape = CONTEXT.registerType(
  "BrushShape",
  new Types.InterfaceBindType("BrushShape", null).addProperty("icon").addProperty("name"),
);
export const ClipboardWriteOptions = CONTEXT.registerType(
  "ClipboardWriteOptions",
  new Types.InterfaceBindType("ClipboardWriteOptions", null)
    .addProperty("mirror")
    .addProperty("normalizedOrigin")
    .addProperty("offset")
    .addProperty("rotation"),
);
export const CursorProperties = CONTEXT.registerType(
  "CursorProperties",
  new Types.InterfaceBindType("CursorProperties", null)
    .addProperty("controlMode")
    .addProperty("fillColor")
    .addProperty("fixedModeDistance")
    .addProperty("outlineColor")
    .addProperty("projectThroughLiquid")
    .addProperty("targetMode")
    .addProperty("visible"),
);
export const CursorRay = CONTEXT.registerType(
  "CursorRay",
  new Types.InterfaceBindType("CursorRay", null).addProperty("end").addProperty("hit").addProperty("start"),
);
export const DataTransferCollectionNameData = CONTEXT.registerType(
  "DataTransferCollectionNameData",
  new Types.InterfaceBindType("DataTransferCollectionNameData", null)
    .addProperty("nameStringId")
    .addProperty("uniqueId"),
);
export const EditorStructure = CONTEXT.registerType(
  "EditorStructure",
  new Types.InterfaceBindType("EditorStructure", null)
    .addProperty("storageLocation")
    .addProperty("structure")
    .addProperty("tags"),
);
export const EditorStructureSearchOptions = CONTEXT.registerType(
  "EditorStructureSearchOptions",
  new Types.InterfaceBindType("EditorStructureSearchOptions", null)
    .addProperty("excludeTags")
    .addProperty("idPattern")
    .addProperty("includeLocation")
    .addProperty("includeTags"),
);
export const ExtensionOptionalParameters = CONTEXT.registerType(
  "ExtensionOptionalParameters",
  new Types.InterfaceBindType("ExtensionOptionalParameters", null)
    .addProperty("description")
    .addProperty("notes")
    .addProperty("toolGroupId"),
);
export const GameOptions = CONTEXT.registerType(
  "GameOptions",
  new Types.InterfaceBindType("GameOptions", null)
    .addProperty("bonusChest")
    .addProperty("cheats")
    .addProperty("commandBlockEnabled")
    .addProperty("daylightCycle")
    .addProperty("difficulty")
    .addProperty("dimensionId")
    .addProperty("disableWeather")
    .addProperty("educationEdition")
    .addProperty("entitiesDropLoot")
    .addProperty("exportType")
    .addProperty("fireSpreads")
    .addProperty("friendlyFire")
    .addProperty("gameMode")
    .addProperty("hardcore")
    .addProperty("immediateRespawn")
    .addProperty("keepInventory")
    .addProperty("lanVisibility")
    .addProperty("mobGriefing")
    .addProperty("mobLoot")
    .addProperty("mobSpawning")
    .addProperty("multiplayerGame")
    .addProperty("naturalRegeneration")
    .addProperty("playerAccess")
    .addProperty("playerPermissions")
    .addProperty("randomTickSpeed")
    .addProperty("recipeUnlocking")
    .addProperty("respawnBlocksExplode")
    .addProperty("respawnRadius")
    .addProperty("showCoordinates")
    .addProperty("showDaysPlayed")
    .addProperty("simulationDistance")
    .addProperty("spawnPosition")
    .addProperty("startingMap")
    .addProperty("tileDrops")
    .addProperty("timeOfDay")
    .addProperty("tntExplodes")
    .addProperty("weather")
    .addProperty("worldName"),
);
export const InputBindingInfo = CONTEXT.registerType(
  "InputBindingInfo",
  new Types.InterfaceBindType("InputBindingInfo", null)
    .addProperty("actionId")
    .addProperty("canRebind")
    .addProperty("label")
    .addProperty("tooltip"),
);
export const LogProperties = CONTEXT.registerType(
  "LogProperties",
  new Types.InterfaceBindType("LogProperties", null).addProperty("player").addProperty("tags"),
);
export const ProjectExportOptions = CONTEXT.registerType(
  "ProjectExportOptions",
  new Types.InterfaceBindType("ProjectExportOptions", null)
    .addProperty("alwaysDay")
    .addProperty("difficulty")
    .addProperty("disableWeather")
    .addProperty("exportName")
    .addProperty("exportType")
    .addProperty("gameMode")
    .addProperty("initialTimOfDay"),
);
export const SettingsUIElementOptions = CONTEXT.registerType(
  "SettingsUIElementOptions",
  new Types.InterfaceBindType("SettingsUIElementOptions", null)
    .addProperty("dropdownItems")
    .addProperty("max")
    .addProperty("min")
    .addProperty("refreshOnChange"),
);
export const WeightedBlock = CONTEXT.registerType(
  "WeightedBlock",
  new Types.InterfaceBindType("WeightedBlock", null).addProperty("block").addProperty("weight"),
);
export const WidgetComponentBaseOptions = CONTEXT.registerType(
  "WidgetComponentBaseOptions",
  new Types.InterfaceBindType("WidgetComponentBaseOptions", null)
    .addProperty("lockToSurface")
    .addProperty("offset")
    .addProperty("stateChangeEvent")
    .addProperty("visible"),
);
export const WidgetComponentClipboardOptions = CONTEXT.registerType(
  "WidgetComponentClipboardOptions",
  new Types.InterfaceBindType("WidgetComponentClipboardOptions", WidgetComponentBaseOptions)
    .addProperty("boundsFillColor")
    .addProperty("boundsOutlineColor")
    .addProperty("clipboardMirror")
    .addProperty("clipboardNormalizedOrigin")
    .addProperty("clipboardOffset")
    .addProperty("clipboardRotation")
    .addProperty("showBounds"),
);
export const WidgetComponentEntityOptions = CONTEXT.registerType(
  "WidgetComponentEntityOptions",
  new Types.InterfaceBindType("WidgetComponentEntityOptions", WidgetComponentBaseOptions)
    .addProperty("deselectedAnimation")
    .addProperty("isClickable")
    .addProperty("selectedAnimation"),
);
export const WidgetComponentGizmoOptions = CONTEXT.registerType(
  "WidgetComponentGizmoOptions",
  new Types.InterfaceBindType("WidgetComponentGizmoOptions", WidgetComponentBaseOptions),
);
export const WidgetComponentGuideOptions = CONTEXT.registerType(
  "WidgetComponentGuideOptions",
  new Types.InterfaceBindType("WidgetComponentGuideOptions", WidgetComponentBaseOptions),
);
export const WidgetComponentRenderPrimitiveOptions = CONTEXT.registerType(
  "WidgetComponentRenderPrimitiveOptions",
  new Types.InterfaceBindType("WidgetComponentRenderPrimitiveOptions", WidgetComponentBaseOptions),
);
export const WidgetComponentSplineOptions = CONTEXT.registerType(
  "WidgetComponentSplineOptions",
  new Types.InterfaceBindType("WidgetComponentSplineOptions", WidgetComponentBaseOptions)
    .addProperty("controlPoints")
    .addProperty("splineType"),
);
export const WidgetComponentTextOptions = CONTEXT.registerType(
  "WidgetComponentTextOptions",
  new Types.InterfaceBindType("WidgetComponentTextOptions", WidgetComponentBaseOptions).addProperty("color"),
);
export const WidgetCreateOptions = CONTEXT.registerType(
  "WidgetCreateOptions",
  new Types.InterfaceBindType("WidgetCreateOptions", null)
    .addProperty("bindPositionToBlockCursor")
    .addProperty("collisionOffset")
    .addProperty("collisionRadius")
    .addProperty("lockToSurface")
    .addProperty("selectable")
    .addProperty("snapToBlockLocation")
    .addProperty("stateChangeEvent")
    .addProperty("visible"),
);
export const WidgetGroupCreateOptions = CONTEXT.registerType(
  "WidgetGroupCreateOptions",
  new Types.InterfaceBindType("WidgetGroupCreateOptions", null)
    .addProperty("groupSelectionMode")
    .addProperty("showBounds")
    .addProperty("visible"),
);
export const BlockPalette = CONTEXT.createClassDefinition(
  "BlockPalette",
  null,
  Types.ParamsDefinition.From(CONTEXT, []),
  true,
)
  .addMethod(
    "getItem",
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
  .addMethod(
    "removeItemAt",
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
  .addMethod("removeItems", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockPaletteItem",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "IBlockPaletteItem",
        },
      },
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
  );
export const BlockPaletteManager = CONTEXT.createClassDefinition("BlockPaletteManager", null, null, true)
  .addMethod(
    "addOrReplacePalette",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "paletteId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "palette",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockPalette",
        },
      },
    ]),
  )
  .addMethod(
    "getPalette",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "paletteId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getPaletteIdList", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getPaletteItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "paletteId",
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
  .addMethod("getPrimaryPalette", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getSelectedBlockType", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getSelectedItem", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "removePalette",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "paletteId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "setPaletteItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "paletteId",
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
      {
        details: null,
        name: "item",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "IBlockPaletteItem",
        },
      },
    ]),
  )
  .addMethod(
    "setPrimaryPalette",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "paletteId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "setSelectedItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "item",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "IBlockPaletteItem",
        },
      },
    ]),
  );
export const BrushShapeManager = CONTEXT.createClassDefinition("BrushShapeManager", null, null, true)
  .addMethod("activateBrushTool", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "beginPainting",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "onComplete",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "PaintCompletionState",
              },
            ],
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
  .addMethod("deactivateBrushTool", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "endPainting",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "cancelled",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod("getBrushShapeOffset", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getSettingsUIElements",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "brushName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "registerBrushShape",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "name",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "icon",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "rebuild",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
              },
              is_bind_type: true,
              is_errorable: true,
              name: "CompoundBlockVolume",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
      {
        details: null,
        name: "getSettingsUIElements",
        type: {
          closure_type: {
            argument_types: [],
            return_type: {
              element_type: {
                is_bind_type: true,
                is_errorable: false,
                name: "SettingsUIElement",
              },
              is_bind_type: false,
              is_errorable: true,
              name: "array",
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
    "setBrushMask",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "mask",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockMaskList",
        },
      },
    ]),
  )
  .addMethod(
    "setBrushShape",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "shape",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              element_type: {
                from_module: {
                  name: "@minecraft/server",
                  uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                  version: "1.17.0-beta",
                },
                is_bind_type: true,
                is_errorable: false,
                name: "Vector3",
              },
              is_bind_type: false,
              is_errorable: false,
              name: "array",
            },
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "CompoundBlockVolume",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "setBrushShapeOffset",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "offset",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "singlePaint",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "onComplete",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "PaintCompletionState",
              },
            ],
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
    "switchBrushPaintMode",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "paintMode",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "PaintMode",
        },
      },
    ]),
  )
  .addMethod(
    "switchBrushShape",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "name",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "uiSettingValueChanged",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "elementName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "newValue",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: false,
              is_errorable: false,
              name: "boolean",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "float",
              valid_range: {
                max: 2147483647,
                min: -2147483648,
              },
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "Vector3",
            },
          ],
        },
      },
    ]),
  );
export const ClipboardChangeAfterEvent = CONTEXT.createClassDefinition("ClipboardChangeAfterEvent", null, null, true);
export const ClipboardChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "ClipboardChangeAfterEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "ClipboardChangeAfterEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "ClipboardChangeAfterEvent",
              },
            ],
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
export const ClipboardItem = CONTEXT.createClassDefinition("ClipboardItem", null, null, true)
  .addMethod("clear", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getPredictedWriteAsCompoundBlockVolume",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
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
            name: "ClipboardWriteOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getPredictedWriteAsSelection",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
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
            name: "ClipboardWriteOptions",
          },
        },
      },
    ]),
  )
  .addMethod("getSize", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "readFromSelection",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "selection",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Selection",
        },
      },
    ]),
  )
  .addMethod(
    "readFromStructure",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "structure",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "EditorStructure",
        },
      },
    ]),
  )
  .addMethod(
    "readFromWorld",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "from",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "to",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "writeToWorld",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
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
            name: "ClipboardWriteOptions",
          },
        },
      },
    ]),
  );
export const ClipboardManager = CONTEXT.createClassDefinition("ClipboardManager", null, null, true).addMethod(
  "create",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const CurrentThemeChangeAfterEvent = CONTEXT.createClassDefinition(
  "CurrentThemeChangeAfterEvent",
  null,
  null,
  true,
);
export const CurrentThemeChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "CurrentThemeChangeAfterEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CurrentThemeChangeAfterEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CurrentThemeChangeAfterEvent",
              },
            ],
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
export const CurrentThemeColorChangeAfterEvent = CONTEXT.createClassDefinition(
  "CurrentThemeColorChangeAfterEvent",
  null,
  null,
  true,
);
export const CurrentThemeColorChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "CurrentThemeColorChangeAfterEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CurrentThemeColorChangeAfterEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CurrentThemeColorChangeAfterEvent",
              },
            ],
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
export const Cursor = CONTEXT.createClassDefinition("Cursor", null, null, true)
  .addMethod("getPosition", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getProperties", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getRay", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("hide", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "moveBy",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "offset",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod("resetToDefaultState", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setProperties",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "properties",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "CursorProperties",
        },
      },
    ]),
  )
  .addMethod("show", Types.ParamsDefinition.From(CONTEXT, []));
export const CursorPropertiesChangeAfterEvent = CONTEXT.createClassDefinition(
  "CursorPropertiesChangeAfterEvent",
  null,
  null,
  true,
);
export const CursorPropertyChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "CursorPropertyChangeAfterEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CursorPropertiesChangeAfterEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CursorPropertiesChangeAfterEvent",
              },
            ],
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
export const DataStore = CONTEXT.createClassDefinition("DataStore", null, null, true);
export const DataStoreActionBarContainer = CONTEXT.createClassDefinition(
  "DataStoreActionBarContainer",
  null,
  null,
  true,
)
  .addMethod(
    "getItemPayload",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getItemProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasItemPayload",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasItemProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "registerItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "unregisterItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "updateRegisteredItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "updateRegisteredItemProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  );
export const DataStoreActionContainer = CONTEXT.createClassDefinition("DataStoreActionContainer", null, null, true)
  .addMethod(
    "bindActionToControl",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "controlId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "actionPayload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "removeActionFromControl",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "controlId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "actionPayload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
        },
      },
    ]),
  );
export const DataStoreAfterEvents = CONTEXT.createClassDefinition("DataStoreAfterEvents", null, null, true);
export const DataStoreMenuContainer = CONTEXT.createClassDefinition("DataStoreMenuContainer", null, null, true)
  .addMethod(
    "createItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "destroyItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getPayload",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasPayload",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "updateItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  );
export const DataStoreModalToolActivationChangedEvent = CONTEXT.createClassDefinition(
  "DataStoreModalToolActivationChangedEvent",
  null,
  null,
  true,
);
export const DataStoreModalToolActivationChangedEventSignal = CONTEXT.createClassDefinition(
  "DataStoreModalToolActivationChangedEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "DataStoreModalToolActivationChangedEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "DataStoreModalToolActivationChangedEvent",
              },
            ],
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
export const DataStoreModalToolContainer = CONTEXT.createClassDefinition(
  "DataStoreModalToolContainer",
  null,
  null,
  true,
)
  .addMethod("getSelectedTool", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getToolPayload",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getToolProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasToolPayload",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasToolProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "registerTool",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "unregisterTool",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "updateRegisteredTool",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "updateRegisteredToolProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "payload",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "updateSelectedTool",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "toolId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
        },
      },
    ]),
  );
export const DataStorePayloadAfterEvent = CONTEXT.createClassDefinition("DataStorePayloadAfterEvent", null, null, true);
export const DataStorePayloadAfterEventSignal = CONTEXT.createClassDefinition(
  "DataStorePayloadAfterEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "DataStorePayloadAfterEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "DataStorePayloadAfterEvent",
              },
            ],
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
export const DataTransferManager = CONTEXT.createClassDefinition("DataTransferManager", null, null, true)
  .addMethod("getRegisteredAccessors", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "requestData",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "collectionUniqueId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "sendData",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "collectionUniqueId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "jsonData",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "sendDataToClipboard",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "jsonData",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  );
export const DataTransferRequestResponse = CONTEXT.createClassDefinition(
  "DataTransferRequestResponse",
  null,
  null,
  true,
);
export const EditorStructureManager = CONTEXT.createClassDefinition("EditorStructureManager", null, null, true)
  .addMethod(
    "createFromClipboardItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "item",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ClipboardItem",
        },
      },
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
  .addMethod("getExistingTags", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "loadStructure",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "saveStructure",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "structure",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "EditorStructure",
        },
      },
    ]),
  )
  .addMethod(
    "searchStructures",
    Types.ParamsDefinition.From(CONTEXT, [
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
            name: "EditorStructureSearchOptions",
          },
        },
      },
    ]),
  );
export const ExportManager = CONTEXT.createClassDefinition("ExportManager", null, null, true)
  .addMethod(
    "beginExportProject",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "options",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "GameOptions",
        },
      },
    ]),
  )
  .addMethod("canExportProject", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getGameOptions",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "useDefault",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "boolean",
          },
        },
      },
    ]),
  )
  .addMethod("getGameVersion", Types.ParamsDefinition.From(CONTEXT, []));
export const Extension = CONTEXT.createClassDefinition("Extension", null, null, true);
export const ExtensionContext = CONTEXT.createClassDefinition("ExtensionContext", null, null, true);
export const ExtensionContextAfterEvents = CONTEXT.createClassDefinition(
  "ExtensionContextAfterEvents",
  null,
  null,
  true,
);
export const GraphicsSettings = CONTEXT.createClassDefinition("GraphicsSettings", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "GraphicsSettingsProperty",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "set",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "property",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "GraphicsSettingsProperty",
        },
      },
      {
        details: null,
        name: "value",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: false,
              is_errorable: false,
              name: "boolean",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "int32",
              valid_range: {
                max: 2147483647,
                min: -2147483648,
              },
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "setAll",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "properties",
        type: {
          is_bind_type: false,
          is_errorable: false,
          key_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
          name: "map",
          value_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "optional",
            optional_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "variant",
              variant_types: [
                {
                  is_bind_type: false,
                  is_errorable: false,
                  name: "boolean",
                },
                {
                  is_bind_type: false,
                  is_errorable: false,
                  name: "int32",
                  valid_range: {
                    max: 2147483647,
                    min: -2147483648,
                  },
                },
                {
                  is_bind_type: false,
                  is_errorable: false,
                  name: "string",
                },
              ],
            },
          },
        },
      },
    ]),
  );
export const IBlockPaletteItem = CONTEXT.createClassDefinition("IBlockPaletteItem", null, null, true)
  .addMethod("getBlock", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getDisplayName", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getType", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "block",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "BlockPermutation",
            },
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
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
    ]),
  );
export const InputService = CONTEXT.createClassDefinition("InputService", null, null, true)
  .addMethod("focusViewport", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "registerKeyBinding",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "contextId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "bindingId",
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
        name: "key",
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
        name: "modifier",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "InputModifier",
        },
      },
      {
        details: null,
        name: "info",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "InputBindingInfo",
        },
      },
    ]),
  )
  .addMethod(
    "unregisterKeyBinding",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "controlId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "bindingId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  );
export const InternalPlayerServiceContext = CONTEXT.createClassDefinition(
  "InternalPlayerServiceContext",
  null,
  null,
  true,
);
export const Logger = CONTEXT.createClassDefinition("Logger", null, null, true)
  .addMethod(
    "debug",
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
      {
        details: {
          default_value: "null",
        },
        name: "properties",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "LogProperties",
          },
        },
      },
    ]),
  )
  .addMethod(
    "error",
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
      {
        details: {
          default_value: "null",
        },
        name: "properties",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "LogProperties",
          },
        },
      },
    ]),
  )
  .addMethod(
    "info",
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
      {
        details: {
          default_value: "null",
        },
        name: "properties",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "LogProperties",
          },
        },
      },
    ]),
  )
  .addMethod(
    "warning",
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
      {
        details: {
          default_value: "null",
        },
        name: "properties",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "LogProperties",
          },
        },
      },
    ]),
  );
export const MinecraftEditor = CONTEXT.createClassDefinition("MinecraftEditor", null, null, true);
export const MinecraftEditorInternal = CONTEXT.createClassDefinition("MinecraftEditorInternal", null, null, true)
  .addMethod(
    "fireTelemetryEvent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
      {
        details: null,
        name: "source",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "eventName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "metadata",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getMapColorUnsafe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
      {
        details: null,
        name: "coordinate",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "getPlayerServices",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
    ]),
  )
  .addMethod(
    "registerExtension",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "extensionName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "activationFunction",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "ExtensionContext",
              },
            ],
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
      {
        details: null,
        name: "shutdownFunction",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "ExtensionContext",
              },
            ],
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
            name: "ExtensionOptionalParameters",
          },
        },
      },
    ]),
  );
export const ModeChangeAfterEvent = CONTEXT.createClassDefinition("ModeChangeAfterEvent", null, null, true);
export const ModeChangeAfterEventSignal = CONTEXT.createClassDefinition("ModeChangeAfterEventSignal", null, null, true)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "ModeChangeAfterEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "ModeChangeAfterEvent",
              },
            ],
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
export const PlaytestManager = CONTEXT.createClassDefinition("PlaytestManager", null, null, true)
  .addMethod(
    "beginPlaytest",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "options",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "GameOptions",
        },
      },
    ]),
  )
  .addMethod("getPlaytestSessionAvailability", Types.ParamsDefinition.From(CONTEXT, []));
export const PrimarySelectionChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "PrimarySelectionChangeAfterEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "SelectionEventAfterEvent",
              },
            ],
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
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "SelectionEventAfterEvent",
              },
            ],
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
export const PrimarySelectionChangedEvent = CONTEXT.createClassDefinition(
  "PrimarySelectionChangedEvent",
  null,
  null,
  true,
);
export const ProbabilityBlockPaletteItem = CONTEXT.createClassDefinition(
  "ProbabilityBlockPaletteItem",
  IBlockPaletteItem,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: {
        default_value: "null",
      },
      name: "displayName",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "optional",
        optional_type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    },
  ]),
  true,
)
  .addMethod(
    "addBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "block",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "BlockPermutation",
            },
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
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
        details: {
          max_value: 100,
          min_value: 1,
        },
        name: "weight",
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
  .addMethod("getBlocks", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "removeBlockAt",
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
  );
export const Selection = CONTEXT.createClassDefinition("Selection", null, null, true)
  .addMethod("clear", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getBlockLocationIterator", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getBoundingBox", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getFillColor", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getOutlineColor", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getVolumeOrigin", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "moveBy",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "delta",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "moveTo",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "peekLastVolume",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "forceRelativity",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            from_module: {
              name: "@minecraft/server",
              uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
              version: "1.17.0-beta",
            },
            is_bind_type: true,
            is_errorable: false,
            name: "CompoundBlockVolumePositionRelativity",
          },
        },
      },
    ]),
  )
  .addMethod("popVolume", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "pushVolume",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "item",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "CompoundBlockVolumeItem",
        },
      },
    ]),
  )
  .addMethod(
    "set",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "other",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "1.17.0-beta",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "CompoundBlockVolume",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "Selection",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "setFillColor",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "color",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "RGBA",
        },
      },
    ]),
  )
  .addMethod(
    "setOutlineColor",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "color",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "RGBA",
        },
      },
    ]),
  );
export const SelectionEventAfterEvent = CONTEXT.createClassDefinition("SelectionEventAfterEvent", null, null, true);
export const SelectionManager = CONTEXT.createClassDefinition("SelectionManager", null, null, true).addMethod(
  "create",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const SettingsManager = CONTEXT.createClassDefinition("SettingsManager", null, null, true);
export const SettingsUIElement = CONTEXT.createClassDefinition(
  "SettingsUIElement",
  null,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "name",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
    {
      details: null,
      name: "initialValue",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "variant",
        variant_types: [
          {
            is_bind_type: false,
            is_errorable: false,
            name: "boolean",
          },
          {
            is_bind_type: false,
            is_errorable: false,
            name: "float",
            valid_range: {
              max: 2147483647,
              min: -2147483648,
            },
          },
          {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
          {
            from_module: {
              name: "@minecraft/server",
              uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
              version: "1.17.0-beta",
            },
            is_bind_type: true,
            is_errorable: false,
            name: "Vector3",
          },
        ],
      },
    },
    {
      details: null,
      name: "onChange",
      type: {
        closure_type: {
          argument_types: [
            {
              is_bind_type: false,
              is_errorable: false,
              name: "variant",
              variant_types: [
                {
                  is_bind_type: false,
                  is_errorable: false,
                  name: "boolean",
                },
                {
                  is_bind_type: false,
                  is_errorable: false,
                  name: "float",
                  valid_range: {
                    max: 2147483647,
                    min: -2147483648,
                  },
                },
                {
                  is_bind_type: false,
                  is_errorable: false,
                  name: "string",
                },
                {
                  from_module: {
                    name: "@minecraft/server",
                    uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                    version: "1.17.0-beta",
                  },
                  is_bind_type: true,
                  is_errorable: false,
                  name: "Vector3",
                },
              ],
            },
          ],
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
          name: "SettingsUIElementOptions",
        },
      },
    },
  ]),
  true,
);
export const SimpleBlockPaletteItem = CONTEXT.createClassDefinition(
  "SimpleBlockPaletteItem",
  IBlockPaletteItem,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: {
        default_value: "null",
      },
      name: "displayName",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "optional",
        optional_type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    },
  ]),
  true,
);
export const SimulationState = CONTEXT.createClassDefinition("SimulationState", null, null, true)
  .addMethod("isPaused", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setPaused",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "isPaused",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  );
export const ThemeSettings = CONTEXT.createClassDefinition("ThemeSettings", null, null, true)
  .addMethod(
    "addNewTheme",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "name",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "sourceThemeId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
        },
      },
    ]),
  )
  .addMethod(
    "canThemeBeModified",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "deleteTheme",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getCurrentTheme", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getThemeColors",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getThemeIdList", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getThemeName",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "resolveColorKey",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "key",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ThemeSettingsColorKey",
        },
      },
    ]),
  )
  .addMethod(
    "setCurrentTheme",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "setThemeName",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "name",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "updateThemeColor",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "id",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "key",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ThemeSettingsColorKey",
        },
      },
      {
        details: null,
        name: "newColor",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "RGBA",
        },
      },
    ]),
  );
export const TickingAreaManager = CONTEXT.createClassDefinition("TickingAreaManager", null, null, true)
  .addMethod(
    "isTickingAreaActive",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "areaIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "purgeTickingAreas",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "areaIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "releaseTickingArea",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "areaIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "requestTickingArea",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "areaIdentifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "from",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "to",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  );
export const TransactionManager = CONTEXT.createClassDefinition("TransactionManager", null, null, true)
  .addMethod(
    "addEntityOperation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "entity",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
      {
        details: null,
        name: "type",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "EntityOperationType",
        },
      },
    ]),
  )
  .addMethod(
    "addUserDefinedOperation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "transactionHandlerId",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "UserDefinedTransactionHandlerId",
        },
      },
      {
        details: null,
        name: "operationData",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "operationName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
        },
      },
    ]),
  )
  .addMethod("commitOpenTransaction", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("commitTrackedChanges", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "createUserDefinedTransactionHandler",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "undoClosure",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: false,
                is_errorable: false,
                name: "string",
              },
            ],
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
      {
        details: null,
        name: "redoClosure",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: false,
                is_errorable: false,
                name: "string",
              },
            ],
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
  .addMethod("discardOpenTransaction", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("discardTrackedChanges", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "openTransaction",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "name",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("redo", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("redoSize", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "trackBlockChangeArea",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "from",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "to",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "trackBlockChangeCompoundBlockVolume",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "compoundBlockVolume",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "CompoundBlockVolume",
        },
      },
    ]),
  )
  .addMethod(
    "trackBlockChangeList",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "locations",
        type: {
          element_type: {
            from_module: {
              name: "@minecraft/server",
              uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
              version: "1.17.0-beta",
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
    ]),
  )
  .addMethod(
    "trackBlockChangeSelection",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "selection",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Selection",
        },
      },
    ]),
  )
  .addMethod("undo", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("undoSize", Types.ParamsDefinition.From(CONTEXT, []));
export const UserDefinedTransactionHandlerId = CONTEXT.createClassDefinition(
  "UserDefinedTransactionHandlerId",
  null,
  null,
  true,
);
export const Widget = CONTEXT.createClassDefinition("Widget", null, null, true)
  .addMethod(
    "addClipboardComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "clipboardItem",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "ClipboardItem",
          },
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
            name: "WidgetComponentClipboardOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "addEntityComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "actorNameId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
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
            name: "WidgetComponentEntityOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "addGizmoComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
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
            name: "WidgetComponentGizmoOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "addGuideComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
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
            name: "WidgetComponentGuideOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "addRenderPrimitiveComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "primitiveType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "WidgetComponentRenderPrimitiveTypeAxialSphere",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "WidgetComponentRenderPrimitiveTypeBox",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "WidgetComponentRenderPrimitiveTypeDisc",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "WidgetComponentRenderPrimitiveTypeLine",
            },
          ],
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
            name: "WidgetComponentRenderPrimitiveOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "addSplineComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
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
            name: "WidgetComponentSplineOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "addTextComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "label",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
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
            name: "WidgetComponentTextOptions",
          },
        },
      },
    ]),
  )
  .addMethod("delete", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "deleteComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentOrName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "WidgetComponentBase",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "getComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getComponents", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setStateChangeEvent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "eventFunction",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            closure_type: {
              argument_types: [
                {
                  is_bind_type: true,
                  is_errorable: false,
                  name: "WidgetStateChangeEventData",
                },
              ],
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
      },
    ]),
  );
export const WidgetComponentBase = CONTEXT.createClassDefinition("WidgetComponentBase", null, null, true)
  .addMethod("delete", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setStateChangeEvent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "eventFunction",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            closure_type: {
              argument_types: [
                {
                  is_bind_type: true,
                  is_errorable: false,
                  name: "WidgetComponentStateChangeEventData",
                },
              ],
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
      },
    ]),
  );
export const WidgetComponentClipboard = CONTEXT.createClassDefinition(
  "WidgetComponentClipboard",
  WidgetComponentBase,
  null,
  true,
);
export const WidgetComponentEntity = CONTEXT.createClassDefinition(
  "WidgetComponentEntity",
  WidgetComponentBase,
  null,
  true,
).addMethod(
  "playAnimation",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "animationName",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
  ]),
);
export const WidgetComponentGizmo = CONTEXT.createClassDefinition(
  "WidgetComponentGizmo",
  WidgetComponentBase,
  null,
  true,
);
export const WidgetComponentGuide = CONTEXT.createClassDefinition(
  "WidgetComponentGuide",
  WidgetComponentBase,
  null,
  true,
);
export const WidgetComponentRenderPrimitive = CONTEXT.createClassDefinition(
  "WidgetComponentRenderPrimitive",
  WidgetComponentBase,
  null,
  true,
).addMethod(
  "setPrimitive",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "primitive",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "variant",
        variant_types: [
          {
            is_bind_type: true,
            is_errorable: false,
            name: "WidgetComponentRenderPrimitiveTypeAxialSphere",
          },
          {
            is_bind_type: true,
            is_errorable: false,
            name: "WidgetComponentRenderPrimitiveTypeBox",
          },
          {
            is_bind_type: true,
            is_errorable: false,
            name: "WidgetComponentRenderPrimitiveTypeDisc",
          },
          {
            is_bind_type: true,
            is_errorable: false,
            name: "WidgetComponentRenderPrimitiveTypeLine",
          },
        ],
      },
    },
  ]),
);
export const WidgetComponentRenderPrimitiveTypeBase = CONTEXT.createClassDefinition(
  "WidgetComponentRenderPrimitiveTypeBase",
  null,
  null,
  true,
);
export const WidgetComponentRenderPrimitiveTypeAxialSphere = CONTEXT.createClassDefinition(
  "WidgetComponentRenderPrimitiveTypeAxialSphere",
  WidgetComponentRenderPrimitiveTypeBase,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "center",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
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
      name: "radius",
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
        default_value: "null",
      },
      name: "color",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "optional",
        optional_type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "RGBA",
        },
      },
    },
  ]),
  true,
);
export const WidgetComponentRenderPrimitiveTypeBox = CONTEXT.createClassDefinition(
  "WidgetComponentRenderPrimitiveTypeBox",
  WidgetComponentRenderPrimitiveTypeBase,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "center",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
        },
        is_bind_type: true,
        is_errorable: false,
        name: "Vector3",
      },
    },
    {
      details: null,
      name: "color",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
        },
        is_bind_type: true,
        is_errorable: false,
        name: "RGBA",
      },
    },
    {
      details: {
        default_value: "null",
      },
      name: "size",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "optional",
        optional_type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    },
  ]),
  true,
);
export const WidgetComponentRenderPrimitiveTypeDisc = CONTEXT.createClassDefinition(
  "WidgetComponentRenderPrimitiveTypeDisc",
  WidgetComponentRenderPrimitiveTypeBase,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "center",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
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
      name: "radius",
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
      details: null,
      name: "color",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
        },
        is_bind_type: true,
        is_errorable: false,
        name: "RGBA",
      },
    },
  ]),
  true,
);
export const WidgetComponentRenderPrimitiveTypeLine = CONTEXT.createClassDefinition(
  "WidgetComponentRenderPrimitiveTypeLine",
  WidgetComponentRenderPrimitiveTypeBase,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "start",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
        },
        is_bind_type: true,
        is_errorable: false,
        name: "Vector3",
      },
    },
    {
      details: null,
      name: "end",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
        },
        is_bind_type: true,
        is_errorable: false,
        name: "Vector3",
      },
    },
    {
      details: null,
      name: "color",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "1.17.0-beta",
        },
        is_bind_type: true,
        is_errorable: false,
        name: "RGBA",
      },
    },
  ]),
  true,
);
export const WidgetComponentSpline = CONTEXT.createClassDefinition(
  "WidgetComponentSpline",
  WidgetComponentBase,
  null,
  true,
)
  .addMethod("getControlPoints", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getInterpolatedPoints",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "maxPointsPerControlSegment",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "int32",
            valid_range: {
              max: 2147483647,
              min: -2147483648,
            },
          },
        },
      },
    ]),
  )
  .addMethod(
    "setControlPoints",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "widgetList",
        type: {
          element_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "Widget",
          },
          is_bind_type: false,
          is_errorable: false,
          name: "array",
        },
      },
    ]),
  );
export const WidgetComponentStateChangeEventData = CONTEXT.createClassDefinition(
  "WidgetComponentStateChangeEventData",
  null,
  null,
  true,
);
export const WidgetComponentText = CONTEXT.createClassDefinition(
  "WidgetComponentText",
  WidgetComponentBase,
  null,
  true,
);
export const WidgetGroup = CONTEXT.createClassDefinition("WidgetGroup", null, null, true)
  .addMethod(
    "createWidget",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "1.17.0-beta",
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
            name: "WidgetCreateOptions",
          },
        },
      },
    ]),
  )
  .addMethod("delete", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "deleteWidget",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "widgetToDelete",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Widget",
        },
      },
    ]),
  )
  .addMethod("deselectAllWidgets", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("selectAllWidgets", Types.ParamsDefinition.From(CONTEXT, []));
export const WidgetManager = CONTEXT.createClassDefinition("WidgetManager", null, null, true)
  .addMethod(
    "createGroup",
    Types.ParamsDefinition.From(CONTEXT, [
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
            name: "WidgetGroupCreateOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "deleteGroup",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "groupToDelete",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "WidgetGroup",
        },
      },
    ]),
  );
export const WidgetMouseButtonEventData = CONTEXT.createClassDefinition("WidgetMouseButtonEventData", null, null, true);
export const WidgetStateChangeEventData = CONTEXT.createClassDefinition("WidgetStateChangeEventData", null, null, true);
export const editor = MinecraftEditor.create();
export const editorInternal = MinecraftEditorInternal.create();
CONTEXT.resolveAllDynamicTypes();
