import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';
import { registerUserSchema } from '../schemas/users-schema';

export class AuthController {

   private service: UsersService;

   constructor() {
      this.service = new UsersService();
   }

   async register(req: Request, res: Response): Promise<Response> {
      const parsedBody = registerUserSchema.safeParse(req.body);
      if (!parsedBody.success) {
         return res.status(400).json({error: parsedBody.error.flatten().fieldErrors});
      }
      const user = await this.service.create({...parsedBody.data, role: "user" });
      return res.status(201).json({ user });
   }

   async login(req: Request, res: Response): Promise<Response> {
      const {email, password} = req.body;
      if (!email || !password) {
         return res.status(400).json({error: "E-mail and password are required."});
      }
      const token = await this.service.autenticate({email, password});
      return res.json({ token });
   }
}