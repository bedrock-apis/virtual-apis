export const ContextOptions = {
   StrictReturnTypes: 'StrictReturnTypes',
   GetterRequireValidBound: 'GetterRequireValidBound',
} as const;
export type OptionKeys = (typeof ContextOptions)[keyof typeof ContextOptions];
