import * as MC from "@minecraft/server";
export const PROTOTYPE_ORIGIN = {};
export const __SET_PROTOTYPE_OF = Object.setPrototypeOf;
export function OVERTAKES(prototype, src) {
    const CLONE = Object.create(Object.getPrototypeOf(prototype), Object.getOwnPropertyDescriptors(prototype));
    Object.setPrototypeOf(src, CLONE);
    Object.defineProperties(prototype, Object.getOwnPropertyDescriptors(src));
    return CLONE;
}
PROTOTYPE_ORIGIN["Block"] = OVERTAKES(MC["Block"]["prototype"], {
    bottomCenter() { return __SET_PROTOTYPE_OF(super.bottomCenter(...arguments), VEC3_PROTOTYPE); },
    center() { return __SET_PROTOTYPE_OF(super.center(...arguments), VEC3_PROTOTYPE); },
    get location() { return __SET_PROTOTYPE_OF(super.location, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["BlockVolume"] = OVERTAKES(MC["BlockVolume"]["prototype"], {
    get from() { return __SET_PROTOTYPE_OF(super.from, VEC3_PROTOTYPE); },
    get to() { return __SET_PROTOTYPE_OF(super.to, VEC3_PROTOTYPE); },
    set from(_) { super.from = _; },
    set to(_) { super.to = _; }
});
PROTOTYPE_ORIGIN["BlockVolumeBase"] = OVERTAKES(MC["BlockVolumeBase"]["prototype"], {
    getMax() { return __SET_PROTOTYPE_OF(super.getMax(...arguments), VEC3_PROTOTYPE); },
    getMin() { return __SET_PROTOTYPE_OF(super.getMin(...arguments), VEC3_PROTOTYPE); },
    getSpan() { return __SET_PROTOTYPE_OF(super.getSpan(...arguments), VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["BoundingBoxUtils"] = OVERTAKES(MC["BoundingBoxUtils"]["prototype"], {
    getCenter() { return __SET_PROTOTYPE_OF(super.getCenter(...arguments), VEC3_PROTOTYPE); },
    getSpan() { return __SET_PROTOTYPE_OF(super.getSpan(...arguments), VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["CompoundBlockVolume"] = OVERTAKES(MC["CompoundBlockVolume"]["prototype"], {
    getMax() { return __SET_PROTOTYPE_OF(super.getMax(...arguments), VEC3_PROTOTYPE); },
    getMin() { return __SET_PROTOTYPE_OF(super.getMin(...arguments), VEC3_PROTOTYPE); },
    getOrigin() { return __SET_PROTOTYPE_OF(super.getOrigin(...arguments), VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["Entity"] = OVERTAKES(MC["Entity"]["prototype"], {
    getHeadLocation() { return __SET_PROTOTYPE_OF(super.getHeadLocation(...arguments), VEC3_PROTOTYPE); },
    getVelocity() { return __SET_PROTOTYPE_OF(super.getVelocity(...arguments), VEC3_PROTOTYPE); },
    getViewDirection() { return __SET_PROTOTYPE_OF(super.getViewDirection(...arguments), VEC3_PROTOTYPE); },
    get location() { return __SET_PROTOTYPE_OF(super.location, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["ItemUseOnAfterEvent"] = OVERTAKES(MC["ItemUseOnAfterEvent"]["prototype"], {
    get faceLocation() { return __SET_PROTOTYPE_OF(super.faceLocation, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["ItemUseOnEvent"] = OVERTAKES(MC["ItemUseOnEvent"]["prototype"], {
    get faceLocation() { return __SET_PROTOTYPE_OF(super.faceLocation, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["PlayerDimensionChangeAfterEvent"] = OVERTAKES(MC["PlayerDimensionChangeAfterEvent"]["prototype"], {
    get fromLocation() { return __SET_PROTOTYPE_OF(super.fromLocation, VEC3_PROTOTYPE); },
    get toLocation() { return __SET_PROTOTYPE_OF(super.toLocation, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["PlayerInteractWithBlockAfterEvent"] = OVERTAKES(MC["PlayerInteractWithBlockAfterEvent"]["prototype"], {
    get faceLocation() { return __SET_PROTOTYPE_OF(super.faceLocation, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["PlayerInteractWithBlockBeforeEvent"] = OVERTAKES(MC["PlayerInteractWithBlockBeforeEvent"]["prototype"], {
    get faceLocation() { return __SET_PROTOTYPE_OF(super.faceLocation, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["PlayerPlaceBlockBeforeEvent"] = OVERTAKES(MC["PlayerPlaceBlockBeforeEvent"]["prototype"], {
    get faceLocation() { return __SET_PROTOTYPE_OF(super.faceLocation, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["ProjectileHitBlockAfterEvent"] = OVERTAKES(MC["ProjectileHitBlockAfterEvent"]["prototype"], {
    get hitVector() { return __SET_PROTOTYPE_OF(super.hitVector, VEC3_PROTOTYPE); },
    get location() { return __SET_PROTOTYPE_OF(super.location, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["ProjectileHitEntityAfterEvent"] = OVERTAKES(MC["ProjectileHitEntityAfterEvent"]["prototype"], {
    get hitVector() { return __SET_PROTOTYPE_OF(super.hitVector, VEC3_PROTOTYPE); },
    get location() { return __SET_PROTOTYPE_OF(super.location, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["Seat"] = OVERTAKES(MC["Seat"]["prototype"], {
    get position() { return __SET_PROTOTYPE_OF(super.position, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["Structure"] = OVERTAKES(MC["Structure"]["prototype"], {
    get size() { return __SET_PROTOTYPE_OF(super.size, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["TargetBlockHitAfterEvent"] = OVERTAKES(MC["TargetBlockHitAfterEvent"]["prototype"], {
    get hitVector() { return __SET_PROTOTYPE_OF(super.hitVector, VEC3_PROTOTYPE); }
});
PROTOTYPE_ORIGIN["World"] = OVERTAKES(MC["World"]["prototype"], {
    getDefaultSpawnLocation() { return __SET_PROTOTYPE_OF(super.getDefaultSpawnLocation(...arguments), VEC3_PROTOTYPE); }
});
