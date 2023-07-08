import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createGoogleLoginUrl } from "@/lib/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <Button onClick={() => createGoogleLoginUrl()}>使用 Google 登录</Button>
      </div>
    </div>
  );
}
