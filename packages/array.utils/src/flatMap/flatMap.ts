/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/no-unused-vars
interface Array<T> {
    flatMap<U, This = undefined>(
        callback: (this: This, value: T, index: number, array: T[]) => U | ReadonlyArray<U>,
        thisArg?: This,
    ): U[];
}

Array.prototype.flatMap =
    Array.prototype.flatMap ||
    function (lambda) {
        return Array.prototype.concat.apply(
            [],
            // @ts-ignore
            this.map(lambda),
        );
    };
