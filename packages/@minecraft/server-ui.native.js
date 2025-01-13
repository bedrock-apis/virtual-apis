import { Types, CONTEXT } from "../api.js";
import * as __10 from "./common.native.js";
import * as __11 from "./server.native.js";
export const ActionFormData = CONTEXT.createClassDefinition(
  "ActionFormData",
  null,
  Types.ParamsDefinition.From(CONTEXT, []),
  true,
)
  .addMethod(
    "body",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "bodyText",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "button",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "text",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "iconPath",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "string",
          },
        },
      },
    ]),
  )
  .addMethod(
    "show",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
    ]),
  )
  .addMethod(
    "title",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "titleText",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  );
export const FormResponse = CONTEXT.createClassDefinition("FormResponse", null, null, true);
export const ActionFormResponse = CONTEXT.createClassDefinition("ActionFormResponse", FormResponse, null, true);
export const MessageFormData = CONTEXT.createClassDefinition(
  "MessageFormData",
  null,
  Types.ParamsDefinition.From(CONTEXT, []),
  true,
)
  .addMethod(
    "body",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "bodyText",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "button1",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "text",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "button2",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "text",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "show",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
    ]),
  )
  .addMethod(
    "title",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "titleText",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  );
export const MessageFormResponse = CONTEXT.createClassDefinition("MessageFormResponse", FormResponse, null, true);
export const ModalFormData = CONTEXT.createClassDefinition(
  "ModalFormData",
  null,
  Types.ParamsDefinition.From(CONTEXT, []),
  true,
)
  .addMethod(
    "dropdown",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "label",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: null,
        name: "options",
        type: {
          element_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "variant",
            variant_types: [
              {
                from_module: {
                  name: "@minecraft/server",
                  uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                  version: "2.0.0-alpha",
                },
                is_bind_type: true,
                is_errorable: false,
                name: "RawMessage",
              },
              {
                is_bind_type: false,
                is_errorable: false,
                name: "string",
              },
            ],
          },
          is_bind_type: false,
          is_errorable: false,
          name: "array",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "defaultValueIndex",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "int32",
            valid_range: {
              max: 2147483647,
              min: -2147483648,
            },
          },
        },
      },
    ]),
  )
  .addMethod(
    "show",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "player",
        type: {
          from_module: {
            name: "@minecraft/server",
            uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
            version: "2.0.0-alpha",
          },
          is_bind_type: true,
          is_errorable: false,
          name: "Player",
        },
      },
    ]),
  )
  .addMethod(
    "slider",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "label",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "minimumValue",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "maximumValue",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          max_value: 3.402823466385289e38,
          min_value: -3.402823466385289e38,
        },
        name: "valueStep",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "float",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "defaultValue",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "float",
            valid_range: {
              max: 2147483647,
              min: -2147483648,
            },
          },
        },
      },
    ]),
  )
  .addMethod(
    "submitButton",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "submitButtonText",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "textField",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "label",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: null,
        name: "placeholderText",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "defaultValue",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "variant",
            variant_types: [
              {
                from_module: {
                  name: "@minecraft/server",
                  uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                  version: "2.0.0-alpha",
                },
                is_bind_type: true,
                is_errorable: false,
                name: "RawMessage",
              },
              {
                is_bind_type: false,
                is_errorable: false,
                name: "string",
              },
            ],
          },
        },
      },
    ]),
  )
  .addMethod(
    "title",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "titleText",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
    ]),
  )
  .addMethod(
    "toggle",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "label",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server",
                uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
                version: "2.0.0-alpha",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "RawMessage",
            },
            {
              is_bind_type: false,
              is_errorable: false,
              name: "string",
            },
          ],
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "defaultValue",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: false,
            is_errorable: false,
            name: "boolean",
          },
        },
      },
    ]),
  );
export const ModalFormResponse = CONTEXT.createClassDefinition("ModalFormResponse", FormResponse, null, true);
export const UIManager = CONTEXT.createClassDefinition("UIManager", null, null, true).addMethod(
  "closeAllForms",
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "player",
      type: {
        from_module: {
          name: "@minecraft/server",
          uuid: "b26a4d4c-afdf-4690-88f8-931846312678",
          version: "2.0.0-alpha",
        },
        is_bind_type: true,
        is_errorable: false,
        name: "Player",
      },
    },
  ]),
);
export const uiManager = UIManager.create();
CONTEXT.resolveAllDynamicTypes();
