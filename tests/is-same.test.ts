import { describe, expect, it } from "vite-plus/test";
import { isSamePath } from "../src";

describe("isSamePath", () => {
  const samePaths = [
    ["/foo", "/foo"],
    ["/foo", "/foo/"],
    ["/", ""],
    ["/%D1%82%D0%B5%D1%81%D1%82", "/тест"],
  ];

  const notSamePaths = [["/foo", "/bar"]];

  it.each(samePaths)("%s == %s", (u1 = "", u2 = "") => {
    expect(isSamePath(u1, u2)).toBe(true);
  });

  it.each(notSamePaths)("%s != %s", (u1 = "", u2 = "") => {
    expect(isSamePath(u1, u2)).toBe(false);
  });
});
