import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { UserNav } from "./user-navi";
import { navList } from "./side-bar";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { pathname } = useLocation();
  const title = navList.find((item) => item.href === pathname)?.name;
  return (
    <nav
      className={cn(
        "flex justify-between items-center relative space-x-4 lg:space-x-6 py-3 px-4",
        className
      )}
      {...props}
    >
      <h4 className=" text-xl font-semibold tracking-tight">{title}</h4>
      <UserNav />
    </nav>
  );
}
