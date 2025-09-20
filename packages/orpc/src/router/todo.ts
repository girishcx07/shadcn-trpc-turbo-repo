import { ORPCError, os } from "@orpc/server";
import z from "zod";
import { TodoSchema } from "../schemas/todo";
import { authed } from "../middlewares/auth";

// export const createTodo = authed
//   .input(
//     z.object({
//       title: z.string(),
//       description: z.string(),
//     })
//   )
//   .output(TodoSchema)
//   .handler(async ({ context, input }) => {
//     const todo = await prisma.todo.create({
//       data: {
//         title: input.title,
//         description: input.description,
//       },
//     });

//     return todo;
//   });

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const createTodo = authed
  .input(
    z.object({
      title: z.string(),
      // body: z.boolean().default(false),
      body: z.string(),
      userId: z.number().default(1),
    })
  )
  .output(TodoSchema)
  .errors({
    BAD_RESPONSE: {
      message: "Failed to create todo",
      status: 502,
    },
  })
  .handler(async ({ input, errors, context }) => {
    console.log("input >>", input)

    context.cookies.set("input", input.title)
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(input),
        }
      );

      console.log("response >>", response);

      if (!response.ok) {
        throw errors.BAD_RESPONSE();
      }


      const data = await response.json();
      return TodoSchema.parse(data);
    } catch (err) {
      console.log("response >>", err);

      throw errors.BAD_RESPONSE();
    }
  });

// export const getTodos = authed
//   .input(
//     z.object({
//       amount: z.number(),
//     })
//   )
//   .output(z.array(TodoSchema))
//   .errors({
//     FORBIDDEN: {
//       message: "You are not authorized to do this",
//       status: 403,
//     },
//   })

//   .handler(async ({ context, input, errors }) => {
//     if (input.amount > 10) {
//       throw errors.FORBIDDEN();
//     }

//     const todos = await prisma.todo.findMany();

//     return todos;
//   });

export const getTodos = authed
  .input(
    z.object({
      amount: z.number().min(1).max(200),
    })
  )
  // .output(z.array(TodoSchema))
  .errors({
    FORBIDDEN: {
      message: "You are not authorized to do this",
      status: 403,
    },
    BAD_RESPONSE: {
      message: "Failed to fetch todos",
      status: 502,
    },
  })
  .handler(async ({ input, errors }) => {
    if (input.amount > 10) {
      throw errors.FORBIDDEN();
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (!response.ok) {
        throw errors.BAD_RESPONSE();
      }

      const data = await response.json() as Post[];

      // Validate all todos with Zod
      const todos = z.array(TodoSchema).parse(data);
      // todos.
      return data.slice(0, input.amount)
      // return todos.slice(0, input.amount);
    } catch (err) {
      throw errors.BAD_RESPONSE();
    }
  });
