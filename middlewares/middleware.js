import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config()

const secret = process.env.JWT_SECRET; // reemplaza esto con tu clave secreta real

// Middleware de autenticación
export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader == null) {
    return res.sendStatus(401);
  }

  jwt.verify(authHeader, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next(); 
  });
};