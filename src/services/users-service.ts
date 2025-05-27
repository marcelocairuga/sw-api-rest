import { ConflictError } from "../errors/conflict-error";
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

export class UsersService {

   private repository: UsersRepository;

   constructor() {
      this.repository = new UsersRepository();
   }

   async create({name, email, password}: CreateUserData, role: UserRole = "user"): Promise<Partial<User>> {
      const userWithSameEmail = await this.repository.findByEmail(email);
      if (userWithSameEmail) throw new ConflictError("E-mail already in use.");
      const user = await this.repository.create({
         name, 
         email, 
         password: hashPassword(password), 
         role
      })

      return {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role
      }
   }

   async autenticate(credentials: Credentials): Promise<string> {
      const user = await this.repository.findByEmail(credentials.email);
      if (!user || !comparePassword(credentials.password, user.password)) 
         throw new UnauthorizedError("Invalid credentials.")
      return generateToken(user);
   }
}