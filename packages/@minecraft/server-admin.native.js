import { Types, CONTEXT } from "../api.js";
import * as __10 from "./common.native.js";
import * as __11 from "./server.native.js";
export const SecretString = CONTEXT.createClassDefinition(
  "SecretString",
  null,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "value",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
  ]),
  true,
);
export const ServerSecrets = CONTEXT.createClassDefinition("ServerSecrets", null, null, true).addMethod(
  "get",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "name",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
  ]),
);
export const ServerVariables = CONTEXT.createClassDefinition("ServerVariables", null, null, true).addMethod(
  "get",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "name",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
  ]),
);
export const secrets = ServerSecrets.create();
export const variables = ServerVariables.create();
CONTEXT.resolveAllDynamicTypes();
