import { Command } from "lucide-react";
import { Helmet } from "react-helmet";
import { UserAuthForm } from "@/components/ui/user-auth-form";
export default function Login() {
  return (
    <div className="h-screen">
      <Helmet>
        <title>登录</title>
      </Helmet>
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" /> Acme Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">登录</h1>
              <p className="text-sm text-muted-foreground">
                BarrySong' Blog 后台管理
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
