import { Types, CONTEXT } from "../api.js";
import * as __10 from "./common.native.js";
export const BiomeSearchOptions = new Types.InterfaceBindType("BiomeSearchOptions", null).addProperty("boundingSize");
export const BlockCustomComponent = new Types.InterfaceBindType("BlockCustomComponent", null)
  .addProperty("beforeOnPlayerPlace")
  .addProperty("onEntityFallOn")
  .addProperty("onPlace")
  .addProperty("onPlayerDestroy")
  .addProperty("onPlayerInteract")
  .addProperty("onRandomTick")
  .addProperty("onStepOff")
  .addProperty("onStepOn")
  .addProperty("onTick");
export const BlockEventOptions = new Types.InterfaceBindType("BlockEventOptions", null)
  .addProperty("blockTypes")
  .addProperty("permutations");
export const BlockFillOptions = new Types.InterfaceBindType("BlockFillOptions", null)
  .addProperty("blockFilter")
  .addProperty("ignoreChunkBoundErrors");
export const BlockFilter = new Types.InterfaceBindType("BlockFilter", null)
  .addProperty("excludePermutations")
  .addProperty("excludeTags")
  .addProperty("excludeTypes")
  .addProperty("includePermutations")
  .addProperty("includeTags")
  .addProperty("includeTypes");
export const BlockHitInformation = new Types.InterfaceBindType("BlockHitInformation", null)
  .addProperty("block")
  .addProperty("face")
  .addProperty("faceLocation");
export const BlockRaycastHit = new Types.InterfaceBindType("BlockRaycastHit", null)
  .addProperty("block")
  .addProperty("face")
  .addProperty("faceLocation");
export const BlockRaycastOptions = new Types.InterfaceBindType("BlockRaycastOptions", BlockFilter)
  .addProperty("includeLiquidBlocks")
  .addProperty("includePassableBlocks")
  .addProperty("maxDistance");
export const BoundingBox = new Types.InterfaceBindType("BoundingBox", null).addProperty("max").addProperty("min");
export const CameraDefaultOptions = new Types.InterfaceBindType("CameraDefaultOptions", null).addProperty(
  "easeOptions",
);
export const CameraEaseOptions = new Types.InterfaceBindType("CameraEaseOptions", null)
  .addProperty("easeTime")
  .addProperty("easeType");
export const CameraFadeOptions = new Types.InterfaceBindType("CameraFadeOptions", null)
  .addProperty("fadeColor")
  .addProperty("fadeTime");
export const CameraFadeTimeOptions = new Types.InterfaceBindType("CameraFadeTimeOptions", null)
  .addProperty("fadeInTime")
  .addProperty("fadeOutTime")
  .addProperty("holdTime");
export const CameraFixedBoomOptions = new Types.InterfaceBindType("CameraFixedBoomOptions", null).addProperty(
  "viewOffset",
);
export const CameraSetFacingOptions = new Types.InterfaceBindType("CameraSetFacingOptions", null)
  .addProperty("easeOptions")
  .addProperty("facingEntity")
  .addProperty("location");
export const CameraSetLocationOptions = new Types.InterfaceBindType("CameraSetLocationOptions", null)
  .addProperty("easeOptions")
  .addProperty("location");
export const CameraSetPosOptions = new Types.InterfaceBindType("CameraSetPosOptions", null)
  .addProperty("easeOptions")
  .addProperty("facingLocation")
  .addProperty("location");
export const CameraSetRotOptions = new Types.InterfaceBindType("CameraSetRotOptions", null)
  .addProperty("easeOptions")
  .addProperty("location")
  .addProperty("rotation");
export const CompoundBlockVolumeItem = new Types.InterfaceBindType("CompoundBlockVolumeItem", null)
  .addProperty("action")
  .addProperty("locationRelativity")
  .addProperty("volume");
export const DefinitionModifier = new Types.InterfaceBindType("DefinitionModifier", null)
  .addProperty("addedComponentGroups")
  .addProperty("removedComponentGroups")
  .addProperty("triggers");
export const DimensionLocation = new Types.InterfaceBindType("DimensionLocation", null)
  .addProperty("dimension")
  .addProperty("x")
  .addProperty("y")
  .addProperty("z");
export const Enchantment = new Types.InterfaceBindType("Enchantment", null).addProperty("level").addProperty("type");
export const EntityApplyDamageByProjectileOptions = new Types.InterfaceBindType(
  "EntityApplyDamageByProjectileOptions",
  null,
)
  .addProperty("damagingEntity")
  .addProperty("damagingProjectile");
export const EntityApplyDamageOptions = new Types.InterfaceBindType("EntityApplyDamageOptions", null)
  .addProperty("cause")
  .addProperty("damagingEntity");
export const EntityDamageSource = new Types.InterfaceBindType("EntityDamageSource", null)
  .addProperty("cause")
  .addProperty("damagingEntity")
  .addProperty("damagingProjectile");
export const EntityDataDrivenTriggerEventOptions = new Types.InterfaceBindType(
  "EntityDataDrivenTriggerEventOptions",
  null,
)
  .addProperty("entities")
  .addProperty("entityTypes")
  .addProperty("eventTypes");
export const EntityEffectOptions = new Types.InterfaceBindType("EntityEffectOptions", null)
  .addProperty("amplifier")
  .addProperty("showParticles");
export const EntityEventOptions = new Types.InterfaceBindType("EntityEventOptions", null)
  .addProperty("entities")
  .addProperty("entityTypes");
export const EntityFilter = new Types.InterfaceBindType("EntityFilter", null)
  .addProperty("excludeFamilies")
  .addProperty("excludeGameModes")
  .addProperty("excludeNames")
  .addProperty("excludeTags")
  .addProperty("excludeTypes")
  .addProperty("families")
  .addProperty("gameMode")
  .addProperty("maxHorizontalRotation")
  .addProperty("maxLevel")
  .addProperty("maxVerticalRotation")
  .addProperty("minHorizontalRotation")
  .addProperty("minLevel")
  .addProperty("minVerticalRotation")
  .addProperty("name")
  .addProperty("propertyOptions")
  .addProperty("scoreOptions")
  .addProperty("tags")
  .addProperty("type");
export const EntityHitInformation = new Types.InterfaceBindType("EntityHitInformation", null).addProperty("entity");
export const EntityQueryOptions = new Types.InterfaceBindType("EntityQueryOptions", EntityFilter)
  .addProperty("closest")
  .addProperty("farthest")
  .addProperty("location")
  .addProperty("maxDistance")
  .addProperty("minDistance")
  .addProperty("volume");
export const EntityQueryPropertyOptions = new Types.InterfaceBindType("EntityQueryPropertyOptions", null)
  .addProperty("exclude")
  .addProperty("propertyId")
  .addProperty("value");
export const EntityQueryScoreOptions = new Types.InterfaceBindType("EntityQueryScoreOptions", null)
  .addProperty("exclude")
  .addProperty("maxScore")
  .addProperty("minScore")
  .addProperty("objective");
export const EntityRaycastHit = new Types.InterfaceBindType("EntityRaycastHit", null)
  .addProperty("distance")
  .addProperty("entity");
export const EntityRaycastOptions = new Types.InterfaceBindType("EntityRaycastOptions", EntityFilter)
  .addProperty("ignoreBlockCollision")
  .addProperty("includeLiquidBlocks")
  .addProperty("includePassableBlocks")
  .addProperty("maxDistance");
export const EqualsComparison = new Types.InterfaceBindType("EqualsComparison", null).addProperty("equals");
export const ExplosionOptions = new Types.InterfaceBindType("ExplosionOptions", null)
  .addProperty("allowUnderwater")
  .addProperty("breaksBlocks")
  .addProperty("causesFire")
  .addProperty("source");
export const GreaterThanComparison = new Types.InterfaceBindType("GreaterThanComparison", null).addProperty(
  "greaterThan",
);
export const GreaterThanOrEqualsComparison = new Types.InterfaceBindType(
  "GreaterThanOrEqualsComparison",
  null,
).addProperty("greaterThanOrEquals");
export const ItemCustomComponent = new Types.InterfaceBindType("ItemCustomComponent", null)
  .addProperty("onBeforeDurabilityDamage")
  .addProperty("onCompleteUse")
  .addProperty("onConsume")
  .addProperty("onHitEntity")
  .addProperty("onMineBlock")
  .addProperty("onUse")
  .addProperty("onUseOn");
export const LessThanComparison = new Types.InterfaceBindType("LessThanComparison", null).addProperty("lessThan");
export const LessThanOrEqualsComparison = new Types.InterfaceBindType("LessThanOrEqualsComparison", null).addProperty(
  "lessThanOrEquals",
);
export const MusicOptions = new Types.InterfaceBindType("MusicOptions", null)
  .addProperty("fade")
  .addProperty("loop")
  .addProperty("volume");
export const NotEqualsComparison = new Types.InterfaceBindType("NotEqualsComparison", null).addProperty("notEquals");
export const PlayAnimationOptions = new Types.InterfaceBindType("PlayAnimationOptions", null)
  .addProperty("blendOutTime")
  .addProperty("controller")
  .addProperty("nextState")
  .addProperty("players")
  .addProperty("stopExpression");
export const PlayerSoundOptions = new Types.InterfaceBindType("PlayerSoundOptions", null)
  .addProperty("location")
  .addProperty("pitch")
  .addProperty("volume");
export const PotionOptions = new Types.InterfaceBindType("PotionOptions", null)
  .addProperty("effect")
  .addProperty("liquid")
  .addProperty("modifier");
export const ProjectileShootOptions = new Types.InterfaceBindType("ProjectileShootOptions", null).addProperty(
  "uncertainty",
);
export const RangeComparison = new Types.InterfaceBindType("RangeComparison", null)
  .addProperty("lowerBound")
  .addProperty("upperBound");
export const RawMessage = new Types.InterfaceBindType("RawMessage", null)
  .addProperty("rawtext")
  .addProperty("score")
  .addProperty("text")
  .addProperty("translate")
  .addProperty("with");
export const RawMessageScore = new Types.InterfaceBindType("RawMessageScore", null)
  .addProperty("name")
  .addProperty("objective");
export const RawText = new Types.InterfaceBindType("RawText", null).addProperty("rawtext");
export const RGB = new Types.InterfaceBindType("RGB", null).addProperty("blue").addProperty("green").addProperty("red");
export const RGBA = new Types.InterfaceBindType("RGBA", RGB).addProperty("alpha");
export const ScoreboardObjectiveDisplayOptions = new Types.InterfaceBindType("ScoreboardObjectiveDisplayOptions", null)
  .addProperty("objective")
  .addProperty("sortOrder");
export const ScriptEventMessageFilterOptions = new Types.InterfaceBindType(
  "ScriptEventMessageFilterOptions",
  null,
).addProperty("namespaces");
export const SpawnEntityOptions = new Types.InterfaceBindType("SpawnEntityOptions", null).addProperty(
  "initialPersistence",
);
export const StructureCreateOptions = new Types.InterfaceBindType("StructureCreateOptions", null)
  .addProperty("includeBlocks")
  .addProperty("includeEntities")
  .addProperty("saveMode");
