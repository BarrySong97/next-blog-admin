import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./i18n/config";
import { MainNav } from "./components/ui/main-nav";
import { UserNav } from "./components/ui/user-navi";
import { Sidebar } from "./components/ui/side-bar";
import { Separator } from "./components/ui/separator";
import { Toaster } from "./components/ui/toaster";
const queryClient = new QueryClient();
function App() {
  const menuItems = [
    {
      key: "dashboard",
      text: "首页",
      path: "/",
    },
    {
      key: "posts",
      text: "文章",
      path: "/posts",
    },
    {
      key: "categories",
      text: "分类",
      path: "/categories",
    },
    {
      key: "photos",
      text: "照片",
      path: "/photos",
    },
    {
      key: "comments",
      text: "评论",
      path: "/comments",
    },
    {
      key: "settings",
      text: "设置",
      path: "/settings",
    },
  ];
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex h-screen">
        <Sidebar className="flex-1 h-full " />
        <Separator orientation="vertical" />
        <div className="flex-[8] h-full">
          <MainNav />
          <Separator orientation="horizontal" />
          <Outlet />
        </div>
        <Toaster />
      </main>
    </QueryClientProvider>
  );
}

export default App;
