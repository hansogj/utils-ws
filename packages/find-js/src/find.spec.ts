/**
 * @jest-environment jsdom
 */


import find from './find';

const template = `
  <ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  </ul>
  `;

describe("find-js", () => {

    afterAll(() => jest.clearAllMocks());

    beforeEach(() => document.body.innerHTML = template);
    it("should find list items in dom", () => expect(find("li")).toHaveLength(4));
    it("should not find find canvas elems in dom", () => expect(find("canvas")).toHaveLength(0));
    it("should be able to iterate found elements", () => expect(find("li").map(e => e.innerHTML)).toEqual(["1", "2", "3", "4"]));

})