export const StructurePlaceOptions = new Types.InterfaceBindType("StructurePlaceOptions", null)
  .addProperty("animationMode")
  .addProperty("animationSeconds")
  .addProperty("includeBlocks")
  .addProperty("includeEntities")
  .addProperty("integrity")
  .addProperty("integritySeed")
  .addProperty("mirror")
  .addProperty("rotation")
  .addProperty("waterlogged");
export const TeleportOptions = new Types.InterfaceBindType("TeleportOptions", null)
  .addProperty("checkForBlocks")
  .addProperty("dimension")
  .addProperty("facingLocation")
  .addProperty("keepVelocity")
  .addProperty("rotation");
export const TitleDisplayOptions = new Types.InterfaceBindType("TitleDisplayOptions", null)
  .addProperty("fadeInDuration")
  .addProperty("fadeOutDuration")
  .addProperty("stayDuration")
  .addProperty("subtitle");
export const Vector2 = new Types.InterfaceBindType("Vector2", null).addProperty("x").addProperty("y");
export const Vector3 = new Types.InterfaceBindType("Vector3", null).addProperty("x").addProperty("y").addProperty("z");
export const VectorXZ = new Types.InterfaceBindType("VectorXZ", null).addProperty("x").addProperty("z");
export const WorldSoundOptions = new Types.InterfaceBindType("WorldSoundOptions", null)
  .addProperty("pitch")
  .addProperty("volume");
export const BiomeType = CONTEXT.createClassDefinition("BiomeType", null, null, true);
export const BiomeTypes = CONTEXT.createClassDefinition("BiomeTypes", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "typeName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const Block = CONTEXT.createClassDefinition("Block", null, null, true)
  .addMethod(
    "above",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "steps",
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
    "below",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "steps",
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
  .addMethod("bottomCenter", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "canPlace",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockToPlace",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "BlockPermutation",
            },
            {
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
          default_value: "null",
        },
        name: "faceToPlaceOn",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "Direction",
          },
        },
      },
    ]),
  )
  .addMethod("center", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "east",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "steps",
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
    "getComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getItemStack",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 255,
          min_value: 1,
        },
        name: "amount",
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
        name: "withData",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod("getMapColor", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getRedstonePower", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getTags", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasTag",
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
  )
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "matches",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockName",
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
        name: "states",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
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
  )
  .addMethod(
    "north",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "steps",
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
    "offset",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "offset",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "setPermutation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "permutation",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockPermutation",
        },
      },
    ]),
  )
  .addMethod(
    "setType",
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
  )
  .addMethod(
    "setWaterlogged",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
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
    "south",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "steps",
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
    "trySetPermutation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "permutation",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockPermutation",
        },
      },
    ]),
  )
  .addMethod(
    "west",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "steps",
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
export const Component = CONTEXT.createClassDefinition("Component", null, null, true).addMethod(
  "isValid",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const BlockComponent = CONTEXT.createClassDefinition("BlockComponent", Component, null, true);
export const BlockEvent = CONTEXT.createClassDefinition("BlockEvent", null, null, true);
export const BlockComponentEntityFallOnEvent = CONTEXT.createClassDefinition(
  "BlockComponentEntityFallOnEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentOnPlaceEvent = CONTEXT.createClassDefinition(
  "BlockComponentOnPlaceEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentPlayerDestroyEvent = CONTEXT.createClassDefinition(
  "BlockComponentPlayerDestroyEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentPlayerInteractEvent = CONTEXT.createClassDefinition(
  "BlockComponentPlayerInteractEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentPlayerPlaceBeforeEvent = CONTEXT.createClassDefinition(
  "BlockComponentPlayerPlaceBeforeEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentRandomTickEvent = CONTEXT.createClassDefinition(
  "BlockComponentRandomTickEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentRegistry = CONTEXT.createClassDefinition(
  "BlockComponentRegistry",
  null,
  null,
  true,
).addMethod(
  "registerCustomComponent",
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
      name: "customComponent",
      type: {
        is_bind_type: true,
        is_errorable: false,
        name: "BlockCustomComponent",
      },
    },
  ]),
);
export const BlockComponentStepOffEvent = CONTEXT.createClassDefinition(
  "BlockComponentStepOffEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentStepOnEvent = CONTEXT.createClassDefinition(
  "BlockComponentStepOnEvent",
  BlockEvent,
  null,
  true,
);
export const BlockComponentTickEvent = CONTEXT.createClassDefinition("BlockComponentTickEvent", BlockEvent, null, true);
export const BlockExplodeAfterEvent = CONTEXT.createClassDefinition("BlockExplodeAfterEvent", BlockEvent, null, true);
export const BlockExplodeAfterEventSignal = CONTEXT.createClassDefinition(
  "BlockExplodeAfterEventSignal",
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
                name: "BlockExplodeAfterEvent",
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
                name: "BlockExplodeAfterEvent",
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
export const BlockInventoryComponent = CONTEXT.createClassDefinition(
  "BlockInventoryComponent",
  BlockComponent,
  null,
  true,
);
export const BlockLiquidContainerComponent = CONTEXT.createClassDefinition(
  "BlockLiquidContainerComponent",
  BlockComponent,
  null,
  true,
).addMethod("isValidLiquid", Types.ParamsDefinition.From(CONTEXT, []));
export const BlockLavaContainerComponent = CONTEXT.createClassDefinition(
  "BlockLavaContainerComponent",
  BlockLiquidContainerComponent,
  null,
  true,
);
export const BlockLocationIterator = CONTEXT.createClassDefinition("BlockLocationIterator", null, null, true);
export const BlockPermutation = CONTEXT.createClassDefinition("BlockPermutation", null, null, true)
  .addMethod("getAllStates", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getItemStack",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 1,
          max_value: 255,
          min_value: 1,
        },
        name: "amount",
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
    "getState",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "stateName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getTags", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasTag",
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
  )
  .addMethod(
    "matches",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockName",
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
        name: "states",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
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
  )
  .addMethod(
    "resolve",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "blockName",
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
        name: "states",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
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
  )
  .addMethod(
    "withState",
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
  );
export const BlockPistonComponent = CONTEXT.createClassDefinition("BlockPistonComponent", BlockComponent, null, true)
  .addMethod("getAttachedBlocks", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getAttachedBlocksLocations", Types.ParamsDefinition.From(CONTEXT, []));
export const BlockPotionContainerComponent = CONTEXT.createClassDefinition(
  "BlockPotionContainerComponent",
  BlockLiquidContainerComponent,
  null,
  true,
).addMethod(
  "setPotionType",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "itemStack",
      type: {
        is_bind_type: true,
        is_errorable: false,
        name: "ItemStack",
      },
    },
  ]),
);
export const BlockRecordPlayerComponent = CONTEXT.createClassDefinition(
  "BlockRecordPlayerComponent",
  BlockComponent,
  null,
  true,
)
  .addMethod("ejectRecord", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getRecord", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("isPlaying", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("pauseRecord", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("playRecord", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setRecord",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "recordItemType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "variant",
            variant_types: [
              {
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
      },
      {
        details: {
          default_value: true,
        },
        name: "startPlaying",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  );
export const BlockSignComponent = CONTEXT.createClassDefinition("BlockSignComponent", BlockComponent, null, true)
  .addMethod(
    "getRawText",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 0,
        },
        name: "side",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "SignSide",
        },
      },
    ]),
  )
  .addMethod(
    "getText",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 0,
        },
        name: "side",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "SignSide",
        },
      },
    ]),
  )
  .addMethod(
    "getTextDyeColor",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 0,
        },
        name: "side",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "SignSide",
        },
      },
    ]),
  )
  .addMethod(
    "setText",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "message",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "RawText",
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
          default_value: 0,
        },
        name: "side",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "SignSide",
        },
      },
    ]),
  )
  .addMethod(
    "setTextDyeColor",
    Types.ParamsDefinition.From(CONTEXT, [
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
            is_bind_type: true,
            is_errorable: false,
            name: "DyeColor",
          },
        },
      },
      {
        details: {
          default_value: 0,
        },
        name: "side",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "SignSide",
        },
      },
    ]),
  )
  .addMethod(
    "setWaxed",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "waxed",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  );
export const BlockSnowContainerComponent = CONTEXT.createClassDefinition(
  "BlockSnowContainerComponent",
  BlockLiquidContainerComponent,
  null,
  true,
);
export const BlockStates = CONTEXT.createClassDefinition("BlockStates", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "stateName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const BlockStateType = CONTEXT.createClassDefinition("BlockStateType", null, null, true);
export const BlockType = CONTEXT.createClassDefinition("BlockType", null, null, true);
export const BlockTypes = CONTEXT.createClassDefinition("BlockTypes", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "typeName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const BlockVolumeBase = CONTEXT.createClassDefinition("BlockVolumeBase", null, null, true)
  .addMethod("getBlockLocationIterator", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getBoundingBox", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getCapacity", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getMax", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getMin", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getSpan", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "isInside",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "translate",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "delta",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  );
export const BlockVolume = CONTEXT.createClassDefinition(
  "BlockVolume",
  BlockVolumeBase,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "from",
      type: {
        is_bind_type: true,
        is_errorable: false,
        name: "Vector3",
      },
    },
    {
      details: null,
      name: "to",
      type: {
        is_bind_type: true,
        is_errorable: false,
        name: "Vector3",
      },
    },
  ]),
  true,
)
  .addMethod(
    "doesLocationTouchFaces",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "pos",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "doesVolumeTouchFaces",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "other",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockVolume",
        },
      },
    ]),
  )
  .addMethod(
    "intersects",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "other",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockVolume",
        },
      },
    ]),
  );
export const BlockWaterContainerComponent = CONTEXT.createClassDefinition(
  "BlockWaterContainerComponent",
  BlockLiquidContainerComponent,
  null,
  true,
)
  .addMethod(
    "addDye",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemType",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ItemType",
        },
      },
    ]),
  )
  .addMethod("getCustomColor", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setCustomColor",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "color",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "RGBA",
        },
      },
    ]),
  );
export const BoundingBoxUtils = CONTEXT.createClassDefinition("BoundingBoxUtils", null, null, true)
  .addMethod(
    "createValid",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "min",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "max",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "dilate",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
      {
        details: null,
        name: "size",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "equals",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
      {
        details: null,
        name: "other",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
    ]),
  )
  .addMethod(
    "expand",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
      {
        details: null,
        name: "other",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
    ]),
  )
  .addMethod(
    "getCenter",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
    ]),
  )
  .addMethod(
    "getIntersection",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
      {
        details: null,
        name: "other",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
    ]),
  )
  .addMethod(
    "getSpan",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
    ]),
  )
  .addMethod(
    "intersects",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
      {
        details: null,
        name: "other",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
    ]),
  )
  .addMethod(
    "isInside",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
      {
        details: null,
        name: "pos",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "isValid",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
    ]),
  )
  .addMethod(
    "translate",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "box",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BoundingBox",
        },
      },
      {
        details: null,
        name: "delta",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  );
