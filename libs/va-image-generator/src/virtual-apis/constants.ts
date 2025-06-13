import { API_JS_FILENAME } from '@bedrock-apis/common';
import * as VA from '@bedrock-apis/virtual-apis';
import { ModuleContext } from '@bedrock-apis/virtual-apis';
import { factory } from 'typescript';
import { ASTIdentifier, ASTNamedImport } from '../codegen/index';

export const API_EXPORTS = new ASTNamedImport(`../${API_JS_FILENAME}`);
export const TYPES_IDENTIFIER = API_EXPORTS.import(ASTIdentifier.Create('TypesValidation' satisfies keyof typeof VA));
export const CONTEXT_IDENTIFIER = API_EXPORTS.import(ASTIdentifier.Create('Context' satisfies keyof typeof VA));
export const CONTEXT_RESOLVE_TYPE = CONTEXT_IDENTIFIER.access(
   ASTIdentifier.Unique(ModuleContext.prototype.resolveType),
);
export const CONTEXT_CREATE_CLASS = CONTEXT_IDENTIFIER.access(ASTIdentifier.Unique({ name: 'createClassDefinition' }));
export const CONTEXT_RESOLVE_ALL_EXPRESSION = CONTEXT_IDENTIFIER.methodCall(
   ASTIdentifier.Unique(ModuleContext.prototype.resolveAllDynamicTypes),
);
export const CONTEXT_REGISTER_TYPE = CONTEXT_IDENTIFIER.access(
   ASTIdentifier.Unique(ModuleContext.prototype.registerType),
);
// Types Features
export const INTERFACE_BIND_TYPE_NODE = TYPES_IDENTIFIER.access(
   ASTIdentifier.Unique(VA.TypesValidation.InterfaceBindType),
);
export const PARAMS_DEFINITION_NODE = TYPES_IDENTIFIER.access(
   ASTIdentifier.Unique(VA.TypesValidation.ParamsDefinition),
);
export const PARAMS_DEFINITION_FROM = PARAMS_DEFINITION_NODE.access(
   ASTIdentifier.Unique(VA.TypesValidation.ParamsDefinition.From),
);
// Identifiers
export const ADD_PROPERTY_IDENTIFIER = ASTIdentifier.Unique({ name: 'addProperty' });
export const ADD_METHOD_IDENTIFIER = ASTIdentifier.Unique({ name: 'addMethod' });
export const NULL_KEYWORD = factory.createNull();
