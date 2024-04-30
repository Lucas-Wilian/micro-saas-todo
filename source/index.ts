import express from "express";
import {
  createUserController,
  findOneUserController,
  listUserController,
} from "./controllers/user.controller";

const app = express();
app.use(express.json());
const port = 3000;

app.get("/users", listUserController);
app.post("/users", createUserController);
app.get("/users/:userId", findOneUserController);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
