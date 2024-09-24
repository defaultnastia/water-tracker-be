import jwt from "jsonwebtoken";

export const createToken = (payload, expires, isRefresh) => {
  if (isRefresh) {
    return jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
      expiresIn: `${expires}h`,
    });
  } else {
    return jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
      expiresIn: `${expires}h`,
    });
  }
};

export const verifyToken = (token, isRefresh) => {
  try {
    let payload = null;

    if (isRefresh) {
      payload = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    } else {
      payload = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
    }

    return { data: payload };
  } catch (error) {
    return { error };
  }
};
