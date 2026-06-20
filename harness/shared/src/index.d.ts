type equal = (val: any) => void;

export declare const html: (template: string) => DocumentFragment;
export declare const suite: (prop: string) => any;
export declare const dependencies: () => void;
export declare const versions: Record<string, string>;
export declare const verify: (
  title: string,
  cb: () => void
) => {
  toEqual: equal;
  toDiffer: equal;
};

type TestBody = (() => void) | (() => Promise<void>) | undefined;
type TestFn = (name: string, fn?: TestBody, timeout?: number) => void;

export interface ShouldItChain {
  then(suite?: TestBody, timeout?: number): ShouldItChain;
  dont(suite?: TestBody, timeout?: number): ShouldItChain;
}

export declare const might: (should: boolean) => string;
export declare const createShouldIt: (
  testFn: TestFn
) => (description: string, condition: boolean, toBe?: unknown) => ShouldItChain;
export declare const shouldIt: (
  description: string,
  condition: boolean,
  toBe?: unknown
) => ShouldItChain;
