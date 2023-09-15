/* eslint-disable @typescript-eslint/no-explicit-any */
export const defined = <T>(prop: T): boolean => {
    if (prop === undefined || prop === null) {
        return false;
    }

    if (typeof prop === 'function') {
        return true;
    }

    if (prop.hasOwnProperty('length')) {
        return (prop as T[]).length > 0;
    }

    if (prop.hasOwnProperty('size')) {
        return (prop as T & { size: number }).size > 0;
    }

    if (typeof prop === 'boolean') {
        return prop;
    }
    return true;
};
