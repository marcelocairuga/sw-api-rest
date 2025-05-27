import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';

export class UsersController {

   private service: UsersService;

   constructor() {
      this.service = new UsersService();
   }

   async getAll(req: Request, res: Response): Promise<Response> {
      const users = await this.service.getAll();
      return res.json({ users });
   }

   async getById(req: Request, res: Response): Promise<Response> {
      const id = req.params.id;
      //falta validação
      const user = await this.service.getById(id);
      return res.json({ user });
   }

   async create(req: Request, res: Response): Promise<Response> {
      const { name, email, password, role } = req.body;
      // falta validação
      const created = await this.service.create({name, email, password}, role);
      return res.status(201).json({ created });
   }

   async update(req: Request, res: Response): Promise<Response> {
      const { name, email } = req.body;
      const id = req.params.id;
      // falta validação
      const updated = await this.service.update(id, {name, email});
      return res.json({ updated });
    }

    async delete(req: Request, res: Response): Promise<Response> {
      const id = req.params.id;
      // falta validação
      const deleted = await this.service.delete(id);
      return res.status(201).json({ deleted });
   }
}