import { ImageModuleData, SymbolBitFlags } from '@bedrock-apis/binary';
import { BitFlags } from '@bedrock-apis/common';
import { CompilableSymbol, EnumerableAPISymbol, InterfaceSymbol, ModuleSymbol } from '@bedrock-apis/virtual-apis';
import { PreparedImage } from './image-loader';
import { BinaryTypesLoader } from './types-loader';

export class BinarySymbolLoader {
   public static load(image: PreparedImage, { symbols, exports }: ImageModuleData, mod: ModuleSymbol) {
      const { fromIndex: str } = image.stringSlice;

      const publicNames = new Set(exports.map(e => str(e)));

      const add = (symbol: CompilableSymbol<unknown>) => {
         const isPublic = publicNames.has(symbol.name);
         mod.addSymbol(symbol, isPublic);
      };

      const types = new BinaryTypesLoader(image, mod);

      for (const bin of symbols) {
         const name = str(bin.name);

         if (BitFlags.allOf(bin.bitFlags, SymbolBitFlags.IsEnum) && bin.isEnumData) {
            const symbol = new EnumerableAPISymbol().setName(name);
            for (const [i, key] of bin.isEnumData.keys.entries()) {
               const value = bin.isEnumData.values[i]!;
               symbol.addEntry(str(key), bin.isEnumData?.hasNumericalValues ? value : str(value));
            }
            add(symbol);
         } else if (BitFlags.allOf(bin.bitFlags, SymbolBitFlags.IsInterface) && bin.isInterfaceData) {
            const symbol = new InterfaceSymbol().setName(name);
            for (const [i, key] of bin.isInterfaceData.keys.entries()) {
               const value = bin.isInterfaceData.types[i]!;
               symbol.properties.set(str(key), types.resolveType(value));
            }
            add(symbol);
         }
         //  else if (BitFlags.allOf(bin.bitFlags, SymbolBitFlags.IsObject) && bin.hasType) {
         //    mod.addSymbol(new ObjectAPISymbol(this, name, str(types.fromIndex(bin.hasType).name)));
         // } else if (BitFlags.allOf(bin.bitFlags, SymbolBitFlags.IsFunction) && bin.hasType && bin.invocablePrivileges) {
         //    const params = new ParamsDefinition();

         //    this.symbols.set(
         //       name,
         //       new FunctionAPISymbol(this, name, params, resolveType(bin.hasType), bin.invocablePrivileges),
         //    );
         // }

         // all other symbol types
      }
   }
}
