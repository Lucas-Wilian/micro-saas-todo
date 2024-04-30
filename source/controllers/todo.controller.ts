import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createTodoController = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(403).send({
      error: "Not Authorized",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
  });

  if (!user) {
    return res.status(403).send({
      error: "Not Authorized",
    });
  }

  const { title } = req.body;
  const todo = await prisma.todo.create({
    data: {
      title,
      ownerId: user.id,
    },
  });
  return res.status(201).send(todo);
};
