import {
   MetadataClassDefinition,
   MetadataInterfaceDefinition,
   MetadataModuleBaseDefinition,
   MetadataModuleDefinition,
   MetadataObjectDefinition,
} from '@bedrock-apis/types';
import { ASTHelper, ASTIdentifier, ASTImport, ASTNamespaceImport, TsNode, ValueLiteral } from '../codegen/index';
import {
   ADD_METHOD_IDENTIFIER,
   ADD_PROPERTY_IDENTIFIER,
   API_EXPORTS,
   CONTEXT_CREATE_CLASS,
   CONTEXT_REGISTER_TYPE,
   CONTEXT_RESOLVE_ALL_EXPRESSION,
   INTERFACE_BIND_TYPE_NODE,
   NULL_KEYWORD,
} from './constants';
import { constructParams, mapToRecord, metadataModuleFullname } from './helper';

enum VirtualNativeExportType {
   Class = 'Class',
   Object = 'Object',
   Interface = 'Interface',
}
export class VirtualNativeModule {
   public readonly metadata: MetadataModuleDefinition;
   public readonly classes;
   public readonly interfaces;
   public readonly dependencies: Map<string, ASTImport> = new Map();
   public readonly exports: Map<ASTIdentifier, VirtualNativeExportType> = new Map();
   public readonly relativePath: string;
   public dependencyIndex = 16;
   private _emitted = false;
   public constructor(metadata: MetadataModuleDefinition) {
      this.metadata = metadata;
      this.relativePath = VirtualNativeModule.getRelativePath(metadata);
      for (const dependency of metadata.dependencies) this.openDependency(dependency);
      this.classes = mapToRecord(metadata.classes);
      this.interfaces = mapToRecord(metadata.interfaces);
   }
   public openDependency(dependency: MetadataModuleBaseDefinition): ASTImport {
      const fullname = metadataModuleFullname(dependency);
      let exports = this.dependencies.get(fullname);
      if (!exports)
         this.dependencies.set(
            fullname,
            (exports = new ASTNamespaceImport(
               ASTIdentifier.create('__' + (this.dependencyIndex++).toString(16)),
               `./${VirtualNativeModule.getRelativePath(dependency)}.native.js`,
            )),
         );
      return exports;
   }
   public *emitClass(meta: MetadataClassDefinition): Generator<TsNode> {
      const id = ASTIdentifier.unique(meta);
      if (this.exports.has(id)) return;
      this.export(id, VirtualNativeExportType.Class);
      let baseType: TsNode = NULL_KEYWORD;
      if (meta.base_types[0]) {
         if (meta.base_types[0].from_module) {
            const exports = this.openDependency(meta.base_types[0].from_module);
            baseType = exports.import(ASTIdentifier.unique(meta.base_types[0]));
         } else {
            const baseMeta = this.classes[meta.base_types[0].name];
            if (baseMeta) {
               yield* this.emitClass(baseMeta);
               baseType = ASTIdentifier.unique(baseMeta);
            } else {
               console.warn(`Base type ${meta.base_types[0].name} not found`);
            }
         }
      }

      const constructor = meta.functions.find(e => e.name === 'constructor');

      let builderPattern = CONTEXT_CREATE_CLASS.invoke([
         ValueLiteral.getValue(id._text),
         baseType,
         // Null means that constructor is not public
         constructor ? constructParams(constructor.arguments) : NULL_KEYWORD,
         ValueLiteral.getValue(true),
      ]);

      for (const func of meta.functions) {
         if (func.name === 'constructor') continue;
         const params = constructParams(func.arguments);
         builderPattern = builderPattern.methodCall(ADD_METHOD_IDENTIFIER, [ValueLiteral.getValue(func.name), params]);
      }

      // Emit Export declaration
      yield ASTHelper.variableExport(id, builderPattern);
   }
   public *emitInterface(meta: MetadataInterfaceDefinition): Generator<TsNode> {
      const id = ASTIdentifier.unique(meta);
      if (this.exports.has(id)) return;
      this.export(id, VirtualNativeExportType.Interface);
      let baseType: TsNode = NULL_KEYWORD;
      if (meta.base_types[0]) {
         if (meta.base_types[0].from_module) {
            const exports = this.openDependency(meta.base_types[0].from_module);
            baseType = exports.import(ASTIdentifier.unique(meta.base_types[0]));
         } else {
            const baseMeta = this.interfaces[meta.base_types[0].name];
            if (baseMeta) {
               yield* this.emitInterface(baseMeta);
               baseType = ASTIdentifier.unique(baseMeta);
            } else {
               console.warn(`Base type ${meta.base_types[0].name} not found`);
            }
         }
      }

      let builderPattern = INTERFACE_BIND_TYPE_NODE.construct([ValueLiteral.getValue(id._text), baseType]);

      for (const func of meta.properties) {
         builderPattern = builderPattern.methodCall(ADD_PROPERTY_IDENTIFIER, [ValueLiteral.getValue(func.name)]);
      }
      builderPattern = CONTEXT_REGISTER_TYPE.invoke([ValueLiteral.getValue(id._text), builderPattern]);
      // Emit Export declaration
      yield ASTHelper.variableExport(id, builderPattern);
   }
   public *emitObject(meta: MetadataObjectDefinition): Generator<TsNode> {
      const type = meta.type;
      const cl = this.classes[type.name];
      const id = ASTIdentifier.unique(meta);
      if (type.from_module || cl === undefined)
         throw new Error('Object instances from other modules are not supported');

      const targetDefinition = ASTIdentifier.unique(cl);
      this.export(id, VirtualNativeExportType.Object);
      yield ASTHelper.variableExport(id, targetDefinition.access(ASTIdentifier.create('create')).invoke());
   }
   public *emit(): Generator<TsNode> {
      yield API_EXPORTS;
      yield* this.dependencies.values();
      // Interface
      for (const meta of this.metadata.interfaces) yield* this.emitInterface(meta);
      // Classes
      for (const meta of this.metadata.classes) yield* this.emitClass(meta);
      // Objects
      for (const meta of this.metadata.objects) yield* this.emitObject(meta);

      yield CONTEXT_RESOLVE_ALL_EXPRESSION;
      this._emitted = true;
   }
   public *emitVirtualAPIs(): Generator<TsNode> {
      if (!this._emitted) throw new Error('Module has not been emitted yet');
      const apiInstance = ASTIdentifier.create('api');
      const native = new ASTNamespaceImport(ASTIdentifier.create('__'), `./${this.relativePath}.native.js`);
      yield native;
      for (const [identifier, type] of this.exports) {
         let node = native.import(identifier);
         if (type === VirtualNativeExportType.Interface) continue;
         if (type === VirtualNativeExportType.Class) node = node.access(apiInstance);
         yield ASTHelper.variableExport(identifier, node);
      }
   }
   public export(identifier: ASTIdentifier, type: VirtualNativeExportType): void {
      this.exports.set(identifier, type);
   }
   public static getRelativePath(module: MetadataModuleBaseDefinition) {
      const fullname = metadataModuleFullname(module);
      const relative = fullname.split('/').at(-1) ?? fullname;
      if (!relative || relative.includes('undefined')) {
         console.log(fullname, relative, module);
         throw new Error('Undefined or empty version:' + relative);
      }
      return relative;
   }
}
