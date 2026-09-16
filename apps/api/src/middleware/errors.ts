import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export const notFound: RequestHandler = (_request, response) => {
  response.status(404).json({ error: "That endpoint does not exist." });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: error.issues[0]?.message ?? "Please check the submitted information.",
      issues: error.flatten().fieldErrors,
    });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Something went wrong on our side." });
};
