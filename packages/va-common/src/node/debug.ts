import chalk from 'chalk';

let debugFn = console.log.bind(console, chalk.bold.yellow('[VIRTUAL-APIS DEBUG]'));

export const d = (...args: unknown[]) => debugFn(...args);

export const dwarn = (...args: unknown[]) => debugFn(...args.map(e => chalk.yellow(e)));

export function setDebugFunction(fn = debugFn) {
   debugFn = fn;
}
