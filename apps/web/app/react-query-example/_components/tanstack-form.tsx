"use client";

import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client, orpc } from "@workspace/orpc/lib/orpc";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { useRef } from "react";
import { toast } from "sonner";

interface TodoFormValues {
  title: string;
  body: string;
  userId: number;
}

export function TanstackForm() {
  const queryClient = useQueryClient();

  const abortRef = useRef<AbortController | null>(null);

  // 2. Set up the mutation
  const createTodoMutation = useMutation({
    mutationFn: async (values: {
      title: string;
      body: string;
      userId: number;
    }) => {
      abortRef.current = new AbortController();

      // Call ORPC procedure directly with signal
      // `orpc.todo.createTodo` returns a promise, so just await it
      return await client.todo.createTodo(values, {
        signal: abortRef.current.signal,
      });
    },
    onSuccess: (data) => {
      toast.success("TODO created successfully");
      queryClient.invalidateQueries({
        queryKey: orpc.todo.getTodos.queryKey({ input: { amount: 5 } }),
      });
    },
    onError: (err: any) => {
      if (err.name === "AbortError") {
        toast.error("Mutation cancelled");
      } else {
        toast.error("Mutation failed", err);
      }
    },
  });

  // const createTodoMutation = useMutation(
  //   orpc.todo.createTodo.mutationOptions({

  //     onSuccess: (newTodo) => {
  //       toast.success(`Todo "${newTodo.title}" created successfully!`);

  //       // Invalidate channel queries to refetch the list
  //       queryClient.invalidateQueries({
  //         queryKey: orpc.todo.getTodos.queryKey({ input: { amount: 5 } }),
  //       });
  //     },
  //     onError: () => {
  //       // Generic error fallback
  //       toast.error("Failed to create todo. Please try again.");
  //     },
  //   })
  // );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: TodoFormValues = {
      title: String(formData.get("title") ?? "").trim(),
      body: String(formData.get("body") ?? "").trim(),
      userId: 1,
    };

    console.log("values >>", values);

    if (!values.title && !values.body) return;

    createTodoMutation.mutate(values, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: orpc.todo.getTodos.queryKey({ input: { amount: 5 } }),
        });
      },
    });
  }

  const handleCancel = () => {
    abortRef.current?.abort(); // cancel the in-flight request
    abortRef.current = null;
    createTodoMutation.reset(); // reset mutation state
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Todo</CardTitle>
          <CardDescription>
            Add a title and description, then submit.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="contents">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" name="title" placeholder="Buy milk" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="body"
                name="body"
                rows={4}
                placeholder="2% milk, 1 gallon"
              />
            </div>
          </CardContent>
          <CardFooter>
            {createTodoMutation.isPending && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={createTodoMutation.isPending}
              className="ml-auto"
            >
              {createTodoMutation.isPending ? "Submitting..." : "Add Todo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
