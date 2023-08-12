import { FC } from "react";
import PostTable from "./components/post-table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
export interface PostsProps {}
const Posts: FC<PostsProps> = () => {
  const navgate = useNavigate();
  return (
    <div className="p-4">
      <Helmet>
        <title>文章管理</title>
      </Helmet>
      <PostTable
        toolActions={
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              navgate("/posts/new");
            }}
          >
            新增
          </Button>
        }
        search
        visibleRows
        pagination
      />
    </div>
  );
};

export default Posts;