export const ButtonPushAfterEvent = CONTEXT.createClassDefinition("ButtonPushAfterEvent", BlockEvent, null, true);
export const IButtonPushAfterEventSignal = CONTEXT.createClassDefinition(
  "IButtonPushAfterEventSignal",
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
                name: "ButtonPushAfterEvent",
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
                name: "ButtonPushAfterEvent",
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
export const ButtonPushAfterEventSignal = CONTEXT.createClassDefinition(
  "ButtonPushAfterEventSignal",
  IButtonPushAfterEventSignal,
  null,
  true,
);
export const Camera = CONTEXT.createClassDefinition("Camera", null, null, true)
  .addMethod("clear", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "fade",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "fadeCameraOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "CameraFadeOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setCamera",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "cameraPreset",
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
        name: "setOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "variant",
            variant_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CameraDefaultOptions",
              },
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CameraFixedBoomOptions",
              },
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CameraSetFacingOptions",
              },
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CameraSetLocationOptions",
              },
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CameraSetPosOptions",
              },
              {
                is_bind_type: true,
                is_errorable: false,
                name: "CameraSetRotOptions",
              },
            ],
          },
        },
      },
    ]),
  );
export const ChatSendAfterEvent = CONTEXT.createClassDefinition("ChatSendAfterEvent", null, null, true);
export const ChatSendAfterEventSignal = CONTEXT.createClassDefinition("ChatSendAfterEventSignal", null, null, true)
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
                name: "ChatSendAfterEvent",
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
                name: "ChatSendAfterEvent",
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
export const ChatSendBeforeEvent = CONTEXT.createClassDefinition("ChatSendBeforeEvent", null, null, true);
export const ChatSendBeforeEventSignal = CONTEXT.createClassDefinition("ChatSendBeforeEventSignal", null, null, true)
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
                name: "ChatSendBeforeEvent",
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
                name: "ChatSendBeforeEvent",
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
export const CommandResult = CONTEXT.createClassDefinition("CommandResult", null, null, true);
export const CompoundBlockVolume = CONTEXT.createClassDefinition(
  "CompoundBlockVolume",
  null,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: {
        default_value: "null",
      },
      name: "origin",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "optional",
        optional_type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    },
  ]),
  true,
)
  .addMethod("clear", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getBlockLocationIterator", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getBoundingBox", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getMax", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getMin", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getOrigin", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("isEmpty", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "isInside",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "worldLocation",
        type: {
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
          is_bind_type: true,
          is_errorable: false,
          name: "CompoundBlockVolumeItem",
        },
      },
    ]),
  )
  .addMethod(
    "replaceOrAddLastVolume",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "item",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "CompoundBlockVolumeItem",
        },
      },
    ]),
  )
  .addMethod(
    "setOrigin",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "position",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "preserveExistingVolumes",
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
  .addMethod(
    "translateOrigin",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "delta",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "preserveExistingVolumes",
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
  );
export const Container = CONTEXT.createClassDefinition("Container", null, null, true)
  .addMethod(
    "addItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
    ]),
  )
  .addMethod("clearAll", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getItem",
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
    "getSlot",
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
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "moveItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "fromSlot",
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
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "toSlot",
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
        name: "toContainer",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Container",
        },
      },
    ]),
  )
  .addMethod(
    "setItem",
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
        details: {
          default_value: "null",
        },
        name: "itemStack",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "ItemStack",
          },
        },
      },
    ]),
  )
  .addMethod(
    "swapItems",
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
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "otherSlot",
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
        name: "otherContainer",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Container",
        },
      },
    ]),
  )
  .addMethod(
    "transferItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "fromSlot",
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
        name: "toContainer",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Container",
        },
      },
    ]),
  );
export const ContainerSlot = CONTEXT.createClassDefinition("ContainerSlot", null, null, true)
  .addMethod("clearDynamicProperties", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getCanDestroy", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getCanPlaceOn", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getDynamicPropertyIds", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getDynamicPropertyTotalByteCount", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getItem", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getLore", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getTags", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("hasItem", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasTag",
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
  )
  .addMethod(
    "isStackableWith",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
    ]),
  )
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setCanDestroy",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "blockIdentifiers",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setCanPlaceOn",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "blockIdentifiers",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
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
        name: "value",
        type: {
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
                name: "double",
                valid_range: {
                  max: 2147483647,
                  min: -2147483648,
                },
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
                is_bind_type: true,
                is_errorable: false,
                name: "Vector3",
              },
            ],
          },
        },
      },
    ]),
  )
  .addMethod(
    "setItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "itemStack",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "ItemStack",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setLore",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "loreList",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  );
export const DataDrivenEntityTriggerAfterEvent = CONTEXT.createClassDefinition(
  "DataDrivenEntityTriggerAfterEvent",
  null,
  null,
  true,
).addMethod("getModifiers", Types.ParamsDefinition.From(CONTEXT, []));
export const DataDrivenEntityTriggerAfterEventSignal = CONTEXT.createClassDefinition(
  "DataDrivenEntityTriggerAfterEventSignal",
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
                name: "DataDrivenEntityTriggerAfterEvent",
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
            name: "EntityDataDrivenTriggerEventOptions",
          },
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
                name: "DataDrivenEntityTriggerAfterEvent",
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
export const Dimension = CONTEXT.createClassDefinition("Dimension", null, null, true)
  .addMethod(
    "containsBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "volume",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockVolumeBase",
        },
      },
      {
        details: null,
        name: "filter",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockFilter",
        },
      },
      {
        details: {
          default_value: false,
        },
        name: "allowUnloadedChunks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "createExplosion",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          max_value: 1000,
          min_value: 0,
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
        name: "explosionOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "ExplosionOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "fillBlocks",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "volume",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "BlockVolumeBase",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "CompoundBlockVolume",
            },
          ],
        },
      },
      {
        details: null,
        name: "block",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "BlockPermutation",
            },
            {
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
            name: "BlockFillOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "findClosestBiome",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "pos",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "biomeToFind",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "BiomeType",
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
            name: "BiomeSearchOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "getBlockAbove",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
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
            name: "BlockRaycastOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getBlockBelow",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
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
            name: "BlockRaycastOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getBlockFromRay",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "direction",
        type: {
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
            name: "BlockRaycastOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getBlocks",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "volume",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockVolumeBase",
        },
      },
      {
        details: null,
        name: "filter",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockFilter",
        },
      },
      {
        details: {
          default_value: false,
        },
        name: "allowUnloadedChunks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "getEntities",
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
            name: "EntityQueryOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getEntitiesAtBlockLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "getEntitiesFromRay",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "direction",
        type: {
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
            name: "EntityRaycastOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getPlayers",
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
            name: "EntityQueryOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getTopmostBlock",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "locationXZ",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "VectorXZ",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "minHeight",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "float",
            valid_range: {
              max: 2147483647,
              min: -2147483648,
            },
          },
        },
      },
    ]),
  )
  .addMethod("getWeather", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "playSound",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "soundId",
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
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "soundOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "WorldSoundOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "runCommand",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "commandString",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "runCommandAsync",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "commandString",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "setBlockPermutation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "permutation",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "BlockPermutation",
        },
      },
    ]),
  )
  .addMethod(
    "setBlockType",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "blockType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
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
  )
  .addMethod(
    "setWeather",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "weatherType",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "WeatherType",
        },
      },
      {
        details: {
          default_value: "null",
          max_value: 1000000,
          min_value: 1,
        },
        name: "duration",
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
    "spawnEntity",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
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
            name: "SpawnEntityOptions",
          },
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
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "spawnParticle",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "effectName",
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
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "molangVariables",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MolangVariableMap",
          },
        },
      },
    ]),
  );
export const DimensionType = CONTEXT.createClassDefinition("DimensionType", null, null, true);
export const DimensionTypes = CONTEXT.createClassDefinition("DimensionTypes", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "dimensionTypeId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const Effect = CONTEXT.createClassDefinition("Effect", null, null, true).addMethod(
  "isValid",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const EffectAddAfterEvent = CONTEXT.createClassDefinition("EffectAddAfterEvent", null, null, true);
export const EffectAddAfterEventSignal = CONTEXT.createClassDefinition("EffectAddAfterEventSignal", null, null, true)
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
                name: "EffectAddAfterEvent",
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
            name: "EntityEventOptions",
          },
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
                name: "EffectAddAfterEvent",
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
export const EffectAddBeforeEvent = CONTEXT.createClassDefinition("EffectAddBeforeEvent", null, null, true);
export const EffectAddBeforeEventSignal = CONTEXT.createClassDefinition("EffectAddBeforeEventSignal", null, null, true)
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
                name: "EffectAddBeforeEvent",
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
                name: "EffectAddBeforeEvent",
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
export const EffectType = CONTEXT.createClassDefinition("EffectType", null, null, true).addMethod(
  "getName",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const EffectTypes = CONTEXT.createClassDefinition("EffectTypes", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const EnchantmentType = CONTEXT.createClassDefinition(
  "EnchantmentType",
  null,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "enchantmentType",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
  ]),
  true,
);
export const EnchantmentTypes = CONTEXT.createClassDefinition("EnchantmentTypes", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "enchantmentId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const Entity = CONTEXT.createClassDefinition("Entity", null, null, true)
  .addMethod(
    "addEffect",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "effectType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "EffectType",
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
          max_value: 20000000,
          min_value: 1,
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
            name: "EntityEffectOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "addTag",
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
  )
  .addMethod(
    "applyDamage",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "amount",
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
        name: "options",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "variant",
            variant_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "EntityApplyDamageByProjectileOptions",
              },
              {
                is_bind_type: true,
                is_errorable: false,
                name: "EntityApplyDamageOptions",
              },
            ],
          },
        },
      },
    ]),
  )
  .addMethod(
    "applyImpulse",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "vector",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "applyKnockback",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "directionX",
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
        name: "directionZ",
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
        name: "horizontalStrength",
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
        name: "verticalStrength",
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
  .addMethod("clearDynamicProperties", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("clearVelocity", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "extinguishFire",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: true,
        },
        name: "useEffects",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "getBlockFromViewDirection",
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
            name: "BlockRaycastOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "getComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentId",
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
    "getDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getDynamicPropertyIds", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getDynamicPropertyTotalByteCount", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getEffect",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "effectType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "EffectType",
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
  .addMethod("getEffects", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getEntitiesFromViewDirection",
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
            name: "EntityRaycastOptions",
          },
        },
      },
    ]),
  )
  .addMethod("getHeadLocation", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getRotation", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getTags", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getVelocity", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getViewDirection", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasTag",
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
  )
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("kill", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "matches",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "options",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "EntityQueryOptions",
        },
      },
    ]),
  )
  .addMethod(
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
            name: "PlayAnimationOptions",
          },
        },
      },
    ]),
  )
  .addMethod("remove", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "removeEffect",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "effectType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "EffectType",
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
    "removeTag",
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
  )
  .addMethod(
    "resetProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "runCommand",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "commandString",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "runCommandAsync",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "commandString",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "setDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
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
        name: "value",
        type: {
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
                name: "double",
                valid_range: {
                  max: 2147483647,
                  min: -2147483648,
                },
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
                is_bind_type: true,
                is_errorable: false,
                name: "Vector3",
              },
            ],
          },
        },
      },
    ]),
  )
  .addMethod(
    "setOnFire",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "seconds",
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
          default_value: true,
        },
        name: "useEffects",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "setProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
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
          ],
        },
      },
    ]),
  )
  .addMethod(
    "setRotation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "rotation",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector2",
        },
      },
    ]),
  )
  .addMethod(
    "teleport",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "teleportOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "TeleportOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "triggerEvent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "eventName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "tryTeleport",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "teleportOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "TeleportOptions",
          },
        },
      },
    ]),
  );
