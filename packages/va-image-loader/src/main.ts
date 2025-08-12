import { CurrentImageSerializer } from '@bedrock-apis/binary';
import { existsSync, readFileSync } from 'node:fs';

const probably = import.meta.resolve('@bedrock-apis/va-images/module/image.bin');
console.log(existsSync(probably));

console.log(CurrentImageSerializer.read(readFileSync(probably.substring(8))));

export {};
