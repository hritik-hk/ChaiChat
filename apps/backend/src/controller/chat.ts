import { Response } from "express";
import { IRequest } from "../interfaces/common.js";
import { PrismaClient } from "@prisma/client";
import { emitSocketEvent } from "../index.js";

const prisma = new PrismaClient();

export const getOrCreatePrivateChat = async (req: IRequest, res: Response) => {
  const { recipientId } = req.params;

  try {
    // Check if it's a valid receiver
    const receiver = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!receiver) {
      throw new Error("user does not exist");
    }

    if (!req.user) {
      throw new Error("your not authorized");
    }

    // check if receiver is not the user who is requesting a chat
    if (receiver.id === req.user.id) {
      throw new Error("You cannot chat with yourself");
    }

    const newChat = await prisma.chat.create({
      data: {
        admin: req.user.id,
        isGroupChat: false,
        name: "privateChat",
        participants: [req.user.id, recipientId as string],
      },
    });

    // logic to emit socket event about the new chat added to the participants
    newChat?.participants?.forEach((participant) => {
      if (participant === req.user?.id) return; // don't emit the event for the logged in use as he is the one who is initiating the chat

      // emit event to other participants with new chat as a payload
      emitSocketEvent(
        participant,
        "private-chat",
        newChat.id
        // `${req.user?.username} started chat with you`
      );
    });

    return res
      .status(201)
      .json({ msg: "chat created successfully", chat: newChat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
