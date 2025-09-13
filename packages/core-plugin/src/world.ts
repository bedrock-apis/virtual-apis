import { Plugin } from '@bedrock-apis/va-pluggable';

export class WorldPlugin extends Plugin {
   public storage = this.server.implementWithStorage(
      'World',
      (_, mod) => ({
         defaultSpawnLocation: { x: 0, y: 0, z: 0 },
         moonPhase: mod.resolve('MoonPhase').FirstQuarter,
         difficulty: mod.resolve('Difficulty').Easy,
      }),
      {
         getDefaultSpawnLocation() {
            return this.storage.defaultSpawnLocation;
         },
         setDefaultSpawnLocation(l) {
            this.storage.defaultSpawnLocation = l;
         },
         getMoonPhase() {
            return this.storage.moonPhase;
         },
         getDifficulty() {
            return this.storage.difficulty;
         },
         setDifficulty(difficulty) {
            this.storage.difficulty = difficulty;
         },
      },
   );
}
WorldPlugin.register('world');
