import { FC } from "react";
import { useTranslation } from "react-i18next";
import PostTable from "./components/post-table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export interface PostsProps {}
const Posts: FC<PostsProps> = () => {
  const navgate = useNavigate();
  return (
    <div className="p-4">
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
