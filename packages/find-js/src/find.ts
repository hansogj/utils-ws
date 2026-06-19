/**
 * Run `root.querySelectorAll(selector)` and return the result as a real
 * `Array<T>`, so you can chain `.map`/`.filter`/etc. directly.
 *
 * Defaults the root to the current `window.document`.
 *
 * @example
 *   find<HTMLAnchorElement>('nav a').map((a) => a.href);
 *   find('.row', tableEl).forEach(highlight);
 */
export default <T = HTMLElement>(selector: string, root: Document | HTMLElement = window.document): Array<T> =>
    Array.from(root.querySelectorAll(selector) as unknown as T[]);
