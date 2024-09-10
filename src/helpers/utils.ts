import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs'
import path from 'path'

export const prisma = new PrismaClient();
export const publicDir = path.join(__dirname, '../../', 'public');

export const UtilsPassword = {
  genSalt: (saltRounds: number, value: string) => {
    return new Promise((resolve, reject) => {
      const salt = bcrypt.genSaltSync(saltRounds);
      bcrypt.hash(value, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  },
  compareHash: (hash:string , value: string) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(value, hash, (err, result): boolean | any => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
};