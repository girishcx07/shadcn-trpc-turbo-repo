"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TanstackForm } from "./_components/tanstack-form";
import { orpc } from "@workspace/orpc/lib/orpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center mt-36 w-full">
      <TanstackForm />

      {/* Wrap in ErrorBoundary + Suspense */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<TodoListSkeleton />}>
          <TodoList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

function TodoList() {
  const { data, error } = useSuspenseQuery(
    orpc.todo.getTodos.queryOptions({
      input: { amount: 5 },
    })
  );

  if(error?.message === "UNAUTHORIZED"){
    console.log('redirected >>')
  }

  console.log("error =>", { error})
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 w-full px-10">
      {data.map((todo) => (
        <Card key={todo.id}>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>Rendered below after submit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Title</span>
              <p className="font-medium">{todo.title}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Description</span>
              <p className="whitespace-pre-wrap">{todo.body}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TodoListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 w-full px-10">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-center text-red-500 mt-12">
      <p>⚠️ Something went wrong while loading todos.</p>
      <p className="text-sm">{error.message}</p>
    </div>
  );
}
