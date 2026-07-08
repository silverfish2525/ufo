import { describe, expect, it } from "vite-plus/test";
import { withTrailingSlash, withoutTrailingSlash } from "../src";

describe("withTrailingSlash, queryParams: false", () => {
  const tests: Record<string, string> = {
    "": "/",
    bar: "bar/",
    "bar#abc": "bar#abc/",
    "bar/": "bar/",
    "foo/?123": "foo/?123/",
    "foo/?123#abc": "foo/?123#abc/",
    "foo?123": "foo?123/",
  };

  it.each(Object.entries(tests))("%s", (input, expected) => {
    expect(withTrailingSlash(input)).toBe(expected);
  });

  it("falsy value", () => {
    expect(withTrailingSlash()).toBe("/");
  });
});

describe("withTrailingSlash, queryParams: true", () => {
  const tests: Record<string, string> = {
    "": "/",
    "#": "#",
    "#abc": "#abc",
    "/#abc": "/#abc",
    bar: "bar/",
    "bar/": "bar/",
    "foo/?123": "foo/?123",
    "foo?123": "foo/?123",
    "foo?123#abc": "foo/?123#abc",
  };

  it.each(Object.entries(tests))("%s", (input, expected) => {
    expect(withTrailingSlash(input, true)).toBe(expected);
  });

  it("falsy value", () => {
    expect(withTrailingSlash()).toBe("/");
  });
});

describe("withoutTrailingSlash, queryParams: false", () => {
  const tests: Record<string, string> = {
    "": "/",
    "/": "/",
    bar: "bar",
    "bar#abc": "bar#abc",
    "bar/#abc": "bar/#abc",
    "foo/?123": "foo/?123",
    "foo/?123#abc": "foo/?123#abc",
    "foo/?k=/": "foo/?k=",
    "foo/?k=v": "foo/?k=v",
    "foo?123": "foo?123",
  };

  it.each(Object.entries(tests))("%s", (input, expected) => {
    expect(withoutTrailingSlash(input)).toBe(expected);
  });

  it("falsy value", () => {
    expect(withoutTrailingSlash()).toBe("/");
  });
});

describe("withoutTrailingSlash, queryParams: true", () => {
  const tests: Record<string, string> = {
    "": "/",
    "/": "/",
    "/#abc": "/#abc",
    "/a/#abc": "/a#abc",
    bar: "bar",
    "bar#abc": "bar#abc",
    "bar/": "bar",
    "bar/#abc": "bar#abc",
    "foo/?123": "foo?123",
    "foo/?123#abc": "foo?123#abc",
    "foo/?k=/": "foo?k=/",
    "foo/?k=/&x=y#abc": "foo?k=/&x=y#abc",
    "foo/?k=123": "foo?k=123",
    "foo?123": "foo?123",
    "foo?k=/": "foo?k=/",
  };

  it.each(Object.entries(tests))("%s", (input, expected) => {
    expect(withoutTrailingSlash(input, true)).toBe(expected);
  });

  it("falsy value", () => {
    expect(withoutTrailingSlash()).toBe("/");
  });
});
