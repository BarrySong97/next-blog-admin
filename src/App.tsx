import { Button, Layout, LocaleProvider, Nav } from "@douyinfe/semi-ui";
import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import { IconGithubLogo } from "@douyinfe/semi-icons";
import { QueryClient, QueryClientProvider } from "react-query";
import "./i18n/config";
import { ChakraProvider } from "@chakra-ui/react";
import Sider from "@douyinfe/semi-ui/lib/es/layout/Sider";
import { Heading } from "@chakra-ui/react";
const { Content } = Layout;
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
  // const pathnames = match.url.split("/").filter(Boolean);
  const { pathname } = useLocation();
  const pathTtitle = menuItems.find((item) => item.path === pathname)?.text;
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider
      // locale={semiLocale[localeStorage as keyof typeof semiLocale]}
      >
        <ChakraProvider>
          <Layout className="components-layout-demo h-screen">
            <Sider className="">
              <Nav defaultSelectedKeys={["dashboard"]} className="h-full">
                {menuItems.map((item) => {
                  return (
                    <Nav.Item
                      key={item.key}
                      itemKey={item.key}
                      text={item.text}
                      // icon={<IconHome size="large" />}
                    />
                  );
                })}
              </Nav>
            </Sider>
            <Content>
              <Nav
                mode="horizontal"
                defaultSelectedKeys={["dashboard"]}
                // className="fixed top-0"
              >
                <Heading as="h2" size="md">
                  {pathTtitle}
                </Heading>
                <Nav.Footer>
                  <Button
                    theme="borderless"
                    type="tertiary"
                    onClick={() => {
                      window.open(
                        "https://github.com/BarrySong97/vite-react-semi-starter",
                        "_blank"
                      );
                    }}
                    style={{ marginRight: 10, marginLeft: 10 }}
                    icon={<IconGithubLogo size="large" />}
                  />
                </Nav.Footer>
              </Nav>
              <Outlet />
            </Content>
          </Layout>
        </ChakraProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;
