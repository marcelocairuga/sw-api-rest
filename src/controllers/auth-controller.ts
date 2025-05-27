import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';

export class AuthController {

   private service: UsersService;

   constructor() {
      this.service = new UsersService();
   }

   register(req: Request, res: Response): Response {
      const { name, email, password } = req.body;
      // falta validação
      const user = this.service.create({name, email, password});
      return res.status(201).json({ user });
   }

   login(req: Request, res: Response): Response {
      const { email, password } = req.body;
      // falta validação
      const token = this.service.autenticate({email, password});
      return res.json({ token });
    }
}