export const EntityComponent = CONTEXT.createClassDefinition("EntityComponent", Component, null, true);
export const EntityAddRiderComponent = CONTEXT.createClassDefinition(
  "EntityAddRiderComponent",
  EntityComponent,
  null,
  true,
);
export const EntityAgeableComponent = CONTEXT.createClassDefinition(
  "EntityAgeableComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod("getDropItems", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getFeedItems", Types.ParamsDefinition.From(CONTEXT, []));
export const EntityAttributeComponent = CONTEXT.createClassDefinition(
  "EntityAttributeComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod("resetToDefaultValue", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("resetToMaxValue", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("resetToMinValue", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setCurrentValue",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "value",
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
  );
export const EntityBaseMovementComponent = CONTEXT.createClassDefinition(
  "EntityBaseMovementComponent",
  EntityComponent,
  null,
  true,
);
export const EntityBreathableComponent = CONTEXT.createClassDefinition(
  "EntityBreathableComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod("getBreatheBlocks", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getNonBreatheBlocks", Types.ParamsDefinition.From(CONTEXT, []));
export const EntityCanClimbComponent = CONTEXT.createClassDefinition(
  "EntityCanClimbComponent",
  EntityComponent,
  null,
  true,
);
export const EntityCanFlyComponent = CONTEXT.createClassDefinition(
  "EntityCanFlyComponent",
  EntityComponent,
  null,
  true,
);
export const EntityCanPowerJumpComponent = CONTEXT.createClassDefinition(
  "EntityCanPowerJumpComponent",
  EntityComponent,
  null,
  true,
);
export const EntityColor2Component = CONTEXT.createClassDefinition(
  "EntityColor2Component",
  EntityComponent,
  null,
  true,
);
export const EntityColorComponent = CONTEXT.createClassDefinition("EntityColorComponent", EntityComponent, null, true);
export const EntityDefinitionFeedItem = CONTEXT.createClassDefinition("EntityDefinitionFeedItem", null, null, true);
export const EntityDieAfterEvent = CONTEXT.createClassDefinition("EntityDieAfterEvent", null, null, true);
export const EntityDieAfterEventSignal = CONTEXT.createClassDefinition("EntityDieAfterEventSignal", null, null, true)
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
                name: "EntityDieAfterEvent",
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
            name: "EntityEventOptions",
          },
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
                name: "EntityDieAfterEvent",
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
export const EntityEquippableComponent = CONTEXT.createClassDefinition(
  "EntityEquippableComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod(
    "getEquipment",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "equipmentSlot",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "EquipmentSlot",
        },
      },
    ]),
  )
  .addMethod(
    "getEquipmentSlot",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "equipmentSlot",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "EquipmentSlot",
        },
      },
    ]),
  )
  .addMethod(
    "setEquipment",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "equipmentSlot",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "EquipmentSlot",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "itemStack",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "ItemStack",
          },
        },
      },
    ]),
  );
export const EntityFireImmuneComponent = CONTEXT.createClassDefinition(
  "EntityFireImmuneComponent",
  EntityComponent,
  null,
  true,
);
export const EntityFloatsInLiquidComponent = CONTEXT.createClassDefinition(
  "EntityFloatsInLiquidComponent",
  EntityComponent,
  null,
  true,
);
export const EntityFlyingSpeedComponent = CONTEXT.createClassDefinition(
  "EntityFlyingSpeedComponent",
  EntityComponent,
  null,
  true,
);
export const EntityFrictionModifierComponent = CONTEXT.createClassDefinition(
  "EntityFrictionModifierComponent",
  EntityComponent,
  null,
  true,
);
export const EntityGroundOffsetComponent = CONTEXT.createClassDefinition(
  "EntityGroundOffsetComponent",
  EntityComponent,
  null,
  true,
);
export const EntityHealableComponent = CONTEXT.createClassDefinition(
  "EntityHealableComponent",
  EntityComponent,
  null,
  true,
).addMethod("getFeedItems", Types.ParamsDefinition.From(CONTEXT, []));
export const EntityHealthChangedAfterEvent = CONTEXT.createClassDefinition(
  "EntityHealthChangedAfterEvent",
  null,
  null,
  true,
);
export const EntityHealthChangedAfterEventSignal = CONTEXT.createClassDefinition(
  "EntityHealthChangedAfterEventSignal",
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
                name: "EntityHealthChangedAfterEvent",
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
            name: "EntityEventOptions",
          },
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
                name: "EntityHealthChangedAfterEvent",
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
export const EntityHealthComponent = CONTEXT.createClassDefinition(
  "EntityHealthComponent",
  EntityAttributeComponent,
  null,
  true,
);
export const EntityHitBlockAfterEvent = CONTEXT.createClassDefinition("EntityHitBlockAfterEvent", null, null, true);
export const EntityHitBlockAfterEventSignal = CONTEXT.createClassDefinition(
  "EntityHitBlockAfterEventSignal",
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
                name: "EntityHitBlockAfterEvent",
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
            name: "EntityEventOptions",
          },
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
                name: "EntityHitBlockAfterEvent",
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
export const EntityHitEntityAfterEvent = CONTEXT.createClassDefinition("EntityHitEntityAfterEvent", null, null, true);
export const EntityHitEntityAfterEventSignal = CONTEXT.createClassDefinition(
  "EntityHitEntityAfterEventSignal",
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
                name: "EntityHitEntityAfterEvent",
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
            name: "EntityEventOptions",
          },
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
                name: "EntityHitEntityAfterEvent",
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
export const EntityHurtAfterEvent = CONTEXT.createClassDefinition("EntityHurtAfterEvent", null, null, true);
export const EntityHurtAfterEventSignal = CONTEXT.createClassDefinition("EntityHurtAfterEventSignal", null, null, true)
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
                name: "EntityHurtAfterEvent",
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
            name: "EntityEventOptions",
          },
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
                name: "EntityHurtAfterEvent",
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
export const EntityInventoryComponent = CONTEXT.createClassDefinition(
  "EntityInventoryComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsBabyComponent = CONTEXT.createClassDefinition(
  "EntityIsBabyComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsChargedComponent = CONTEXT.createClassDefinition(
  "EntityIsChargedComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsChestedComponent = CONTEXT.createClassDefinition(
  "EntityIsChestedComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsDyeableComponent = CONTEXT.createClassDefinition(
  "EntityIsDyeableComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsHiddenWhenInvisibleComponent = CONTEXT.createClassDefinition(
  "EntityIsHiddenWhenInvisibleComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsIgnitedComponent = CONTEXT.createClassDefinition(
  "EntityIsIgnitedComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsIllagerCaptainComponent = CONTEXT.createClassDefinition(
  "EntityIsIllagerCaptainComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsSaddledComponent = CONTEXT.createClassDefinition(
  "EntityIsSaddledComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsShakingComponent = CONTEXT.createClassDefinition(
  "EntityIsShakingComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsShearedComponent = CONTEXT.createClassDefinition(
  "EntityIsShearedComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsStackableComponent = CONTEXT.createClassDefinition(
  "EntityIsStackableComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsStunnedComponent = CONTEXT.createClassDefinition(
  "EntityIsStunnedComponent",
  EntityComponent,
  null,
  true,
);
export const EntityIsTamedComponent = CONTEXT.createClassDefinition(
  "EntityIsTamedComponent",
  EntityComponent,
  null,
  true,
);
export const EntityItemComponent = CONTEXT.createClassDefinition("EntityItemComponent", EntityComponent, null, true);
export const EntityIterator = CONTEXT.createClassDefinition("EntityIterator", null, null, true);
export const EntityLavaMovementComponent = CONTEXT.createClassDefinition(
  "EntityLavaMovementComponent",
  EntityAttributeComponent,
  null,
  true,
);
export const EntityLeashableComponent = CONTEXT.createClassDefinition(
  "EntityLeashableComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod(
    "leashTo",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "leashHolder",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
    ]),
  )
  .addMethod("unleash", Types.ParamsDefinition.From(CONTEXT, []));
