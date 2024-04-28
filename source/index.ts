import express from "express";
import {
  findOneUserController,
  listUserController,
} from "./controllers/user.controller";

const app = express();

const port = 3000;

app.get("/users", listUserController);
app.get("/users/:userId", findOneUserController);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
