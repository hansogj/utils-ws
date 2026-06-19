/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from './defined';
import { definedList } from './definedList';

declare global {
    interface Array<T> {
        /** Returns a new array with only the `defined` items. See `defined()`. */
        defined(): Array<T>;
        /** Returns `this` if every item is defined; otherwise an empty array. */
        allDefined(): Array<T>;
        /** Returns a single-element array containing the first item. */
        first(): Array<T>;
        /** Returns a single-element array containing the last item. */
        last(): Array<T>;
    }
}

Array.prototype.defined = defined(Array.prototype.defined)
    ? Array.prototype.defined
    : function (this: any[]) {
          return definedList(this);
      };

Array.prototype.allDefined = defined(Array.prototype.allDefined)
    ? Array.prototype.allDefined
    : function (this: any[]) {
          return this.every((prop: any) => defined(prop)) ? this : [];
      };

Array.prototype.first = defined(Array.prototype.first)
    ? Array.prototype.first
    : function (this: any[]) {
          return this.filter((_, i) => i === 0);
      };

Array.prototype.last = defined(Array.prototype.last)
    ? Array.prototype.last
    : function (this: any[]) {
          return this.filter((_, i) => i === this.length - 1);
      };

export {};
