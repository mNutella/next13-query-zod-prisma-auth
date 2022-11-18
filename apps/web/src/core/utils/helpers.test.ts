/**
 * @jest-environment node
 */

import { hashPassword, parsePasswordSalt, verifyPassword } from "./helpers";

const defaultPassword = "admin";
const defaultSalt =
  "6bc7a4338e806da6425b20ab610d07b36321c766dcfb938e86031db38ca6b5da7e9b369ac97caae176b352e114c53f341aac6442773f9082c21dc4e3a8a0e2678356c134d9e4064b9ade52c05b0d92997ed43437663c85872a19f4cff566775af26400cafcda092e9ca337234870b9ed9a499bd1ae667be7d4051596e442363c";
const defaultHashedPassword =
  "6bc7a4338e806da6425b20ab610d07b36321c766dcfb938e86031db38ca6b5da7e9b369ac97caae176b352e114c53f341aac6442773f9082c21dc4e3a8a0e267d8868c6cd226e51ea930f48f5f506bd5aa25aed405876dbae681d92d3d2dd0bee59a542c2f05df1c4db617431962b276b7e6ba1e284ad5d29dfba0c84eb3757b8356c134d9e4064b9ade52c05b0d92997ed43437663c85872a19f4cff566775af26400cafcda092e9ca337234870b9ed9a499bd1ae667be7d4051596e442363c";

describe("hashPassword", () => {
  it("should fails if a password is empty", () => {
    try {
      hashPassword("");
    } catch (error: any) {
      expect(error.message).toEqual("Invariant failed: The password is empty");
    }
  });

  it("should fails if a salt length is odd", () => {
    try {
      hashPassword("password", Buffer.from("123", "hex"));
    } catch (error: any) {
      expect(error.message).toEqual(
        "Invariant failed: The salt length can't be odd"
      );
    }
  });

  it("should successfully generate a hash without a salt", () => {
    expect(hashPassword(defaultPassword)).toBeTruthy();
  });

  it("should successfully generate a hash with even salt length", () => {
    expect(
      hashPassword(defaultPassword, Buffer.from("1234", "hex"))
    ).toBeTruthy();
  });

  it("should successfully generate a hash for 'admin' password", () => {
    expect(
      hashPassword(defaultPassword, Buffer.from(defaultSalt, "hex"))
    ).toEqual(defaultHashedPassword);
  });
});

describe("parsePasswordSalt", () => {
  it("should fails if a password is empty", () => {
    try {
      parsePasswordSalt("");
    } catch (error: any) {
      expect(error.message).toEqual(
        "Invariant failed: The password is empty, the salt can't be parsed"
      );
    }
  });

  it("should fails if a salt length is odd", () => {
    try {
      parsePasswordSalt("6bc12a45a", 5);
    } catch (error: any) {
      expect(error.message).toEqual(
        "Invariant failed: The salt length can't be odd"
      );
    }
  });

  it("should successfully parse a password salt", () => {
    expect(parsePasswordSalt(defaultSalt)).toBeTruthy();
  });

  it("should successfully parse a salt for 'admin' password", () => {
    expect(parsePasswordSalt(defaultHashedPassword).toString("hex")).toEqual(
      defaultSalt
    );
  });
});

describe("parsePasswordSalt", () => {
  it("should fails if a hashed password is empty", () => {
    try {
      verifyPassword("origin_password", "");
    } catch (error: any) {
      expect(error.message).toEqual(
        "Invariant failed: The hashed password is empty"
      );
    }
  });

  it("should fails if a origin password is empty", () => {
    try {
      verifyPassword("", "hashed_password");
    } catch (error: any) {
      expect(error.message).toEqual("Invariant failed: The password is empty");
    }
  });

  it("should be false if a origin password is not equal to hashed password", () => {
    expect(verifyPassword("password", defaultHashedPassword)).toBeFalsy();
  });

  it("should successfully verify the 'admin' password", () => {
    expect(verifyPassword(defaultPassword, defaultHashedPassword)).toBeTruthy();
  });
});
