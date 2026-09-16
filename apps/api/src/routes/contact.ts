import { Router } from "express";
import { z } from "zod";
import { withDatabase } from "../db.js";

export const contactRouter = Router();

const contactInput = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().toLowerCase(),
  subject: z.string().trim().max(120).optional().default("General enquiry"),
  message: z.string().trim().min(10, "Tell us a little more.").max(3000),
});

contactRouter.post("/", async (request, response) => {
  const input = contactInput.parse(request.body);
  const now = new Date();
  await withDatabase(async (database) => {
    await database.collection("messages").insertOne({
      ...input,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  });
  response.status(201).json({ data: { message: "Thanks — your note is safely with us." } });
});
