import { ConflictError } from "../errors/conflict-error";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { User, UserRole } from "../models/user";
import { UsersRepository } from "../repositories/users-repository";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt";

interface CreateUserData {
   name: string,
   email: string,
   password: string
}

interface Credentials {
   email: string,
   password: string
} 

type UserWithoutPassword = Omit<User, "password">;

export class UsersService {

   private repository: UsersRepository;

   constructor() {
      this.repository = new UsersRepository();
   }

   async create({name, email, password}: CreateUserData, role: UserRole = "user"): Promise<UserWithoutPassword> {
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

   async update(id: string, userData: Partial<User>): Promise<UserWithoutPassword> {

      const user = await this.repository.findById(id);
      if (!user) throw new NotFoundError("User not found.");

      if (userData.email && userData.email !== user.email) {
         const userWithSameEmail = await this.repository.findByEmail(userData.email);
         if (userWithSameEmail) throw new ConflictError("E-mail already in use.");
      } 

      if (userData.password) {
         userData.password = hashPassword(userData.password)
      }

      const updated = await this.repository.update(id, userData);
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