export const EntityLoadAfterEvent = CONTEXT.createClassDefinition("EntityLoadAfterEvent", null, null, true);
export const EntityLoadAfterEventSignal = CONTEXT.createClassDefinition("EntityLoadAfterEventSignal", null, null, true)
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
                name: "EntityLoadAfterEvent",
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
                name: "EntityLoadAfterEvent",
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
export const EntityMarkVariantComponent = CONTEXT.createClassDefinition(
  "EntityMarkVariantComponent",
  EntityComponent,
  null,
  true,
);
export const EntityMovementAmphibiousComponent = CONTEXT.createClassDefinition(
  "EntityMovementAmphibiousComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementBasicComponent = CONTEXT.createClassDefinition(
  "EntityMovementBasicComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementComponent = CONTEXT.createClassDefinition(
  "EntityMovementComponent",
  EntityAttributeComponent,
  null,
  true,
);
export const EntityMovementFlyComponent = CONTEXT.createClassDefinition(
  "EntityMovementFlyComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementGenericComponent = CONTEXT.createClassDefinition(
  "EntityMovementGenericComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementGlideComponent = CONTEXT.createClassDefinition(
  "EntityMovementGlideComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementHoverComponent = CONTEXT.createClassDefinition(
  "EntityMovementHoverComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementJumpComponent = CONTEXT.createClassDefinition(
  "EntityMovementJumpComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementSkipComponent = CONTEXT.createClassDefinition(
  "EntityMovementSkipComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityMovementSwayComponent = CONTEXT.createClassDefinition(
  "EntityMovementSwayComponent",
  EntityBaseMovementComponent,
  null,
  true,
);
export const EntityNavigationComponent = CONTEXT.createClassDefinition(
  "EntityNavigationComponent",
  EntityComponent,
  null,
  true,
);
export const EntityNavigationClimbComponent = CONTEXT.createClassDefinition(
  "EntityNavigationClimbComponent",
  EntityNavigationComponent,
  null,
  true,
);
export const EntityNavigationFloatComponent = CONTEXT.createClassDefinition(
  "EntityNavigationFloatComponent",
  EntityNavigationComponent,
  null,
  true,
);
export const EntityNavigationFlyComponent = CONTEXT.createClassDefinition(
  "EntityNavigationFlyComponent",
  EntityNavigationComponent,
  null,
  true,
);
export const EntityNavigationGenericComponent = CONTEXT.createClassDefinition(
  "EntityNavigationGenericComponent",
  EntityNavigationComponent,
  null,
  true,
);
export const EntityNavigationHoverComponent = CONTEXT.createClassDefinition(
  "EntityNavigationHoverComponent",
  EntityNavigationComponent,
  null,
  true,
);
export const EntityNavigationWalkComponent = CONTEXT.createClassDefinition(
  "EntityNavigationWalkComponent",
  EntityNavigationComponent,
  null,
  true,
);
export const EntityNpcComponent = CONTEXT.createClassDefinition("EntityNpcComponent", EntityComponent, null, true);
export const EntityOnFireComponent = CONTEXT.createClassDefinition(
  "EntityOnFireComponent",
  EntityComponent,
  null,
  true,
);
export const EntityProjectileComponent = CONTEXT.createClassDefinition(
  "EntityProjectileComponent",
  EntityComponent,
  null,
  true,
).addMethod(
  "shoot",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "velocity",
      type: {
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
          name: "ProjectileShootOptions",
        },
      },
    },
  ]),
);
export const EntityPushThroughComponent = CONTEXT.createClassDefinition(
  "EntityPushThroughComponent",
  EntityComponent,
  null,
  true,
);
export const EntityRemoveAfterEvent = CONTEXT.createClassDefinition("EntityRemoveAfterEvent", null, null, true);
export const EntityRemoveAfterEventSignal = CONTEXT.createClassDefinition(
  "EntityRemoveAfterEventSignal",
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
                name: "EntityRemoveAfterEvent",
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
            name: "EntityEventOptions",
          },
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
                name: "EntityRemoveAfterEvent",
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
export const EntityRemoveBeforeEvent = CONTEXT.createClassDefinition("EntityRemoveBeforeEvent", null, null, true);
export const EntityRemoveBeforeEventSignal = CONTEXT.createClassDefinition(
  "EntityRemoveBeforeEventSignal",
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
                name: "EntityRemoveBeforeEvent",
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
                name: "EntityRemoveBeforeEvent",
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
export const EntityRideableComponent = CONTEXT.createClassDefinition(
  "EntityRideableComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod(
    "addRider",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "rider",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
    ]),
  )
  .addMethod(
    "ejectRider",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "rider",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Entity",
        },
      },
    ]),
  )
  .addMethod("ejectRiders", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getFamilyTypes", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getRiders", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getSeats", Types.ParamsDefinition.From(CONTEXT, []));
export const EntityRidingComponent = CONTEXT.createClassDefinition(
  "EntityRidingComponent",
  EntityComponent,
  null,
  true,
);
export const EntityScaleComponent = CONTEXT.createClassDefinition("EntityScaleComponent", EntityComponent, null, true);
export const EntitySkinIdComponent = CONTEXT.createClassDefinition(
  "EntitySkinIdComponent",
  EntityComponent,
  null,
  true,
);
export const EntitySpawnAfterEvent = CONTEXT.createClassDefinition("EntitySpawnAfterEvent", null, null, true);
export const EntitySpawnAfterEventSignal = CONTEXT.createClassDefinition(
  "EntitySpawnAfterEventSignal",
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
                name: "EntitySpawnAfterEvent",
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
                name: "EntitySpawnAfterEvent",
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
export const EntityStrengthComponent = CONTEXT.createClassDefinition(
  "EntityStrengthComponent",
  EntityComponent,
  null,
  true,
);
export const EntityTameableComponent = CONTEXT.createClassDefinition(
  "EntityTameableComponent",
  EntityComponent,
  null,
  true,
).addMethod(
  "tame",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "player",
      type: {
        is_bind_type: true,
        is_errorable: false,
        name: "Player",
      },
    },
  ]),
);
export const EntityTameMountComponent = CONTEXT.createClassDefinition(
  "EntityTameMountComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod(
    "tame",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "showParticles",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "tameToPlayer",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "showParticles",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
      {
        details: null,
        name: "player",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
    ]),
  );
export const EntityType = CONTEXT.createClassDefinition("EntityType", null, null, true);
export const EntityTypeFamilyComponent = CONTEXT.createClassDefinition(
  "EntityTypeFamilyComponent",
  EntityComponent,
  null,
  true,
)
  .addMethod("getTypeFamilies", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasTypeFamily",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "typeFamily",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  );
export const EntityTypeIterator = CONTEXT.createClassDefinition("EntityTypeIterator", null, null, true);
export const EntityTypes = CONTEXT.createClassDefinition("EntityTypes", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const EntityUnderwaterMovementComponent = CONTEXT.createClassDefinition(
  "EntityUnderwaterMovementComponent",
  EntityAttributeComponent,
  null,
  true,
);
export const EntityVariantComponent = CONTEXT.createClassDefinition(
  "EntityVariantComponent",
  EntityComponent,
  null,
  true,
);
export const EntityWantsJockeyComponent = CONTEXT.createClassDefinition(
  "EntityWantsJockeyComponent",
  EntityComponent,
  null,
  true,
);
export const ExplosionAfterEvent = CONTEXT.createClassDefinition("ExplosionAfterEvent", null, null, true).addMethod(
  "getImpactedBlocks",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const ExplosionAfterEventSignal = CONTEXT.createClassDefinition("ExplosionAfterEventSignal", null, null, true)
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
                name: "ExplosionAfterEvent",
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
                name: "ExplosionAfterEvent",
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
export const ExplosionBeforeEvent = CONTEXT.createClassDefinition(
  "ExplosionBeforeEvent",
  ExplosionAfterEvent,
  null,
  true,
).addMethod(
  "setImpactedBlocks",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "blocks",
      type: {
        element_type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Block",
        },
        is_bind_type: false,
        is_errorable: false,
        name: "array",
      },
    },
  ]),
);
export const ExplosionBeforeEventSignal = CONTEXT.createClassDefinition("ExplosionBeforeEventSignal", null, null, true)
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
                name: "ExplosionBeforeEvent",
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
                name: "ExplosionBeforeEvent",
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
export const FeedItem = CONTEXT.createClassDefinition("FeedItem", null, null, true).addMethod(
  "getEffects",
  Types.ParamsDefinition.From(CONTEXT, []),
);
export const FeedItemEffect = CONTEXT.createClassDefinition("FeedItemEffect", null, null, true);
export const FilterGroup = CONTEXT.createClassDefinition("FilterGroup", null, null, true);
export const FluidContainer = CONTEXT.createClassDefinition("FluidContainer", null, null, true);
export const GameRuleChangeAfterEvent = CONTEXT.createClassDefinition("GameRuleChangeAfterEvent", null, null, true);
export const GameRuleChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "GameRuleChangeAfterEventSignal",
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
                name: "GameRuleChangeAfterEvent",
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
                name: "GameRuleChangeAfterEvent",
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
export const GameRules = CONTEXT.createClassDefinition("GameRules", null, null, true);
export const ILeverActionAfterEventSignal = CONTEXT.createClassDefinition(
  "ILeverActionAfterEventSignal",
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
                name: "LeverActionAfterEvent",
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
                name: "LeverActionAfterEvent",
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
export const IPlayerJoinAfterEventSignal = CONTEXT.createClassDefinition(
  "IPlayerJoinAfterEventSignal",
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
                name: "PlayerJoinAfterEvent",
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
                name: "PlayerJoinAfterEvent",
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
export const IPlayerLeaveAfterEventSignal = CONTEXT.createClassDefinition(
  "IPlayerLeaveAfterEventSignal",
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
                name: "PlayerLeaveAfterEvent",
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
                name: "PlayerLeaveAfterEvent",
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
export const IPlayerSpawnAfterEventSignal = CONTEXT.createClassDefinition(
  "IPlayerSpawnAfterEventSignal",
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
                name: "PlayerSpawnAfterEvent",
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
                name: "PlayerSpawnAfterEvent",
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
export const ItemCompleteUseAfterEvent = CONTEXT.createClassDefinition("ItemCompleteUseAfterEvent", null, null, true);
export const ItemCompleteUseAfterEventSignal = CONTEXT.createClassDefinition(
  "ItemCompleteUseAfterEventSignal",
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
                name: "ItemCompleteUseAfterEvent",
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
                name: "ItemCompleteUseAfterEvent",
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
export const ItemCompleteUseEvent = CONTEXT.createClassDefinition("ItemCompleteUseEvent", null, null, true);
export const ItemComponent = CONTEXT.createClassDefinition("ItemComponent", Component, null, true);
export const ItemComponentBeforeDurabilityDamageEvent = CONTEXT.createClassDefinition(
  "ItemComponentBeforeDurabilityDamageEvent",
  null,
  null,
  true,
);
export const ItemComponentCompleteUseEvent = CONTEXT.createClassDefinition(
  "ItemComponentCompleteUseEvent",
  ItemCompleteUseEvent,
  null,
  true,
);
export const ItemComponentConsumeEvent = CONTEXT.createClassDefinition("ItemComponentConsumeEvent", null, null, true);
export const ItemComponentHitEntityEvent = CONTEXT.createClassDefinition(
  "ItemComponentHitEntityEvent",
  null,
  null,
  true,
);
export const ItemComponentMineBlockEvent = CONTEXT.createClassDefinition(
  "ItemComponentMineBlockEvent",
  null,
  null,
  true,
);
export const ItemComponentRegistry = CONTEXT.createClassDefinition("ItemComponentRegistry", null, null, true).addMethod(
  "registerCustomComponent",
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
      name: "itemCustomComponent",
      type: {
        is_bind_type: true,
        is_errorable: false,
        name: "ItemCustomComponent",
      },
    },
  ]),
);
export const ItemComponentUseEvent = CONTEXT.createClassDefinition("ItemComponentUseEvent", null, null, true);
export const ItemUseOnEvent = CONTEXT.createClassDefinition("ItemUseOnEvent", null, null, true);
export const ItemComponentUseOnEvent = CONTEXT.createClassDefinition(
  "ItemComponentUseOnEvent",
  ItemUseOnEvent,
  null,
  true,
);
export const ItemCooldownComponent = CONTEXT.createClassDefinition("ItemCooldownComponent", ItemComponent, null, true)
  .addMethod(
    "getCooldownTicksRemaining",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
    ]),
  )
  .addMethod(
    "isCooldownCategory",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "cooldownCategory",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "startCooldown",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
    ]),
  );
