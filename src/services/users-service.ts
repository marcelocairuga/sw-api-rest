import { ConflictError } from "../errors/conflict-error";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { User } from "../models/user";
import { IUsersRepository } from "../repositories/users-repository-interface";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt";
import { createUserSchema, updateUserSchema } from "../schemas/users-schema";
import { z } from "zod";

type createUserData = z.infer<typeof createUserSchema>;
type updateUserData = z.infer<typeof updateUserSchema>;

type Credentials = {
   email: string,
   password: string
} 

type UserWithoutPassword = Omit<User, "password">;

export class UsersService {

   private repository: IUsersRepository;

   constructor(repository: IUsersRepository) {
      this.repository = repository;
   }

   async create(data: createUserData): Promise<UserWithoutPassword> {
      const {name, email, password, role} = data;

      const userWithSameEmail = await this.repository.findByEmail(email);
      if (userWithSameEmail) throw new ConflictError("E-mail already in use.");
      const created = await this.repository.create({
         name, 
         email, 
         password: hashPassword(password), 
         role
      })

      return {
         id: created.id,
         name: created.name,
         email: created.email,
         role: created.role
      }
   }

   async getAll(): Promise<UserWithoutPassword[]> {
      const users = await this.repository.findAll();
      const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
      return usersWithoutPassword;
   }

   async getById(id: string): Promise<UserWithoutPassword|null> {
      const user = await this.repository.findById(id);
      if (!user) throw new NotFoundError("User not found.");

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
   }

   async update(id: string, data: updateUserData): Promise<UserWithoutPassword> {
      const user = await this.repository.findById(id);
      if (!user) throw new NotFoundError("User not found.");

      if (data.email && data.email !== user.email) {
         const userWithSameEmail = await this.repository.findByEmail(data.email);
         if (userWithSameEmail) throw new ConflictError("E-mail already in use.");
      } 

      if (data.password) {
         data.password = hashPassword(data.password)
      }

      const updated = await this.repository.update(id, data);

      const { password, ...userWithoutPassword } = updated;
      return userWithoutPassword;
    }

   async delete(id: string): Promise<UserWithoutPassword> {      
      const deleted = await this.repository.delete(id);  
      const { password, ...userWithoutPassword } = deleted;
      return userWithoutPassword;
   }

   async autenticate(credentials: Credentials): Promise<string> {
      const user = await this.repository.findByEmail(credentials.email);
      if (!user || !comparePassword(credentials.password, user.password)) 
         throw new UnauthorizedError("Invalid credentials.")
      return generateToken(user);
   }
}