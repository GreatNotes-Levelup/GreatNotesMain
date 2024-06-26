import { verify } from "../services/jwt.js";

const authMiddleware = async (req, res, next) => {
  if (req.headers.authorization == null) {
    res.status(400).json("Token not supplied");
    return;
  }
  let auth_header = req.headers.authorization;
  if (!auth_header.startsWith("Bearer ")) {
    res.status(400).json("Invalid Bearer Token");
    return;
  }
  let token = auth_header.split(" ")[1];
  const verifyResponse = await verify(token);

  if (!verifyResponse) {
    res.status(401).json("Invalid Token");
    return;
  }
  res.locals.user = verifyResponse;
  next();
}

export default authMiddleware;