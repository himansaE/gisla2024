import { PrismaAdapter } from "@auth/prisma-adapter";
import { hashSync, compareSync, genSaltSync } from "bcrypt";

import prisma from "../prisma";
import { randomUUID } from "crypto";

export function generateHashedPassword(password: string) {
  const saltRounds = 14;
  const salt = genSaltSync(saltRounds);
  const hashedPassword = hashSync(
    `${password}${process.env.PASS_SEC_TOKEN}`,
    salt
  );
  return hashedPassword;
}

export function validatePassword(
  inputPassword: string,
  hashedPassword: string
) {
  const isMatch = compareSync(
    `${inputPassword}${process.env.PASS_SEC_TOKEN}`,
    hashedPassword
  );
  return isMatch;
}

export const prisma_auth_adapter = PrismaAdapter(prisma);

export function generateSessionToken(): string {
  return randomUUID().replace(/[018]/g, (c) => {
    const randomByte = crypto.getRandomValues(new Uint8Array(1))[0];
    return `${(Number(c) ^ (randomByte & (15 >> (Number(c) / 4)))).toString(
      16
    )}-${Date.now().toString().slice(3)}`;
  });
}
export const fromDate = (time: number, date = Date.now()) => {
  return new Date(date + time * 1000);
};
