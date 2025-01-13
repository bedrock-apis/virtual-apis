import { Types, CONTEXT } from "../api.js";
import * as __10 from "./common.native.js";
import * as __11 from "./server.native.js";
import * as __12 from "./server-admin.native.js";
export const PacketEventOptions = CONTEXT.registerType(
  "PacketEventOptions",
  new Types.InterfaceBindType("PacketEventOptions", null)
    .addProperty("ignoredPacketIds")
    .addProperty("monitoredPacketIds"),
);
export const HttpClient = CONTEXT.createClassDefinition("HttpClient", null, null, true)
  .addMethod(
    "cancelAll",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "reason",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "get",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "uri",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "request",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "config",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "HttpRequest",
        },
      },
    ]),
  );
export const HttpHeader = CONTEXT.createClassDefinition(
  "HttpHeader",
  null,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "key",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
    {
      details: null,
      name: "value",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "variant",
        variant_types: [
          {
            from_module: {
              name: "@minecraft/server-admin",
              uuid: "53d7f2bf-bf9c-49c4-ad1f-7c803d947920",
              version: "1.0.0-beta",
            },
            is_bind_type: true,
            is_errorable: false,
            name: "SecretString",
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
  true,
);
export const HttpRequest = CONTEXT.createClassDefinition(
  "HttpRequest",
  null,
  Types.ParamsDefinition.From(CONTEXT, [
    {
      details: null,
      name: "uri",
      type: {
        is_bind_type: false,
        is_errorable: false,
        name: "string",
      },
    },
  ]),
  true,
)
  .addMethod(
    "addHeader",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "key",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
      {
        details: null,
        name: "value",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "variant",
          variant_types: [
            {
              from_module: {
                name: "@minecraft/server-admin",
                uuid: "53d7f2bf-bf9c-49c4-ad1f-7c803d947920",
                version: "1.0.0-beta",
              },
              is_bind_type: true,
              is_errorable: false,
              name: "SecretString",
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
    "setBody",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "body",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "string",
        },
      },
    ]),
  )
  .addMethod(
    "setHeaders",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "headers",
        type: {
          element_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "HttpHeader",
          },
          is_bind_type: false,
          is_errorable: false,
          name: "array",
        },
      },
    ]),
  )
  .addMethod(
    "setMethod",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "method",
        type: {
          is_bind_type: true,
          is_errorable: false,
          name: "HttpRequestMethod",
        },
      },
    ]),
  )
  .addMethod(
    "setTimeout",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: {
          max_value: 4294967295,
          min_value: 0,
        },
        name: "timeout",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "uint32",
          valid_range: {
            max: 2147483647,
            min: -2147483648,
          },
        },
      },
    ]),
  );
export const HttpResponse = CONTEXT.createClassDefinition("HttpResponse", null, null, true);
export const NetworkBeforeEvents = CONTEXT.createClassDefinition("NetworkBeforeEvents", null, null, true);
export const PacketReceiveBeforeEventSignal = CONTEXT.createClassDefinition(
  "PacketReceiveBeforeEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "PacketReceivedBeforeEvent",
              },
            ],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "options",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "PacketEventOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "PacketReceivedBeforeEvent",
              },
            ],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  );
export const PacketReceivedBeforeEvent = CONTEXT.createClassDefinition("PacketReceivedBeforeEvent", null, null, true);
export const PacketSendBeforeEvent = CONTEXT.createClassDefinition("PacketSendBeforeEvent", null, null, true);
export const PacketSendBeforeEventSignal = CONTEXT.createClassDefinition(
  "PacketSendBeforeEventSignal",
  null,
  null,
  true,
)
  .addMethod(
    "subscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "PacketSendBeforeEvent",
              },
            ],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
      {
        details: {
          default_value: "null",
        },
        name: "options",
        type: {
          is_bind_type: false,
          is_errorable: false,
          name: "optional",
          optional_type: {
            is_bind_type: true,
            is_errorable: false,
            name: "PacketEventOptions",
          },
        },
      },
    ]),
  )
  .addMethod(
    "unsubscribe",
    Types.ParamsDefinition.From(CONTEXT, [
      {
        details: null,
        name: "callback",
        type: {
          closure_type: {
            argument_types: [
              {
                is_bind_type: true,
                is_errorable: false,
                name: "PacketSendBeforeEvent",
              },
            ],
            return_type: {
              is_bind_type: false,
              is_errorable: true,
              name: "undefined",
            },
          },
          is_bind_type: false,
          is_errorable: false,
          name: "closure",
        },
      },
    ]),
  );
export const beforeEvents = NetworkBeforeEvents.create();
export const http = HttpClient.create();
CONTEXT.resolveAllDynamicTypes();
