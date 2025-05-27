import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from "../errors/unauthorized-error";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
   const authHeader = req.headers.authorization;
   if (!authHeader) throw new UnauthorizedError("No token provided.");

   const token = authHeader.split(" ")[1];
   const secret = process.env.JWT_SECRET || "";

   try {
      const payload = jwt.verify(token, secret) as JwtPayload;
      req.user = {
         id: payload.id,
         role: payload.role
      };
      next();
   } catch (err) {
      throw new UnauthorizedError("Invalid token.");
   }
}

export async function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
   if (req.user && req.user.role !== "admin") {
         throw new UnauthorizedError("Admins only.");
   }
   next();
}