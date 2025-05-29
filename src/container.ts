import { UsersRepository } from "./repositories/users-repository-prisma";
import { UsersService } from "./services/users-service";

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);

export { usersService };