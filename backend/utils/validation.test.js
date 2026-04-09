const {
  isValidEmail,
  validateLoginIdentifier,
  validatePassword,
} = require("./validation");

describe("validateLoginIdentifier", () => {
  const orig = process.env.DB_HAS_USERNAME;

  afterEach(() => {
    if (orig === undefined) delete process.env.DB_HAS_USERNAME;
    else process.env.DB_HAS_USERNAME = orig;
  });

  it("menolak kosong", () => {
    delete process.env.DB_HAS_USERNAME;
    expect(validateLoginIdentifier("")).toBeTruthy();
    expect(validateLoginIdentifier("   ")).toBeTruthy();
  });

  it("mode email saja (default): wajib format email", () => {
    delete process.env.DB_HAS_USERNAME;
    expect(validateLoginIdentifier("demouser")).toContain("email");
    expect(validateLoginIdentifier("ok@test.com")).toBeNull();
  });

  it("validasi email jika mengandung @ (mode username aktif)", () => {
    process.env.DB_HAS_USERNAME = "true";
    expect(validateLoginIdentifier("a@b")).toContain("email");
    expect(validateLoginIdentifier("ok@test.com")).toBeNull();
  });

  it("username tanpa @ lolos jika DB_HAS_USERNAME=true", () => {
    process.env.DB_HAS_USERNAME = "true";
    expect(validateLoginIdentifier("demouser")).toBeNull();
  });
});

describe("validatePassword", () => {
  it("wajib diisi", () => {
    expect(validatePassword("")).toBeTruthy();
  });
});

describe("isValidEmail", () => {
  it("format standar", () => {
    expect(isValidEmail("user@domain.com")).toBe(true);
  });
});
