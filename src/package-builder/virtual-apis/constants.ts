import { factory } from 'typescript';
import * as apiBuilder from '../../api-builder';
import { Context } from '../../api-builder/context';
import { API_JS_FILENAME } from '../../constants';
import { ASTIdentifier, ASTNamedImport } from '../codegen/index';

export const API_EXPORTS = new ASTNamedImport(`../${API_JS_FILENAME}`);
export const TYPES_IDENTIFIER = API_EXPORTS.import(ASTIdentifier.Create('APITypes' satisfies keyof typeof apiBuilder));
export const CONTEXT_IDENTIFIER = API_EXPORTS.import(ASTIdentifier.Create('CONTEXT' satisfies keyof typeof apiBuilder));
export const CONTEXT_RESOLVE_TYPE = CONTEXT_IDENTIFIER.access(ASTIdentifier.Unique(Context.prototype.resolveType));
export const CONTEXT_CREATE_CLASS = CONTEXT_IDENTIFIER.access(ASTIdentifier.Unique(Context.prototype.createClassDefinition));
export const CONTEXT_RESOLVE_ALL_EXPRESSION = CONTEXT_IDENTIFIER.methodCall(
   ASTIdentifier.Unique(Context.prototype.resolveAllDynamicTypes),
);
export const CONTEXT_REGISTER_TYPE = CONTEXT_IDENTIFIER.access(ASTIdentifier.Unique(Context.prototype.registerType));
// Types Features
export const INTERFACE_BIND_TYPE_NODE = TYPES_IDENTIFIER.access(
   ASTIdentifier.Unique(apiBuilder.APITypes.InterfaceBindType),
);
export const PARAMS_DEFINITION_NODE = TYPES_IDENTIFIER.access(
   ASTIdentifier.Unique(apiBuilder.APITypes.ParamsDefinition),
);
export const PARAMS_DEFINITION_FROM = PARAMS_DEFINITION_NODE.access(
   ASTIdentifier.Unique(apiBuilder.APITypes.ParamsDefinition.From),
);
// Identifiers
export const ADD_PROPERTY_IDENTIFIER = ASTIdentifier.Unique(apiBuilder.ClassDefinition.prototype.addProperty);
export const ADD_METHOD_IDENTIFIER = ASTIdentifier.Unique(apiBuilder.ClassDefinition.prototype.addMethod);
export const NULL_KEYWORD = factory.createNull();
