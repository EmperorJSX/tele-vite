import { describe, it, expect } from "vitest";
import { parseI18nKey } from "../src/utils/helper";

describe("parseI18nKey", () => {
  it("should parse i18n key correctly", () => {
    expect(parseI18nKey("test[0].key")).toBe("test.0.key");
  });

  it("should parse nested array indices correctly", () => {
    expect(parseI18nKey("test[0].list[1].item")).toBe("test.0.list.1.item");
  });

  it("should handle multiple array indices", () => {
    expect(parseI18nKey("test[0][1][2]")).toBe("test.0.1.2");
  });

  it("should handle keys without array indices", () => {
    expect(parseI18nKey("test.key")).toBe("test.key");
  });

  it("should handle keys with mixed array and object indices", () => {
    expect(parseI18nKey("test[0].key[1].value")).toBe("test.0.key.1.value");
  });

  it("should not convert invalid array access patterns", () => {
    expect(parseI18nKey("test.[0].key")).toBe("test.[0].key");
  });

  it("should handle keys with leading and trailing spaces", () => {
    expect(parseI18nKey(" test[0].key ")).toBe(" test.0.key ");
  });

  it("should handle keys with special characters", () => {
    expect(parseI18nKey("test[0].key-1")).toBe("test.0.key-1");
  });

  it("should handle keys with underscores", () => {
    expect(parseI18nKey("test[0]._key")).toBe("test.0._key");
  });

  it("should handle keys with numbers in names", () => {
    expect(parseI18nKey("test1[0].key2")).toBe("test1.0.key2");
  });
});
