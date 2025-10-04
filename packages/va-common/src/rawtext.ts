import type { RawMessage, RawText } from '@minecraft/server';

function translateToken(token: string, lang: string) {
   return token;
}

export function rawTextToString(rawText: RawText, lang: string) {
   return rawText.rawtext?.map(e => rawMessageToString(e, lang)).join('') ?? '';
}

export function rawMessageToString(rawMessage: RawMessage, lang: string) {
   let result = '';
   if (rawMessage.text) return rawMessage.text;
   if (rawMessage.translate) {
      const tr = translateToken(rawMessage.translate, lang);
      if (!rawMessage.with) {
         return tr;
      } else {
         const args = [];
         if (Array.isArray(rawMessage.with)) {
            for (const a of rawMessage.with) {
               args.push(a);
            }
         } else {
            if (!rawMessage.with.rawtext) throw new TypeError('RawMessage.with MUST contain [rawtext]');
            for (const a of rawMessage.with.rawtext) {
               args.push(rawMessageToString(a, lang));
            }
         }
         // sprintf(tr, ...args);
         return tr; // unless we support actual translateToken we should skip it
      }
   }

   if (rawMessage.rawtext) {
      for (const m of rawMessage.rawtext) {
         result += rawMessageToString(m, lang);
      }
   }

   return result;
}
