export default <T = HTMLElement>(
  selector: string,
  root: Document | HTMLElement = window.document
): Array<T> => Array.from(root.querySelectorAll(selector) as unknown as T[]);
