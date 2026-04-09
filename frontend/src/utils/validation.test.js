import {
  isValidEmail,
  validateLoginForm,
  hasValidationErrors,
} from "./validation";

describe("isValidEmail", () => {
  it("menerima email valid", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("user.name@domain.com")).toBe(true);
  });

  it("menolak email tidak valid", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("plain")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
  });
});

describe("validateLoginForm", () => {
  it("wajib identifier dan password", () => {
    const e = validateLoginForm("", "");
    expect(e.identifier).toBeDefined();
    expect(e.password).toBeDefined();
    expect(hasValidationErrors(e)).toBe(true);
  });

  it("validasi format email jika mengandung @", () => {
    const e = validateLoginForm("bukan-email@", "secret");
    expect(e.identifier).toContain("email");
  });

  it("username tanpa @ tidak memicu error format email", () => {
    const e = validateLoginForm("demouser", "secret");
    expect(e.identifier).toBeUndefined();
    expect(e.password).toBeUndefined();
  });
});
