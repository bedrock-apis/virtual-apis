// TODO Plugin
import { Kernel } from "@bedrock-apis/virtual-apis";
import * as m from "@bedrock-apis/virtual-apis";

Kernel.log('Custom plugin');
m.CONTEXT.onInvocation("World::getDimension", (...e) => console.log(e));