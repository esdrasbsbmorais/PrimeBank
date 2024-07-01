import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "paodepadaria";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Token não fornecido!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Token inválido!" });
    }
    req.user = user;
    next();
  });
};
