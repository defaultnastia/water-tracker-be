import jwt from "jsonwebtoken";

export const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "168h" });

export const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return { data: payload };
  } catch (error) {
    return { error };
  }
};
