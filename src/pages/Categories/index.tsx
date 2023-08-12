import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";
import { MoreHorizontal } from "lucide-react";
import { FC, useState } from "react";
import EditDialog from "./components/edit-dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CategoryDTO, CategoryService } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
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
import showAlertModal from "@/hooks/useModal";
const Categories: FC = () => {
  const queryClient = useQueryClient();
  const [
    deleteAlert,
    { setTrue: setDeleteAlertTrue, setFalse: setDeleteAlertFalse },
  ] = useBoolean(false);
  const [editModalVisible, { setTrue: setEditTrue, setFalse: setEditFalse }] =
    useBoolean(false);
  const [clickItem, setClickItem] = useState<CategoryDTO>();
  const { data } = useQuery({
    queryKey: ["categories"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: CategoryService.categoryControllerFindAll,
  });
  const deleteMutation = useMutation(CategoryService.categoryControllerRemove, {
    onSuccess: (data) => {
      queryClient.setQueryData(["categories"], (oldData?: CategoryDTO[]) => {
        return oldData?.filter((item) => item.id !== data.id) ?? [];
      });
    },
  });
  const handleDelete = async (id: string) => {
    deleteMutation.mutateAsync(id);
  };
  const handleDeleteBatch = async (id: string[]) => {
    await CategoryService.categoryControllerDeleteBatch(id);
    queryClient.setQueryData(["categories"], (oldData?: CategoryDTO[]) => {
      return oldData?.filter((item) => !id.includes(item.id)) ?? [];
    });
    setSelectRows(undefined);
  };
  const [selectRows, setSelectRows] = useState<CategoryDTO[]>();
  const columns: ColumnDef<CategoryDTO>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const getIsSelected = !!value;
            if (getIsSelected) {
              const { rows } = table.getRowModel();
              const data = rows.map((item) => item.original);
              setSelectRows(data);
            } else {
              setSelectRows(undefined);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);

            const getIsSelected = !!value;
            if (getIsSelected) {
              setSelectRows((old) => {
                if (old) {
                  return [...old, row.original];
                }
                return [row.original];
              });
            } else {
              setSelectRows((old) => {
                if (old) {
                  return old.filter((item) => item.id !== row.original.id);
                }
                return undefined;
              });
            }
          }}
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
      accessorKey: "name",
      header: "名称",
    },
    {
      accessorKey: "postCount",
      header: () => <div className="text-center">文章数</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.postCount ? row.original.postCount : 0}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "创建时间",
      cell({ row }) {
        return (
          <div>{dayjs(row.original.createdAt).format("YYYY-MM-DD MM:ss")}</div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "更新时间",
      cell({ row }) {
        return (
          <div>{dayjs(row.original.updatedAt).format("YYYY-MM-DD MM:ss")}</div>
        );
      },
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
                  // handleDelete(row.original.id);
                }}
              >
                删除
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditTrue();
                  setClickItem(row.original);
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
  return (
    <div className="p-4">
      <Helmet>
        <title>分类管理</title>
      </Helmet>
      <DataTable
        // search={false}
        pagination={true}
        visibleRows={true}
        columns={columns}
        toolActions={
          <>
            <Button
              onClick={() => {
                // setEditTrue();
                showAlertModal({
                  title: "批量删除分类",
                  content: "确认要删除选中的分类吗？",
                  onOk() {
                    if (selectRows) {
                      handleDeleteBatch(selectRows.map((item) => item.id));
                    }
                  },
                });
                // setClickItem(undefined);
              }}
              variant={"destructive"}
              size={"sm"}
            >
              删除
            </Button>
            <Button
              onClick={() => {
                setEditTrue();
                setClickItem(undefined);
              }}
              variant={"outline"}
              size={"sm"}
            >
              新增
            </Button>
          </>
        }
        data={data ?? []}
      />
      <AlertDialog open={deleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认要删除该分类</AlertDialogTitle>
            <AlertDialogDescription>
              删除该分类之后其之下的文章分类将会被设置为未分类
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={setDeleteAlertFalse}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!clickItem) return;
                handleDelete(clickItem?.id);
                setDeleteAlertFalse();
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditDialog
        open={editModalVisible}
        onCanceled={() => setEditFalse()}
        onoK={() => setEditFalse()}
        clickItem={clickItem}
      />
    </div>
  );
};

export default Categories;
