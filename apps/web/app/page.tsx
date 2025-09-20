import { HydrateClient, prefetch, trpc } from "@workspace/trpc/server-trpc";
import { Suspense } from "react";
// import AuthButton from "./_components/auth-button";
import { PostCardSkeleton, PostList } from "./react-query-example/_components/posts";

export default function Page() {

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> Turbo
          </h1>
          {/* <AuthButton /> */}

          {/* <CreatePostForm /> */}
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              }
            >
              {/* <PostList /> */}
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
