import { Button, Layout, LocaleProvider, Nav, Select } from "@douyinfe/semi-ui";
import "./App.css";
import { Link, Outlet } from "react-router-dom";
import { IconGithubLogo, IconLanguage } from "@douyinfe/semi-icons";
import { QueryClient, QueryClientProvider } from "react-query";
import zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import "./i18n/config";
import { useLocalStorageState } from "ahooks";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
const { Header, Content } = Layout;
const queryClient = new QueryClient();
const semiLocale = {
  zh: zh_CN,
  en: en_US,
} as const;
function App() {
  const [localeStorage, setLoaleStorage] = useLocalStorageState("locale", {
    defaultValue: "en",
  });
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLoaleStorage(lng);
  };
  useEffect(() => {
    i18n.changeLanguage(localeStorage);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider
        locale={semiLocale[localeStorage as keyof typeof semiLocale]}
      >
        <Layout className="components-layout-demo">
          <Header className="fixed top-0 w-full">
            <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
              <Nav.Item
                itemKey="Home"
                text={<Link to="/">{t("home.title")}</Link>}
                // icon={<IconHome size="large" />}
              />
              <Nav.Item
                itemKey="Setting"
                text={<Link to="/about">{t("about.title")}</Link>}
                // icon={<IconSetting size="large" />}
              />
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
                <Select
                  defaultValue="en"
                  onChange={(value) => changeLanguage(value as string)}
                  value={localeStorage}
                  style={{ width: 200, marginRight: 10 }}
                  insetLabel={<IconLanguage />}
                >
                  <Select.Option value="zh">中文</Select.Option>
                  <Select.Option value="en">English</Select.Option>
                </Select>
              </Nav.Footer>
            </Nav>
          </Header>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;
