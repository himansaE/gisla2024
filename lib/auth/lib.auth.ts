import { PrismaAdapter } from "@auth/prisma-adapter";
import { hashSync, compareSync, genSaltSync } from "bcrypt";

import prisma from "../prisma";

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
