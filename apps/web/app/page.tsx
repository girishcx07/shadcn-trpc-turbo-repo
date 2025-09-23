import { LoginButton } from "./react-query-example/_components/login-btn";

export default function Page() {
  return (
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">ORPC</span> Turbo Repo
          </h1>
          <LoginButton />

          {/* <CreatePostForm /> */}
          <div className="w-full max-w-2xl overflow-y-scroll">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, vel
            totam! Dignissimos esse quod, aperiam provident necessitatibus
            maiores aliquam quas odit, similique magni facilis sapiente. Vero
            recusandae dolorem culpa. Velit.
          </div>
        </div>
      </main>
  );
}
