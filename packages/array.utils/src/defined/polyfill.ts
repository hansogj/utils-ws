/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from './defined';
import { definedList } from './definedList';

declare global {
    interface Array<T> {
        defined(): Array<T>;
        allDefined(): Array<T>;
        first(): Array<T>;
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
