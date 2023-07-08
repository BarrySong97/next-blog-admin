import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const navList = [
  {
    name: "首页",
    href: "/",
  },
  {
    name: "文章",
    href: "/posts",
  },

  {
    name: "分类",
    href: "/categories",
  },
  {
    name: "照片",
    href: "/photos",
  },
  {
    name: "评论",
    href: "/comments",
  },
  {
    name: "项目",
    href: "/projects",
  },
  {
    name: "设置",
    href: "/settings",
  },
];
export function Sidebar({ className }: SidebarProps) {
  const { pathname } = useLocation();
  const isSelected = (path: string) => pathname === path;
  return (
    <div className={cn(className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navList.map((item) => {
              return (
                <Link to={item.href}>
                  <Button
                    key={item.name}
                    //   variant="secondary"
                    variant={!isSelected(item.href) ? "ghost" : "secondary"}
                    className="w-full justify-start mb-1"
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
