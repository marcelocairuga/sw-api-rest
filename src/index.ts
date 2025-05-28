import express, { Request, Response } from 'express';
import { errorHandler } from './middlewares/error-handler';
import { authenticate, authorizeAdmin } from './middlewares/auth';
import authRoutes from "./routes/auth-routes";
import usersRoutes from "./routes/users-routes";
import helmet from 'helmet';
import { env } from './config/env';

const app = express();

app.use(helmet())
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
   res.json({message: "Bem-vindo a API Tarefas"});
});

app.use("/auth", authRoutes);

app.use("/users", authenticate, authorizeAdmin, usersRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API rodando em http://localhost:${env.PORT}`);
});