export const ItemDurabilityComponent = CONTEXT.createClassDefinition(
  "ItemDurabilityComponent",
  ItemComponent,
  null,
  true,
)
  .addMethod(
    "getDamageChance",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: 0,
          max_value: 3,
          min_value: 0,
        },
        name: "unbreakingEnchantmentLevel",
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
  .addMethod("getDamageChanceRange", Types.ParamsDefinition.From(CONTEXT, []));
export const ItemEnchantableComponent = CONTEXT.createClassDefinition(
  "ItemEnchantableComponent",
  ItemComponent,
  null,
  true,
)
  .addMethod(
    "addEnchantment",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "enchantment",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Enchantment",
        },
      },
    ]),
  )
  .addMethod(
    "addEnchantments",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "enchantments",
        type: {
          element_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "Enchantment",
          },
          is_bind_type: false,
          is_errorable: false,
          name: "array",
        },
      },
    ]),
  )
  .addMethod(
    "canAddEnchantment",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "enchantment",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Enchantment",
        },
      },
    ]),
  )
  .addMethod(
    "getEnchantment",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "enchantmentType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "EnchantmentType",
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
  .addMethod("getEnchantments", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasEnchantment",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "enchantmentType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "EnchantmentType",
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
  .addMethod("removeAllEnchantments", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "removeEnchantment",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "enchantmentType",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "EnchantmentType",
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
export const ItemFoodComponent = CONTEXT.createClassDefinition("ItemFoodComponent", ItemComponent, null, true);
export const ItemPotionComponent = CONTEXT.createClassDefinition("ItemPotionComponent", ItemComponent, null, true);
export const ItemReleaseUseAfterEvent = CONTEXT.createClassDefinition("ItemReleaseUseAfterEvent", null, null, true);
export const ItemReleaseUseAfterEventSignal = CONTEXT.createClassDefinition(
  "ItemReleaseUseAfterEventSignal",
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
                name: "ItemReleaseUseAfterEvent",
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
                name: "ItemReleaseUseAfterEvent",
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
export const ItemStack = CONTEXT.createClassDefinition(
  "ItemStack",
  null,
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
      details: {
        default_value: 1,
        max_value: 255,
        min_value: 1,
      },
      name: "amount",
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
  true,
)
  .addMethod("clearDynamicProperties", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("clone", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "createPotion",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "options",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "PotionOptions",
        },
      },
    ]),
  )
  .addMethod("getCanDestroy", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getCanPlaceOn", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentId",
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
    "getDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getDynamicPropertyIds", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getDynamicPropertyTotalByteCount", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getLore", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getTags", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasComponent",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "componentId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "hasTag",
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
  )
  .addMethod(
    "isStackableWith",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
    ]),
  )
  .addMethod(
    "matches",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemName",
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
        name: "states",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
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
  )
  .addMethod(
    "setCanDestroy",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "blockIdentifiers",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setCanPlaceOn",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "blockIdentifiers",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
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
        name: "value",
        type: {
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
                name: "double",
                valid_range: {
                  max: 2147483647,
                  min: -2147483648,
                },
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
                is_bind_type: true,
                is_errorable: false,
                name: "Vector3",
              },
            ],
          },
        },
      },
    ]),
  )
  .addMethod(
    "setLore",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "loreList",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  );
export const ItemStartUseAfterEvent = CONTEXT.createClassDefinition("ItemStartUseAfterEvent", null, null, true);
export const ItemStartUseAfterEventSignal = CONTEXT.createClassDefinition(
  "ItemStartUseAfterEventSignal",
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
                name: "ItemStartUseAfterEvent",
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
                name: "ItemStartUseAfterEvent",
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
export const ItemStartUseOnAfterEvent = CONTEXT.createClassDefinition("ItemStartUseOnAfterEvent", null, null, true);
export const ItemStartUseOnAfterEventSignal = CONTEXT.createClassDefinition(
  "ItemStartUseOnAfterEventSignal",
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
                name: "ItemStartUseOnAfterEvent",
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
                name: "ItemStartUseOnAfterEvent",
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
export const ItemStopUseAfterEvent = CONTEXT.createClassDefinition("ItemStopUseAfterEvent", null, null, true);
export const ItemStopUseAfterEventSignal = CONTEXT.createClassDefinition(
  "ItemStopUseAfterEventSignal",
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
                name: "ItemStopUseAfterEvent",
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
                name: "ItemStopUseAfterEvent",
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
export const ItemStopUseOnAfterEvent = CONTEXT.createClassDefinition("ItemStopUseOnAfterEvent", null, null, true);
export const ItemStopUseOnAfterEventSignal = CONTEXT.createClassDefinition(
  "ItemStopUseOnAfterEventSignal",
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
                name: "ItemStopUseOnAfterEvent",
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
                name: "ItemStopUseOnAfterEvent",
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
export const ItemType = CONTEXT.createClassDefinition("ItemType", null, null, true);
export const ItemTypes = CONTEXT.createClassDefinition("ItemTypes", null, null, true)
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getAll", Types.ParamsDefinition.From(CONTEXT, []));
export const ItemUseAfterEvent = CONTEXT.createClassDefinition("ItemUseAfterEvent", null, null, true);
export const ItemUseAfterEventSignal = CONTEXT.createClassDefinition("ItemUseAfterEventSignal", null, null, true)
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
                name: "ItemUseAfterEvent",
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
                name: "ItemUseAfterEvent",
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
export const ItemUseBeforeEvent = CONTEXT.createClassDefinition("ItemUseBeforeEvent", ItemUseAfterEvent, null, true);
export const ItemUseBeforeEventSignal = CONTEXT.createClassDefinition("ItemUseBeforeEventSignal", null, null, true)
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
                name: "ItemUseBeforeEvent",
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
                name: "ItemUseBeforeEvent",
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
export const ItemUseOnAfterEvent = CONTEXT.createClassDefinition("ItemUseOnAfterEvent", null, null, true);
export const ItemUseOnAfterEventSignal = CONTEXT.createClassDefinition("ItemUseOnAfterEventSignal", null, null, true)
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
                name: "ItemUseOnAfterEvent",
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
                name: "ItemUseOnAfterEvent",
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
export const ItemUseOnBeforeEvent = CONTEXT.createClassDefinition(
  "ItemUseOnBeforeEvent",
  ItemUseOnAfterEvent,
  null,
  true,
);
export const ItemUseOnBeforeEventSignal = CONTEXT.createClassDefinition("ItemUseOnBeforeEventSignal", null, null, true)
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
                name: "ItemUseOnBeforeEvent",
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
                name: "ItemUseOnBeforeEvent",
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
export const LeverActionAfterEvent = CONTEXT.createClassDefinition("LeverActionAfterEvent", BlockEvent, null, true);
export const LeverActionAfterEventSignal = CONTEXT.createClassDefinition(
  "LeverActionAfterEventSignal",
  ILeverActionAfterEventSignal,
  null,
  true,
);
export const ListBlockVolume = CONTEXT.createClassDefinition(
  "ListBlockVolume",
  BlockVolumeBase,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "locations",
      type: {
        element_type: {
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
  true,
)
  .addMethod(
    "add",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "locations",
        type: {
          element_type: {
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
    "remove",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "locations",
        type: {
          element_type: {
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
  );
export const MessageReceiveAfterEvent = CONTEXT.createClassDefinition("MessageReceiveAfterEvent", null, null, true);
export const MinecraftDimensionTypes = CONTEXT.createClassDefinition("MinecraftDimensionTypes", null, null, true);
export const MolangVariableMap = CONTEXT.createClassDefinition(
  "MolangVariableMap",
  null,
  Types.ParamsDefinition.From(CONTEXT, []),
  true,
)
  .addMethod(
    "setColorRGB",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "variableName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "color",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "RGB",
        },
      },
    ]),
  )
  .addMethod(
    "setColorRGBA",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "variableName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "color",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "RGBA",
        },
      },
    ]),
  )
  .addMethod(
    "setFloat",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "variableName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "number",
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
    "setSpeedAndDirection",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "variableName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
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
      {
        details: null,
        name: "direction",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "setVector3",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "variableName",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "vector",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  );
export const PistonActivateAfterEvent = CONTEXT.createClassDefinition(
  "PistonActivateAfterEvent",
  BlockEvent,
  null,
  true,
);
export const PistonActivateAfterEventSignal = CONTEXT.createClassDefinition(
  "PistonActivateAfterEventSignal",
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
                name: "PistonActivateAfterEvent",
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
                name: "PistonActivateAfterEvent",
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
export const Player = CONTEXT.createClassDefinition("Player", Entity, null, true)
  .addMethod(
    "addExperience",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 16777216,
          min_value: -16777216,
        },
        name: "amount",
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
    "addLevels",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 16777216,
          min_value: -16777216,
        },
        name: "amount",
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
    "eatItem",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "itemStack",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ItemStack",
        },
      },
    ]),
  )
  .addMethod("getGameMode", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getItemCooldown",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "cooldownCategory",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getSpawnPoint", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getTotalXp", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("isOp", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "playMusic",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "trackId",
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
        name: "musicOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MusicOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "playSound",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "soundId",
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
        name: "soundOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "PlayerSoundOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "postClientMessage",
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
        name: "value",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "queueMusic",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "trackId",
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
        name: "musicOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MusicOptions",
          },
        },
      },
    ]),
  )
  .addMethod("resetLevel", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "sendMessage",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "message",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              element_type: {
                is_bind_type: false,
                is_errorable: false,
                name: "variant",
                variant_types: [
                  {
                    is_bind_type: true,
                    is_errorable: false,
                    name: "RawMessage",
                  },
                  {
                    is_bind_type: false,
                    is_errorable: false,
                    name: "string",
                  },
                ],
              },
              is_bind_type: false,
              is_errorable: false,
              name: "array",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
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
    "setGameMode",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "gameMode",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "GameMode",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setOp",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "isOp",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "boolean",
        },
      },
    ]),
  )
  .addMethod(
    "setSpawnPoint",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "spawnPoint",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "DimensionLocation",
          },
        },
      },
    ]),
  )
  .addMethod(
    "spawnParticle",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "effectName",
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
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "molangVariables",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MolangVariableMap",
          },
        },
      },
    ]),
  )
  .addMethod(
    "startItemCooldown",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "cooldownCategory",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          max_value: 32767,
          min_value: 0,
        },
        name: "tickDuration",
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
  .addMethod("stopMusic", Types.ParamsDefinition.From(CONTEXT, []));
