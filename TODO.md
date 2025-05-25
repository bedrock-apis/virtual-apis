# Check what could go wrong
  - Serenity might want to use SerenityEntity as handle directly, but i would avoid that
    - Check If apis has this possibility to overwrite base handle!
    - Don't actually do that its way better if we could just have a handle without any hardcoded bindings, other plugins could do some messed up things.
  - Do we need multi-plugin handles?
    - It would prevent property collisions, but Symbols as well

### Kernel APIs robust, provided with deleted EcmaScript types, to avoid unexpected use of APIs