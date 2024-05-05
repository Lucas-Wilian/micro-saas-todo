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
    select: {
      id: true,
      stripeSubscriptionId: true,
      stripeSubscriptionStatus: true,
      _count: {
        select: {
          todos: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(403).send({
      error: "Not Authorized",
    });
  }

  const hasQuotaAvailable = user._count.todos <= 5;
  const hasActiveSubscription = !!user.stripeSubscriptionId;

  if (
    !hasQuotaAvailable &&
    !hasActiveSubscription &&
    user.stripeSubscriptionStatus !== "active"
  ) {
    return res.status(403).send({
      error: "Not quota available. Please upgrade your plan.",
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
