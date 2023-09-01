/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from './defined';

export const definedList = <T>(prop: T): T[] => {
    if (!defined(prop) || !defined((prop as T[]).constructor)) {
        return [];
    }

    if ((prop as T[]).constructor !== [].constructor) {
        return [prop as any].filter((p) => defined(p));
    }
    return (prop as T[]).filter((p: T) => defined(p));
};
