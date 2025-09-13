"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "@workspace/trpc/server-trpc";
import { Button } from "@workspace/ui/components/button";

const AuthButton = () => {
  const { data } = useQuery(trpc.auth.getSession.queryOptions());

  const { mutate: login } = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => {
        // handle success
      },
      onError: () => {
        // handle error
      },
    })
  );

  const { mutate: logout } = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: () => {
        // handle success
      },
      onError: () => {
        // handle error
      },
    })
  );

  const userId = "user-" + Math.floor(Math.random() * 1000);

  return (
    <div className="flex justify-end items-center">
      {data ? (
        <Button variant="outline" size="sm" onClick={() => logout()}>
          Sign Out
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => login({ userId })}>
          Sign In
        </Button>
      )}
    </div>
  );
};

export default AuthButton;
