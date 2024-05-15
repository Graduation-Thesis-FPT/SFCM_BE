import { User } from '../entity/user.entity';
const jwt = require('jsonwebtoken');

const createNewAccessToken = (userInfo: Partial<User>) => {
  const { ROWGUID, USER_NAME } = userInfo;
  return jwt.sign(
    {
      ROWGUID,
      USER_NAME,
    },
    process.env.ACCESS_TOKEN_SIGN_SECRET,
    {
      expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
    },
  );
};

const createRefreshToken = (userInfo: Partial<User>) => {
  const { ROWGUID, USER_NAME } = userInfo;
  return jwt.sign(
    {
      ROWGUID,
      USER_NAME,
    },
    process.env.REFRESH_TOKEN_SIGN_SECRET,
    {
      expiresIn: process.env.EXPIRES_REFRESH_TOKEN,
    },
  );
};

export { createNewAccessToken, createRefreshToken };
