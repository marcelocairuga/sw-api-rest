import { NotFoundError } from "../errors/not-found-error";
import { User } from "../models/user";
import { IUsersRepository } from "./users-repository-interface";
import { hashPassword } from "../utils/jwt";

export class UsersRepository implements IUsersRepository {

   // REPOSITÖRIO EM MEMÓRIA SIMPLES PARA FINS DE TESTES
   // APENAS PARA USO EM DESENVOLVIMENTO, JAMAIS EM PRODUÇÃO
   // POR ISSO PODEMOS EXPOR A SENHA!
   private static users: User[] = [{
      id: crypto.randomUUID(),
      name: "Elesbão",
      email: "elesbao@email.com",
      password: hashPassword("123456"),
      role: "admin",
   }];

   async create(userData: Omit<User, 'id'>): Promise<User> {
      const newUser: User = {
         id: crypto.randomUUID(),
         ...userData,
      };
      UsersRepository.users.push(newUser);
      return newUser;
   }

   async findAll(): Promise<User[]> {
      return UsersRepository.users;
   }

   async findById(id: string): Promise<User|null> {
      return UsersRepository.users.find(user => user.id === id) ?? null;
   }

   async findByEmail(email: string): Promise<User|null> {
      return UsersRepository.users.find(user => user.email === email) ?? null;
   }

	async update(id: string, updatedData: Partial<User>): Promise<User> {
	  const user = await this.findById(id);
	  if (!user) throw new NotFoundError("User not found."); 
	  Object.assign(user, updatedData);
	  return user;
	}

   async delete(id: string): Promise<User> {
      const index = UsersRepository.users.findIndex(user => user.id === id);
      if (index === -1) throw new NotFoundError("User not found."); 
   
      const [deletedUser] = UsersRepository.users.splice(index, 1);
      return deletedUser;
   }
}