import React, { FC } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "react-query";
import { PostDTO, PostsService } from "@/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBoolean } from "ahooks";
import { useNavigate } from "react-router-dom";
export interface PostTableProps {
  recentlyUpdated?: boolean;
  visibleRows?: boolean;
  pagination?: boolean;
  search?: boolean;
  toolActions?: React.ReactNode;
}
const PostTable: FC<PostTableProps> = ({
  search = false,
  pagination = false,
  visibleRows = false,
  toolActions,
}) => {
  const [
    deleteAlert,
    { setTrue: setDeleteAlertTrue, setFalse: setDeleteAlertFalse },
  ] = useBoolean(false);
  const navigate = useNavigate();
  const [clickItem, setClickItem] = React.useState<PostDTO>();
  const deletePost = async (id: string) => {
    await PostsService.postControllerRemove(id);
    queryClient.setQueryData(["posts"], (old?: PostDTO[]) => {
      return old?.filter((item) => item.id !== id) ?? [];
    });
  };
  const columns: ColumnDef<PostDTO>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "id",
    //   header: "id",
    // },
    {
      accessorKey: "title",
      header: "标题",
    },
    {
      accessorKey: "category",
      header: "分类",
      cell: ({ row }) =>
        row.original.category?.name ?? (
          <span className="text-gray-400">无</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            创建时间
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            更新时间
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "commentCount",
      header: "评论数",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteAlertTrue();
                  setClickItem(row.original);
                }}
              >
                删除
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/posts/${row.original.id}`);
                }}
              >
                编辑
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { data } = useQuery({
    queryKey: ["posts"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: PostsService.postControllerFindAll,
  });

  const queryClient = useQueryClient();
  return (
    <>
      <DataTable
        search={search}
        pagination={pagination}
        visibleRows={visibleRows}
        columns={columns}
        toolActions={toolActions}
        data={data ?? []}
      />
      <AlertDialog open={deleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认要删除该文章</AlertDialogTitle>
            <AlertDialogDescription>
              删除该文章【{clickItem?.title}】之后无法恢复
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={setDeleteAlertFalse}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!clickItem) return;
                deletePost(clickItem.id);
                setDeleteAlertFalse();
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostTable;
