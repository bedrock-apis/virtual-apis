export const identifiers = {
   method: (className: string, methodName: string) => `${className}::${methodName}`,
   getter: (className: string, propertyName: string) => `${className}::${propertyName} getter`,
   setter: (className: string, propertyName: string) => `${className}::${propertyName} setter`,
   constructor: (className: string) => className,
   static: {
      method: (className: string, methodName: string) => `${className}::${methodName} static`,
      getter: (className: string, propertyName: string) => `${className}::${propertyName} getter static`,
      setter: (className: string, propertyName: string) => `${className}::${propertyName} setter static`,
   },
};
