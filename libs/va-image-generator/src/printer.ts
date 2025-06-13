import ts from 'typescript';

import { MetadataModuleDefinition } from '@bedrock-apis/types';
import { VirtualNativeModule } from './virtual-apis';

export async function printModule(source: MetadataModuleDefinition, format = false) {
   const virtualModule = new VirtualNativeModule(source);
   // Create a printer to print the AST back to a string
   const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed });

   async function writeCode(body: ts.Node[]) {
      // Emit the JavaScript code
      const resultCode = printer.printList(
         ts.ListFormat.AllowTrailingComma |
            ts.ListFormat.MultiLine |
            ts.ListFormat.MultiLineBlockStatements |
            ts.ListFormat.Indented,
         body as unknown as ts.NodeArray<ts.Node>,
         ts.createSourceFile('file.js', '', ts.ScriptTarget.ES2020, false, ts.ScriptKind.JS),
      );

      return resultCode;
   }

   const definitionsCode = await writeCode([...virtualModule.emit()]);
   const exportsCode = await writeCode([...virtualModule.emitVirtualAPIs()]);

   return { definitionsCode, exportsCode };
}
