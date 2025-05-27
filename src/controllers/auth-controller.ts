import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';

export class AuthController {

   private service: UsersService;

   constructor() {
      this.service = new UsersService();
   }

   async register(req: Request, res: Response): Promise<Response> {
      const { name, email, password } = req.body;
      // falta validação
      const user = await this.service.create({name, email, password});
      return res.status(201).json({ user });
   }

   async login(req: Request, res: Response): Promise<Response> {
      const { email, password } = req.body;
      // falta validação
      const token = await this.service.autenticate({email, password});
      return res.json({ token });
    }
}