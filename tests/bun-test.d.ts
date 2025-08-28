declare module "bun:test" {
  export function describe(name: string, fn: () => void | Promise<void>): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function expect(actual: any): any;
}
