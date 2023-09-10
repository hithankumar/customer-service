import { Prisma } from "@prisma/client";
import { access } from "fs";


export const customers: Prisma.CustomerUpsertArgs['create'][] = [
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd3',
    email: 'user@gmail.com',
    password: 'random-password2',
    userRole: 'USER',
    refreshToken: "random-refresh-token",
    accessToken: "random-access-token",
    isVerified: true,
    activationCode: "random-activation-code"
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd4',
    email: 'user2@gmail.com',
    password: 'random-password1',
    userRole: 'USER',
    refreshToken: "random-refresh-token2",
    accessToken: "random-access-token2",
    isVerified: true,
    activationCode: "random-activation-code2"
  },
];
