import { ClassDefinition } from './class-definition';
import { Diagnostics, ERRORS } from '../errors';
import { ConstructionExecutionContext, ExecutionContext } from './execution-context';
import { Kernel } from '../kernel';
import { ParamsDefinition, Type } from '../type-validators';

export class APIBuilder extends Kernel.Empty {
   /**
    * Builds new Fake API Class
    * @param definition Class Definition
    * @returns API Class function
    */
   public static CreateConstructor<T extends ClassDefinition<ClassDefinition | null, unknown>>(
      definition: T,
      paramsDefinition: ParamsDefinition,
   ) {
      // Create function as constructor
      const ctor = function () {
         const diagnostics = new Diagnostics();
         const executionContext = new ConstructionExecutionContext(
            definition as ClassDefinition,
            'constructor',
            // eslint-disable-next-line prefer-rest-params
            arguments as ArrayLike<unknown>,
            diagnostics,
         );
         // Constructor should be callable only with "NEW" keyword
         if (!new.target && definition.newExpected) diagnostics.report(ERRORS.NewExpected);

         // If constructor is present for this class
         if (!definition.hasConstructor) diagnostics.report(ERRORS.NoConstructor(definition.classId));

         // Validate Errors
         paramsDefinition.validate(diagnostics, executionContext.parameters);

         // Checks
         if (!diagnostics.success) {
            definition.__reports(executionContext);
            diagnostics.throw(1);
         }

         // Call Native constructor and sets its result as new.target.prototype
         const result = Kernel.__setPrototypeOf(
            definition.__construct(executionContext)[0],
            new.target?.prototype ?? definition.api.prototype,
         );

         // Checks 2
         if (!diagnostics.success) {
            // TODO: What design of our plugin system we want right?
            // definition.__reports(executionContext);
            diagnostics.throw(1);
         }
         return result;
      };

      // Create new prototype with this constructor function
      ctor.prototype = { constructor: ctor };

      // Check for inheritance
      const parent = definition.parent;
      if (parent) {
         Kernel.__setPrototypeOf(ctor, parent.api);
         Kernel.__setPrototypeOf(ctor.prototype, parent.api.prototype);
      }

      // Final sealing so the class has readonly prototype
      Kernel.SetClass(ctor, definition.classId);

      // return the Fake API Class
      return ctor as T['api'];
   }

   /**
    * @param definition Class Definition
    * @param name Name of the function
    * @returns Fake API Functions
    */
   public static CreateMethod<T extends ClassDefinition<ClassDefinition | null, unknown>>(
      definition: T,
      name: string,
      paramsDefinition: ParamsDefinition,
      returnType: Type,
   ) {
      const id = `${definition.classId}::${name}`;
      // Build arrow function so the methods are not possible to call with new expression
      const method = (that: unknown, params: unknown[]) => {
         const diagnostics = new Diagnostics();
         const executionContext = new ExecutionContext(
            definition as ClassDefinition,
            id,
            params,
            diagnostics,
            that as object,
         );
         // Check if the object has native bound
         if (!definition.context.nativeHandles.has(that as object))
            diagnostics.report(ERRORS.BoundToPrototype('function', id));
         // Validate correctness of this type
         definition.type.validate(diagnostics, that);
         // Validate params
         paramsDefinition.validate(diagnostics, params);

         // Check for diagnostics and report first value
         if (!diagnostics.success) {
            definition.__reports(executionContext);
            diagnostics.throw(1);
         }

         definition.__call(executionContext);

         returnType.validate(diagnostics, executionContext.result);

         // Checks 2
         if (!diagnostics.success) {
            // TODO: What design of our plugin system we want right?
            // definition.__reports(executionContext);
            diagnostics.throw(1);
         }
         // TODO: Implement privileges and type checking
         //if(currentPrivilege && currentPrivilege !== functionType.privilege) throw new ErrorConstructors.NoPrivilege(ErrorMessages.NoPrivilege("function", id));
         //let error = functionType.ValidArgumentTypes(params);
         //if(error) throw new error.ctor(error.message);

         return executionContext.result;
      };

      // Mark function as native
      Kernel.SetFakeNative(method);

      // Set virtual number of params to 0
      Kernel.SetLength(method, 0);

      // Assign name to this function
      Kernel.SetName(method, name);

      // Handle with proxy for support with "this" callback
      const final = new Kernel['globalThis::Proxy'](method, {
         apply(t, that, params) {
            return t(that, params);
         },
      });

      // Set the proxy also as native
      Kernel.SetFakeNative(final);

      // Return
      return final;
   }
   public static CreateSetter<T extends ClassDefinition<ClassDefinition | null>>(
      definition: T,
      name: string,
      paramType: Type,
      returnType: Type,
   ) {
      const id = `${definition.classId}::${name}`;
      // Build arrow function so the methods are not possible to call with new expression
      const method = (that: unknown, param: unknown) => {
         const diagnostics = new Diagnostics();
         const executionContext = new ExecutionContext(
            definition as ClassDefinition,
            id + ' setter',
            Kernel['Array::constructor'](param),
            diagnostics,
            that as object,
         );
         // Check if the object has native bound
         if (!definition.context.nativeHandles.has(that as object))
            diagnostics.report(ERRORS.BoundToPrototype('setter', id));
         // Validate correctness of this type
         definition.type.validate(diagnostics, that);
         // Validate params
         paramType.validate(diagnostics, param);

         // Check for diagnostics and report first value
         if (!diagnostics.success) {
            definition.__reports(executionContext);
            diagnostics.throw(1);
         }

         definition.__call(executionContext);

         returnType.validate(diagnostics, executionContext.result);

         // Checks 2
         if (!diagnostics.success) {
            // TODO: What design of our plugin system we want right?
            // definition.__reports(executionContext);
            diagnostics.throw(1);
         }
         // TODO: Implement privileges and type checking
         //if(currentPrivilege && currentPrivilege !== functionType.privilege) throw new ErrorConstructors.NoPrivilege(ErrorMessages.NoPrivilege("function", id));
         //let error = functionType.ValidArgumentTypes(params);
         //if(error) throw new error.ctor(error.message);

         return executionContext.result;
      };

      // Mark function as native
      Kernel.SetFakeNative(method);

      // Set virtual number of params to 0
      Kernel.SetLength(method, 0);

      // Assign name to this function
      Kernel.SetName(method, name);

      // Handle with proxy for support with "this" callback
      const final = new Kernel['globalThis::Proxy'](method, {
         apply(t, that, params) {
            return t(that, params[0]);
         },
      });

      // Set the proxy also as native
      Kernel.SetFakeNative(final);

      // Return
      return final;
   }

   /**@param {APIClassDefinition} definition @param {FunctionValidator} functionType  */ /*
    static CreateSetter(definition, id, functionType){
        const ctor = (that, params)=>{
            if(!nativeObjects.has(that)) throw new ErrorConstructors.BoundToPrototype(ErrorMessages.BoundToPrototype("property setter",id));
            let error = functionType.ValidArgumentTypes(params);
            if(error) throw new error.ctor(error.message);
            const cache = definition.cache.get(that);
            if(!cache) return undefined;
            const returnKind = definition.__methodCall(cache, that, id, ...params);            
            error = functionType.ResolveReturnType(returnKind);
            if(error) throw new error.ctor(error.message);
            return returnKind;
        };
        Kernel.SetFakeNative(ctor);
        Kernel.SetLength(ctor, 0);
        Kernel.SetName(ctor, "");

        const final = new Proxy(ctor, {apply(t,that,params){return t(that,params)}});
        Kernel.SetFakeNative(final);
        return final;
    }*/
}
