import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';

export async function loadModules(modules: KernelArray<string>) {
   await Kernel['globalThis::Promise'].all(modules.map(e => import(e)).asArray());
}
