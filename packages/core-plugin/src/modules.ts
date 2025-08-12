
export async function loadModules(modules: Array<string>) {
   await Promise.all(modules.map(e => import(e)));
}