export const PlayerBreakBlockAfterEvent = CONTEXT.createClassDefinition(
  "PlayerBreakBlockAfterEvent",
  BlockEvent,
  null,
  true,
);
export const PlayerBreakBlockAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerBreakBlockAfterEventSignal",
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
                name: "PlayerBreakBlockAfterEvent",
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
            name: "BlockEventOptions",
          },
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
                name: "PlayerBreakBlockAfterEvent",
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
export const PlayerBreakBlockBeforeEvent = CONTEXT.createClassDefinition(
  "PlayerBreakBlockBeforeEvent",
  BlockEvent,
  null,
  true,
);
export const PlayerBreakBlockBeforeEventSignal = CONTEXT.createClassDefinition(
  "PlayerBreakBlockBeforeEventSignal",
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
                name: "PlayerBreakBlockBeforeEvent",
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
            name: "BlockEventOptions",
          },
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
                name: "PlayerBreakBlockBeforeEvent",
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
export const PlayerCursorInventoryComponent = CONTEXT.createClassDefinition(
  "PlayerCursorInventoryComponent",
  EntityComponent,
  null,
  true,
).addMethod("clear", Types.ParamsDefinition.From(CONTEXT, []));
export const PlayerDimensionChangeAfterEvent = CONTEXT.createClassDefinition(
  "PlayerDimensionChangeAfterEvent",
  null,
  null,
  true,
);
export const PlayerDimensionChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerDimensionChangeAfterEventSignal",
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
                name: "PlayerDimensionChangeAfterEvent",
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
                name: "PlayerDimensionChangeAfterEvent",
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
export const PlayerEmoteAfterEvent = CONTEXT.createClassDefinition("PlayerEmoteAfterEvent", null, null, true);
export const PlayerEmoteAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerEmoteAfterEventSignal",
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
                name: "PlayerEmoteAfterEvent",
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
                name: "PlayerEmoteAfterEvent",
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
export const PlayerGameModeChangeAfterEvent = CONTEXT.createClassDefinition(
  "PlayerGameModeChangeAfterEvent",
  null,
  null,
  true,
);
export const PlayerGameModeChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerGameModeChangeAfterEventSignal",
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
                name: "PlayerGameModeChangeAfterEvent",
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
                name: "PlayerGameModeChangeAfterEvent",
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
export const PlayerGameModeChangeBeforeEvent = CONTEXT.createClassDefinition(
  "PlayerGameModeChangeBeforeEvent",
  null,
  null,
  true,
);
export const PlayerGameModeChangeBeforeEventSignal = CONTEXT.createClassDefinition(
  "PlayerGameModeChangeBeforeEventSignal",
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
                name: "PlayerGameModeChangeBeforeEvent",
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
                name: "PlayerGameModeChangeBeforeEvent",
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
export const PlayerInputPermissionCategoryChangeAfterEvent = CONTEXT.createClassDefinition(
  "PlayerInputPermissionCategoryChangeAfterEvent",
  null,
  null,
  true,
);
export const PlayerInputPermissionCategoryChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerInputPermissionCategoryChangeAfterEventSignal",
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
                name: "PlayerInputPermissionCategoryChangeAfterEvent",
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
                name: "PlayerInputPermissionCategoryChangeAfterEvent",
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
export const PlayerInputPermissions = CONTEXT.createClassDefinition("PlayerInputPermissions", null, null, true);
export const PlayerInteractWithBlockAfterEvent = CONTEXT.createClassDefinition(
  "PlayerInteractWithBlockAfterEvent",
  null,
  null,
  true,
);
export const PlayerInteractWithBlockAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerInteractWithBlockAfterEventSignal",
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
                name: "PlayerInteractWithBlockAfterEvent",
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
                name: "PlayerInteractWithBlockAfterEvent",
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
export const PlayerInteractWithBlockBeforeEvent = CONTEXT.createClassDefinition(
  "PlayerInteractWithBlockBeforeEvent",
  null,
  null,
  true,
);
export const PlayerInteractWithBlockBeforeEventSignal = CONTEXT.createClassDefinition(
  "PlayerInteractWithBlockBeforeEventSignal",
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
                name: "PlayerInteractWithBlockBeforeEvent",
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
                name: "PlayerInteractWithBlockBeforeEvent",
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
export const PlayerInteractWithEntityAfterEvent = CONTEXT.createClassDefinition(
  "PlayerInteractWithEntityAfterEvent",
  null,
  null,
  true,
);
export const PlayerInteractWithEntityAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerInteractWithEntityAfterEventSignal",
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
                name: "PlayerInteractWithEntityAfterEvent",
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
                name: "PlayerInteractWithEntityAfterEvent",
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
export const PlayerInteractWithEntityBeforeEvent = CONTEXT.createClassDefinition(
  "PlayerInteractWithEntityBeforeEvent",
  null,
  null,
  true,
);
export const PlayerInteractWithEntityBeforeEventSignal = CONTEXT.createClassDefinition(
  "PlayerInteractWithEntityBeforeEventSignal",
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
                name: "PlayerInteractWithEntityBeforeEvent",
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
                name: "PlayerInteractWithEntityBeforeEvent",
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
export const PlayerIterator = CONTEXT.createClassDefinition("PlayerIterator", null, null, true);
export const PlayerJoinAfterEvent = CONTEXT.createClassDefinition("PlayerJoinAfterEvent", null, null, true);
export const PlayerJoinAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerJoinAfterEventSignal",
  IPlayerJoinAfterEventSignal,
  null,
  true,
);
export const PlayerLeaveAfterEvent = CONTEXT.createClassDefinition("PlayerLeaveAfterEvent", null, null, true);
export const PlayerLeaveAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerLeaveAfterEventSignal",
  IPlayerLeaveAfterEventSignal,
  null,
  true,
);
export const PlayerLeaveBeforeEvent = CONTEXT.createClassDefinition("PlayerLeaveBeforeEvent", null, null, true);
export const PlayerLeaveBeforeEventSignal = CONTEXT.createClassDefinition(
  "PlayerLeaveBeforeEventSignal",
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
                name: "PlayerLeaveBeforeEvent",
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
                name: "PlayerLeaveBeforeEvent",
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
export const PlayerPlaceBlockAfterEvent = CONTEXT.createClassDefinition(
  "PlayerPlaceBlockAfterEvent",
  BlockEvent,
  null,
  true,
);
export const PlayerPlaceBlockAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerPlaceBlockAfterEventSignal",
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
                name: "PlayerPlaceBlockAfterEvent",
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
            name: "BlockEventOptions",
          },
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
                name: "PlayerPlaceBlockAfterEvent",
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
export const PlayerPlaceBlockBeforeEvent = CONTEXT.createClassDefinition(
  "PlayerPlaceBlockBeforeEvent",
  BlockEvent,
  null,
  true,
);
export const PlayerPlaceBlockBeforeEventSignal = CONTEXT.createClassDefinition(
  "PlayerPlaceBlockBeforeEventSignal",
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
                name: "PlayerPlaceBlockBeforeEvent",
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
            name: "BlockEventOptions",
          },
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
                name: "PlayerPlaceBlockBeforeEvent",
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
export const PlayerSpawnAfterEvent = CONTEXT.createClassDefinition("PlayerSpawnAfterEvent", null, null, true);
export const PlayerSpawnAfterEventSignal = CONTEXT.createClassDefinition(
  "PlayerSpawnAfterEventSignal",
  IPlayerSpawnAfterEventSignal,
  null,
  true,
);
export const PotionEffectType = CONTEXT.createClassDefinition("PotionEffectType", null, null, true);
export const PotionLiquidType = CONTEXT.createClassDefinition("PotionLiquidType", null, null, true);
export const PotionModifierType = CONTEXT.createClassDefinition("PotionModifierType", null, null, true);
export const Potions = CONTEXT.createClassDefinition("Potions", null, null, true)
  .addMethod(
    "getPotionEffectType",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "potionEffectId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getPotionLiquidType",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "potionLiquidId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getPotionModifierType",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "potionModifierId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  );
export const PressurePlatePopAfterEvent = CONTEXT.createClassDefinition(
  "PressurePlatePopAfterEvent",
  BlockEvent,
  null,
  true,
);
export const PressurePlatePopAfterEventSignal = CONTEXT.createClassDefinition(
  "PressurePlatePopAfterEventSignal",
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
                name: "PressurePlatePopAfterEvent",
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
                name: "PressurePlatePopAfterEvent",
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
export const PressurePlatePushAfterEvent = CONTEXT.createClassDefinition(
  "PressurePlatePushAfterEvent",
  BlockEvent,
  null,
  true,
);
export const PressurePlatePushAfterEventSignal = CONTEXT.createClassDefinition(
  "PressurePlatePushAfterEventSignal",
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
                name: "PressurePlatePushAfterEvent",
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
                name: "PressurePlatePushAfterEvent",
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
export const ProjectileHitBlockAfterEvent = CONTEXT.createClassDefinition(
  "ProjectileHitBlockAfterEvent",
  null,
  null,
  true,
).addMethod("getBlockHit", Types.ParamsDefinition.From(CONTEXT, []));
export const ProjectileHitBlockAfterEventSignal = CONTEXT.createClassDefinition(
  "ProjectileHitBlockAfterEventSignal",
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
                name: "ProjectileHitBlockAfterEvent",
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
                name: "ProjectileHitBlockAfterEvent",
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
export const ProjectileHitEntityAfterEvent = CONTEXT.createClassDefinition(
  "ProjectileHitEntityAfterEvent",
  null,
  null,
  true,
).addMethod("getEntityHit", Types.ParamsDefinition.From(CONTEXT, []));
export const ProjectileHitEntityAfterEventSignal = CONTEXT.createClassDefinition(
  "ProjectileHitEntityAfterEventSignal",
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
                name: "ProjectileHitEntityAfterEvent",
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
                name: "ProjectileHitEntityAfterEvent",
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
export const Scoreboard = CONTEXT.createClassDefinition("Scoreboard", null, null, true)
  .addMethod(
    "addObjective",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "objectiveId",
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
  )
  .addMethod(
    "clearObjectiveAtDisplaySlot",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "displaySlotId",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "DisplaySlotId",
        },
      },
    ]),
  )
  .addMethod(
    "getObjective",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "objectiveId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getObjectiveAtDisplaySlot",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "displaySlotId",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "DisplaySlotId",
        },
      },
    ]),
  )
  .addMethod("getObjectives", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getParticipants", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "removeObjective",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "objectiveId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "ScoreboardObjective",
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
    "setObjectiveAtDisplaySlot",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "displaySlotId",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "DisplaySlotId",
        },
      },
      {
        details: null,
        name: "objectiveDisplaySetting",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "ScoreboardObjectiveDisplayOptions",
        },
      },
    ]),
  );
export const ScoreboardIdentity = CONTEXT.createClassDefinition("ScoreboardIdentity", null, null, true)
  .addMethod("getEntity", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []));
