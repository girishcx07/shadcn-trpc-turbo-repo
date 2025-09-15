"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@workspace/trpc/react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { loginSchema, LoginSchema } from "@workspace/trpc/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

const AuthButton = () => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery(trpc.auth.getSession.queryOptions());

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: login } = useMutation(
  trpc.auth.login.mutationOptions({
    onSuccess: async (res) => {
      if (res.success) {
        toast.success("Logged in successfully");
        setOpen(false);

        // Wait a tick before re-fetch to ensure cookies apply
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: trpc.auth.getSession.queryKey(),
          });
        }, 50);
      }
    },
  })
);

const { mutate: logout } = useMutation(
  trpc.auth.logout.mutationOptions({
    onSuccess: async () => {
      toast.success("Logged out successfully");

      // Optimistically remove session immediately
      queryClient.setQueryData(trpc.auth.getSession.queryKey(), { session: null });

      // Then refetch to confirm
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: trpc.auth.getSession.queryKey(),
        });
      }, 50);
    },
  })
);


  function onSubmit(values: LoginSchema) {
    login(values);
  }

  const session = data?.session;

  console.log("session", session);

  return (
    <div className="flex justify-end items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        {!session ? (
          <DialogTrigger asChild>
            <Button variant="outline" disabled={isFetching}>
              {isFetching ? "Checking..." : "Sign In"}
            </Button>
          </DialogTrigger>
        ) : (
          <Button onClick={() => logout()}>Logout</Button>
        )}

        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Sign in</DialogTitle>
                <DialogDescription>
                  Enter your credentials to sign in.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your login email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormDescription>This is your password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Sign in</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthButton;
