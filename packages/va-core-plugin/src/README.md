## Goals and Expectations

Our primary goal is **maintainability**. To achieve this, we need simplicity and clarity so new collaborators can quickly understand both the code and its purpose. This requires significant abstraction.
Backward compatibility or maximum feature coverage are **not** our priorities. Instead, the focus is on creating something easy to maintain, update, change, and test.

### Current Module-Like Implementation

The current implementations in `classes-multi-version` and `multi-version-impl` do not meet the required maintainability and readability standards. More critically, they are not future-proof.
Without proper class structures, dependency handling, and type-controlled storage (distinguishing between native and primitive values), we risk locking ourselves into unscalable core plugins.

### Native Binding Concept

Maintainability and flexibility require **abstraction and separation**.
If the core plugin is structured close to minimal, bare-bone module implementations, it will remain easier to read, maintain, and extend.

For example, a `Player` class should directly manage its own storage and methods. Later, we can attach metadata-driven behaviors (e.g., output marshaling).

```ts
@storage("@minecraft/server-bindings::Player")
export class Player extends Entity {
   @property(...)
   @marshal("primitive")
   public nameTag = "nameTagTest";

   @getter(...)
   @marshal("storage", Dimension) //This has custom marshalling to map handles X storages on fly
   public dimension = new Dimension();
}
```

This does not exclude functions outside classes, which should remain possible:

```ts
function runCommand(this: Entity | Dimension) {
   ...
}

CorePlugin.registerMethodDirect("...Entity::runCommand", ..., runCommand); //You have to specify marshalling info as well
CorePlugin.registerMethodDirect("...Dimension::runCommand", ..., runCommand); //You have to specify marshalling info as well
```

This approach could be further extended with OverTakesJS as an alternative implementation via `CorePlugin`.
