import { PrismaClient, User } from '@prisma/client';
import { IUsersRepository } from './users-repository-interface';

const prisma = new PrismaClient();

export class UsersRepository implements IUsersRepository {

   async create(userData: Omit<User, 'id'>): Promise<User> {
      const newUser = await prisma.user.create({
         data: userData
      });
      return newUser;
   }

   async findAll(): Promise<User[]> {
      return await prisma.user.findMany();
   }

   async findById(id: string): Promise<User|null> {
      return await prisma.user.findUnique({
         where: { id }
      });
   }

   async findByEmail(email: string): Promise<User|null> {
      return await prisma.user.findUnique({
         where: { email }
      });
   }

   async update(id: string, updatedData: Partial<User>): Promise<User> {
      const updatedUser = await prisma.user.update({
         where: { id },
         data: updatedData,
      });
      return updatedUser;
   }

   async delete(id: string): Promise<User> {
      const deletedUser = await prisma.user.delete({
         where: { id },
      });
      return deletedUser;
   }
}