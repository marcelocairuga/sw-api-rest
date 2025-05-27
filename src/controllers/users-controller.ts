import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';
import { createUserSchema, updateUserSchema } from '../schemas/users-schema';
import { BadRequestError } from '../errors/bad-request-error';

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
      const user = await this.service.getById(id);
      return res.json({ user });
   }

   async create(req: Request, res: Response): Promise<Response> {
      const parsedBody = createUserSchema.safeParse(req.body);
      if (!parsedBody.success) {
         return res.status(400).json(parsedBody.error.flatten().fieldErrors);
      }
      const created = await this.service.create(parsedBody.data);
      return res.status(201).json({ created });
   }

   async update(req: Request, res: Response): Promise<Response> {
      const id = req.params.id;
      const parsedBody = updateUserSchema.safeParse(req.body);
      if (!parsedBody.success) {
         return res.status(400).json(parsedBody.error.flatten().fieldErrors);
      }
      const updated = await this.service.update(id, parsedBody.data);
      return res.json({ updated });
    }

    async delete(req: Request, res: Response): Promise<Response> {
      const id = req.params.id;
      const deleted = await this.service.delete(id);
      return res.status(200).json({ deleted });
   }
}