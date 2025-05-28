import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();
import { env } from '../src/config/env';
import { hashPassword } from '../src/utils/jwt';

async function main() {
   // SÓ VAMOS CRIAR O USUÁRIO ADMIN EM MODO DE DESENVOLVIMENTO
   // COMO TRATA-SE DE TESTES, NÃO PRECISAMOS NOS PREOCUPAR COM A SENHA EXPOSTA
   
   if (env.NODE_ENV === "development") {
      await prisma.user.deleteMany(); // Limpa os usuários existentes
      await prisma.user.create({
         data: {
            name: "Elesbão",
            email: "elesbao@email.com",
            password: hashPassword("123456"),
            role: "admin",
         },
      });
   }
}

main()
   .catch(e => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });