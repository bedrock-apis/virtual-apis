// TODO Plugin
import { Kernel } from '@bedrock-apis/kernel-isolation';
import * as m from '@bedrock-apis/virtual-apis';

Kernel.log('Custom plugin');
m.Context.GetModule('@minecraft/server', '2.0.0-beta').onInvocation('World::getDimension', (...e) => console.log(e));
