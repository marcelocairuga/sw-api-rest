import { NotFoundError } from "../errors/not-found-error";
import { User } from "../models/user";

export class UsersRepository {
   private static users: User[] = [{
      id: "27afa719-ccad-4308-b9d4-f8f49e669f21",
      name: "Elesbão",
      email: "elesbao@email.com",
      password: "$2b$10$rInHVPTdFk7MBtaQrradiO3B0BmQJK4PSt.V5cMn7hhRU8J5CtsPG",
      role: "admin"
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

   async findById(id: string): Promise<User|undefined> {
      return UsersRepository.users.find(user => user.id === id);
   }

   async findByEmail(email: string): Promise<User|undefined> {
      return UsersRepository.users.find(user => user.email === email);
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