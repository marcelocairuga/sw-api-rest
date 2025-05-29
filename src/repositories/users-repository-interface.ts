import { User } from "../models/user";

export interface IUsersRepository {
   findAll: () => Promise<User[]>,
   findById: (id: string) => Promise<User|null>,
   findByEmail: (email: string) => Promise<User|null>,
   create: (userData: Omit<User, 'id'>) => Promise<User>,
   update: (id: string, updatedData: Partial<User>) => Promise<User>
   delete: (id: string) => Promise<User>
}