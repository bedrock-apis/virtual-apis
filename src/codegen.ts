import { parse } from 'acorn';
import { generate } from 'astring';

// Sample JavaScript code with modern ES syntax
const code = `
  const a = 1;
  const add = (x, y) => x + y;
  class MyClass {
    constructor(name) {
      this.name = name;
    }
    greet() {
      return \`Hello, \${this.name}\`;
    }
  }
`;

// Parse the code into an AST
const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });

// Generate code from the AST
const generatedCode = generate(ast);

// Print the generated code
console.log(generatedCode);