export const ScoreboardObjective = CONTEXT.createClassDefinition("ScoreboardObjective", null, null, true)
  .addMethod(
    "addScore",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "participant",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "Entity",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "ScoreboardIdentity",
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
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "scoreToAdd",
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
  .addMethod("getParticipants", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getScore",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "participant",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "Entity",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "ScoreboardIdentity",
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
  .addMethod("getScores", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hasParticipant",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "participant",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "Entity",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "ScoreboardIdentity",
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
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "removeParticipant",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "participant",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "Entity",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "ScoreboardIdentity",
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
    "setScore",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "participant",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              is_bind_type: true,
              is_errorable: false,
              name: "Entity",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "ScoreboardIdentity",
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
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "score",
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
export const ScoreboardScoreInfo = CONTEXT.createClassDefinition("ScoreboardScoreInfo", null, null, true);
export const ScreenDisplay = CONTEXT.createClassDefinition("ScreenDisplay", null, null, true)
  .addMethod("getHiddenHudElements", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "hideAllExcept",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          default_value: "null",
        },
        name: "hudElements",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: true,
              is_errorable: false,
              name: "HudElement",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  )
  .addMethod(
    "isForcedHidden",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "hudElement",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "HudElement",
        },
      },
    ]),
  )
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("resetHudElements", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setActionBar",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "text",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              element_type: {
                is_bind_type: false,
                is_errorable: false,
                name: "variant",
                variant_types: [
                  {
                    is_bind_type: true,
                    is_errorable: false,
                    name: "RawMessage",
                  },
                  {
                    is_bind_type: false,
                    is_errorable: false,
                    name: "string",
                  },
                ],
              },
              is_bind_type: false,
              is_errorable: false,
              name: "array",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
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
    "setHudVisibility",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "visible",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "HudVisibility",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "hudElements",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            element_type: {
              is_bind_type: true,
              is_errorable: false,
              name: "HudElement",
            },
            is_bind_type: false,
            is_errorable: false,
            name: "array",
          },
        },
      },
    ]),
  )
  .addMethod(
    "setTitle",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "title",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              element_type: {
                is_bind_type: false,
                is_errorable: false,
                name: "variant",
                variant_types: [
                  {
                    is_bind_type: true,
                    is_errorable: false,
                    name: "RawMessage",
                  },
                  {
                    is_bind_type: false,
                    is_errorable: false,
                    name: "string",
                  },
                ],
              },
              is_bind_type: false,
              is_errorable: false,
              name: "array",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
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
            name: "TitleDisplayOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "updateSubtitle",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "subtitle",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              element_type: {
                is_bind_type: false,
                is_errorable: false,
                name: "variant",
                variant_types: [
                  {
                    is_bind_type: true,
                    is_errorable: false,
                    name: "RawMessage",
                  },
                  {
                    is_bind_type: false,
                    is_errorable: false,
                    name: "string",
                  },
                ],
              },
              is_bind_type: false,
              is_errorable: false,
              name: "array",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
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
export const ScriptEventCommandMessageAfterEvent = CONTEXT.createClassDefinition(
  "ScriptEventCommandMessageAfterEvent",
  null,
  null,
  true,
);
export const ScriptEventCommandMessageAfterEventSignal = CONTEXT.createClassDefinition(
  "ScriptEventCommandMessageAfterEventSignal",
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
                name: "ScriptEventCommandMessageAfterEvent",
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
            name: "ScriptEventMessageFilterOptions",
          },
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
                name: "ScriptEventCommandMessageAfterEvent",
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
export const Seat = CONTEXT.createClassDefinition("Seat", null, null, true);
export const ServerMessageAfterEventSignal = CONTEXT.createClassDefinition(
  "ServerMessageAfterEventSignal",
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
                name: "MessageReceiveAfterEvent",
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
                name: "MessageReceiveAfterEvent",
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
export const Structure = CONTEXT.createClassDefinition("Structure", null, null, true)
  .addMethod(
    "getBlockPermutation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "getIsWaterlogged",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod("isValid", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "saveAs",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: {
          default_value: 1,
        },
        name: "saveMode",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "StructureSaveMode",
        },
      },
    ]),
  )
  .addMethod("saveToWorld", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "setBlockPermutation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "location",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "blockPermutation",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "BlockPermutation",
          },
        },
      },
    ]),
  );
export const StructureManager = CONTEXT.createClassDefinition("StructureManager", null, null, true)
  .addMethod(
    "createEmpty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "size",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: 0,
        },
        name: "saveMode",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "StructureSaveMode",
        },
      },
    ]),
  )
  .addMethod(
    "createFromWorld",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "dimension",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Dimension",
        },
      },
      {
        details: null,
        name: "from",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: null,
        name: "to",
        type: {
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
            name: "StructureCreateOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "delete",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "structure",
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
              name: "Structure",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getWorldStructureIds", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "place",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "structure",
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
              name: "Structure",
            },
          ],
        },
      },
      {
        details: null,
        name: "dimension",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Dimension",
        },
      },
      {
        details: null,
        name: "location",
        type: {
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
            name: "StructurePlaceOptions",
          },
        },
      },
    ]),
  );
export const System = CONTEXT.createClassDefinition("System", null, null, true)
  .addMethod(
    "clearJob",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 4294967295,
          min_value: 0,
        },
        name: "jobId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "uint32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "clearRun",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 4294967295,
          min_value: 0,
        },
        name: "runId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "uint32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  )
  .addMethod(
    "run",
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
    "runInterval",
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
      {
        details: {
          default_value: "null",
        },
        name: "tickInterval",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "uint32",
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
    "runJob",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "generator",
        type: {
          generator_type: {
            next_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "undefined",
            },
            return_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "undefined",
            },
            yield_type: {
              is_bind_type: false,
              is_errorable: false,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "generator",
        },
      },
    ]),
  )
  .addMethod(
    "runTimeout",
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
      {
        details: {
          default_value: "null",
        },
        name: "tickDelay",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "uint32",
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
    "waitTicks",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 4294967295,
          min_value: 1,
        },
        name: "ticks",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "uint32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  );
export const SystemAfterEvents = CONTEXT.createClassDefinition("SystemAfterEvents", null, null, true);
export const SystemBeforeEvents = CONTEXT.createClassDefinition("SystemBeforeEvents", null, null, true);
export const TargetBlockHitAfterEvent = CONTEXT.createClassDefinition(
  "TargetBlockHitAfterEvent",
  BlockEvent,
  null,
  true,
);
export const TargetBlockHitAfterEventSignal = CONTEXT.createClassDefinition(
  "TargetBlockHitAfterEventSignal",
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
                name: "TargetBlockHitAfterEvent",
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
                name: "TargetBlockHitAfterEvent",
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
export const Trigger = CONTEXT.createClassDefinition(
  "Trigger",
  null,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "eventName",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
  ]),
  true,
);
export const TripWireTripAfterEvent = CONTEXT.createClassDefinition("TripWireTripAfterEvent", BlockEvent, null, true);
export const TripWireTripAfterEventSignal = CONTEXT.createClassDefinition(
  "TripWireTripAfterEventSignal",
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
                name: "TripWireTripAfterEvent",
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
                name: "TripWireTripAfterEvent",
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
export const WatchdogTerminateBeforeEvent = CONTEXT.createClassDefinition(
  "WatchdogTerminateBeforeEvent",
  null,
  null,
  true,
);
export const WatchdogTerminateBeforeEventSignal = CONTEXT.createClassDefinition(
  "WatchdogTerminateBeforeEventSignal",
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
                name: "WatchdogTerminateBeforeEvent",
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
                name: "WatchdogTerminateBeforeEvent",
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
export const WeatherChangeAfterEvent = CONTEXT.createClassDefinition("WeatherChangeAfterEvent", null, null, true);
export const WeatherChangeAfterEventSignal = CONTEXT.createClassDefinition(
  "WeatherChangeAfterEventSignal",
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
                name: "WeatherChangeAfterEvent",
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
                name: "WeatherChangeAfterEvent",
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
export const WeatherChangeBeforeEvent = CONTEXT.createClassDefinition("WeatherChangeBeforeEvent", null, null, true);
export const WeatherChangeBeforeEventSignal = CONTEXT.createClassDefinition(
  "WeatherChangeBeforeEventSignal",
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
                name: "WeatherChangeBeforeEvent",
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
                name: "WeatherChangeBeforeEvent",
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
export const World = CONTEXT.createClassDefinition("World", null, null, true)
  .addMethod(
    "broadcastClientMessage",
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
        name: "value",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("clearDynamicProperties", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getAbsoluteTime", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getAllPlayers", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getDay", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getDefaultSpawnLocation", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getDimension",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "dimensionId",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "getDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod("getDynamicPropertyIds", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod("getDynamicPropertyTotalByteCount", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getEntity",
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
  .addMethod("getMoonPhase", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "getPlayers",
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
            name: "EntityQueryOptions",
          },
        },
      },
    ]),
  )
  .addMethod("getTimeOfDay", Types.ParamsDefinition.From(CONTEXT, []))
  .addMethod(
    "playMusic",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "trackId",
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
        name: "musicOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MusicOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "playSound",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "soundId",
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
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "soundOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "WorldSoundOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "queueMusic",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "trackId",
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
        name: "musicOptions",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "MusicOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "sendMessage",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "message",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              element_type: {
                is_bind_type: false,
                is_errorable: false,
                name: "variant",
                variant_types: [
                  {
                    is_bind_type: true,
                    is_errorable: false,
                    name: "RawMessage",
                  },
                  {
                    is_bind_type: false,
                    is_errorable: false,
                    name: "string",
                  },
                ],
              },
              is_bind_type: false,
              is_errorable: false,
              name: "array",
            },
            {
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
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
    "setAbsoluteTime",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 2147483647,
          min_value: -2147483648,
        },
        name: "absoluteTime",
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
    "setDefaultSpawnLocation",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "spawnLocation",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "Vector3",
        },
      },
    ]),
  )
  .addMethod(
    "setDynamicProperty",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "identifier",
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
        name: "value",
        type: {
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
                name: "double",
                valid_range: {
                  max: 2147483647,
                  min: -2147483648,
                },
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
                is_bind_type: true,
                is_errorable: false,
                name: "Vector3",
              },
            ],
          },
        },
      },
    ]),
  )
  .addMethod(
    "setTimeOfDay",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "timeOfDay",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
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
              is_bind_type: true,
              is_errorable: false,
              name: "TimeOfDay",
            },
          ],
        },
      },
    ]),
  )
  .addMethod("stopMusic", Types.ParamsDefinition.From(CONTEXT, []));
export const WorldAfterEvents = CONTEXT.createClassDefinition("WorldAfterEvents", null, null, true);
export const WorldBeforeEvents = CONTEXT.createClassDefinition("WorldBeforeEvents", null, null, true);
export const WorldInitializeAfterEvent = CONTEXT.createClassDefinition("WorldInitializeAfterEvent", null, null, true);
export const WorldInitializeAfterEventSignal = CONTEXT.createClassDefinition(
  "WorldInitializeAfterEventSignal",
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
                name: "WorldInitializeAfterEvent",
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
                name: "WorldInitializeAfterEvent",
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
export const WorldInitializeBeforeEvent = CONTEXT.createClassDefinition("WorldInitializeBeforeEvent", null, null, true);
export const WorldInitializeBeforeEventSignal = CONTEXT.createClassDefinition(
  "WorldInitializeBeforeEventSignal",
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
                name: "WorldInitializeBeforeEvent",
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
                name: "WorldInitializeBeforeEvent",
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
export const system = System.create();
export const world = World.create();
CONTEXT.resolveAllDynamicTypes();
