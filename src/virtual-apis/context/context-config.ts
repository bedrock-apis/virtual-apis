export interface ContextConfig {
   StrictReturnTypes: boolean;
   GetterRequireValidBound: boolean;
}

export const ContextOptions: { [K in ContextConfigKeys]: K } = {
   StrictReturnTypes: 'StrictReturnTypes',
   GetterRequireValidBound: 'GetterRequireValidBound',
} as const;

export type ContextConfigKeys = keyof ContextConfig;
