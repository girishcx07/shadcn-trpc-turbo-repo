"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { client, orpc } from "@workspace/orpc/lib/orpc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Credential, CredentialSchema } from "@workspace/orpc/schemas/auth";
import { useSession } from "../_hooks/use-session";

export function LoginButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔑 Fetch current session
  const { data: session } = useSession();

  // ✅ React Hook Form setup
  const form = useForm<Credential>({
    resolver: zodResolver(CredentialSchema),
    defaultValues: { email: "", password: "" },
  });

  // ✅ Mutation for login
  const signinMutation = useMutation(
    orpc.auth.signin.mutationOptions({
      onSuccess: async (res) => {
        console.log();
        await queryClient.invalidateQueries({
          queryKey: orpc.auth.me.queryKey(),
        });
        setOpen(false);
        form.reset();
        setError(null);
        router.refresh();
      },
      onError: (err: any) => {
        setError(err?.message ?? "Invalid credentials");
      },
    })
  );


  async function handleLogout() {
    await client.auth.logout()
    await queryClient.invalidateQueries({ queryKey: orpc.auth.me.queryKey() });
    
    router.refresh();
  }

  if (session?.user) {
    return (
      <Button variant="destructive" onClick={handleLogout}>
        Logout ({session.user.name})
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Login</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              signinMutation.mutate(values)
            )}
            className="space-y-6"
          >
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>
                Enter your credentials to access the app.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={signinMutation.isPending}
                className="w-full"
              >
                {signinMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
