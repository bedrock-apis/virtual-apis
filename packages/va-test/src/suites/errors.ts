/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ItemStack } from '@minecraft/server';
import { TestSuite } from '../suite';

TestSuite.simple('error')
   .test(() => ItemStack.prototype.getComponents.call(null))
   .test(() => new ItemStack('Yes', 5))
   // @ts-expect-error
   .test(() => new ItemStack('Yes', 5, 5));
