import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';

const folder = 'packages';

for (const entry of await readdir(folder, { withFileTypes: true })) {
   const packagePath = `./${folder}/${entry.name}`;
   const packageJsonPath = `${packagePath}/package.json`;
   if (!existsSync(packageJsonPath)) continue;

   const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8')) as ModulePackageJson;
   const match = packageJson.version.match(/^(\d+)\.(\d+)\.(\d+)(.+)$/);
   if (!match) throw new Error('no match: ' + packageJson.version);
   const [, major, minor, patch, other] = match;
   if (isNaN(Number(patch))) throw new Error('Nan: ' + patch);
   if (isNaN(Number(minor))) throw new Error('Nan: ' + patch);

   // Only minor for now
   const newVersion = `${major}.${Number(minor)}.${Number(patch) + 1}${other}`;
   packageJson.version = newVersion;

   await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 3).replaceAll('\n', '\r\n') + '\r\n');
}

interface ModulePackageJson {
   version: string;
   name: string;
}
