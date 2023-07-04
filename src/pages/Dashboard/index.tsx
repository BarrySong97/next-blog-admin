import { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Heading,
} from "@chakra-ui/react";
import { Table, Avatar } from "@douyinfe/semi-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostTable from "../../components/PostTable";
export interface HomeProps {}
const Dashboard: FC<HomeProps> = () => {
  const { t } = useTranslation();
  const statusList = [
    {
      title: "文章数",
      key: "posts",
    },
    {
      title: "评论数",
      key: "comments",
    },
    {
      title: "照片数",
      key: "photos",
    },
    {
      title: "访问数",
      key: "projects",
    },
  ];

  const columns = [
    {
      title: "标题",
      dataIndex: "name",
      render: (text, record, index) => {
        return (
          <div>
            <Avatar
              size="small"
              shape="square"
              src={record.nameIconSrc}
              style={{ marginRight: 12 }}
            ></Avatar>
            {text}
          </div>
        );
      },
    },
    {
      title: "大小",
      dataIndex: "size",
    },
    {
      title: "所有者",
      dataIndex: "owner",
      render: (text, record, index) => {
        return (
          <div>
            <Avatar
              size="small"
              color={record.avatarBg}
              style={{ marginRight: 4 }}
            >
              {typeof text === "string" && text.slice(0, 1)}
            </Avatar>
            {text}
          </div>
        );
      },
    },
    {
      title: "更新日期",
      dataIndex: "updateTime",
    },
    {
      title: "",
      dataIndex: "operate",
      render: () => {},
    },
  ];
  const data = [
    {
      key: "1",
      name: "Semi Design 设计稿.fig",
      nameIconSrc:
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png",
      size: "2M",
      owner: "姜鹏志",
      updateTime: "2020-02-02 05:13",
      avatarBg: "grey",
    },
    {
      key: "2",
      name: "Semi Design 分享演示文稿",
      nameIconSrc:
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png",
      size: "2M",
      owner: "郝宣",
      updateTime: "2020-01-17 05:31",
      avatarBg: "red",
    },
    {
      key: "3",
      name: "设计文档",
      nameIconSrc:
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png",
      size: "34KB",
      owner: "Zoey Edwards",
      updateTime: "2020-01-26 11:01",
      avatarBg: "light-blue",
    },
  ];

  return (
    <div className="p-4 ">
      <div className="flex gap-4">
        {statusList.map((item) => {
          return (
            <Card key={item.key} className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
              {/* <CardContent>
                <StatGroup>
                  <Stat>
                    <StatLabel>{item.title}</StatLabel>
                    <StatNumber>345,670</StatNumber>
                  </Stat>
                </StatGroup>
              </CardContent> */}
            </Card>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4">
        <Card className="flex-1">
          <CardHeader>
            <Heading size="md">最近文章</Heading>
          </CardHeader>
          <CardContent>
            <PostTable />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <Heading size="md">最近评论</Heading>
          </CardHeader>
          <CardContent>
            <Table columns={columns} dataSource={data} pagination={false} />
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 mt-4">
        <Card className="flex-1">
          <CardHeader>
            <Heading size="md">最近照片</Heading>
          </CardHeader>
          <CardContent>
            <Table columns={columns} dataSource={data} pagination={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
