import { FC } from "react";
import "./index.css";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MaterialSymbolsAccountBox,
  MaterialSymbolsArticle,
  MaterialSymbolsCommentRounded,
  MaterialSymbolsImagesmodeOutline,
} from "./icons";
import { DataTable } from "@/components/ui/data-table";
import PostTable from "../Posts/components/post-table";
import { useRequest } from "ahooks";
import { AppService } from "@/api";
export interface HomeProps {}
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const Dashboard: FC<HomeProps> = () => {
  const { t } = useTranslation();
  const statusList = [
    {
      title: "文章数",
      key: "post",
      icon: (
        <MaterialSymbolsArticle className="h-4 w-4 text-muted-foreground" />
      ),
    },
    {
      title: "项目数",
      key: "project",
      icon: (
        <MaterialSymbolsCommentRounded className="h-4 w-4 text-muted-foreground" />
      ),
    },
    {
      title: "照片数",
      key: "photo",
      icon: (
        <MaterialSymbolsImagesmodeOutline className="h-4 w-4 text-muted-foreground" />
      ),
    },
  ] as const;
  type Keys = (typeof statusList)[number]["key"];
  const { data } = useRequest(() => AppService.appControllerGetDashboardData());
  return (
    <div className="p-4 home ">
      <div className="flex gap-4">
        {statusList.map((item) => {
          const nums = data?.[item.key as Keys] ?? 0;
          return (
            <Card key={item.key} className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                {item.icon}
                {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nums}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>最近文章</CardTitle>
          </CardHeader>
          <CardContent>
            <PostTable />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader></CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
