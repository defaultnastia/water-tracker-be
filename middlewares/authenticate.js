import HttpError from "../helpers/HttpError.js";

import { verifyToken } from "../helpers/jwt.js";

import { findUser } from "../services/authServices.js";

const authenticate = async (req, _, next) => {
  const { authorization } = req.headers;

  console.log(authorization);

  if (!authorization) return next(HttpError(401, "Not authorized"));

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") return next(HttpError(401, "Bearer not found"));

  const { data, error } = verifyToken(token);

  if (error) return next(HttpError(401, error.message));

  const { id } = data;
  const user = await findUser({ _id: id });

  console.log(user);

  if (!user) return next(HttpError(401, "Not authorized"));

  if (!user.userToken) return next(HttpError(401, "Not authorized"));

  req.user = user;

  next();
};

export default authenticate;
