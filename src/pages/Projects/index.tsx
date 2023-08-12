import { PhotoDTO, PhotosService, ProjectDTO, ProjectsService } from "@/api";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import showAlertModal from "@/hooks/useModal";
import { ColumnDef } from "@tanstack/react-table";
import { useBoolean } from "ahooks";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import EditDialog from "./components/edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import ImageViewer from "@/components/image-viewer";

export default function Projects() {
  const queryClient = useQueryClient();
  const [editModalVisible, { setTrue: setEditTrue, setFalse: setEditFalse }] =
    useBoolean(false);
  const [clickItem, setClickItem] = useState<ProjectDTO>();
  const { data } = useQuery({
    queryKey: ["projects"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: ProjectsService.projectsControllerFindAll,
  });
  const deleteMutation = useMutation(ProjectsService.projectsControllerRemove, {
    onSuccess: (data) => {
      queryClient.setQueryData(["projects"], (oldData?: ProjectDTO[]) => {
        return oldData?.filter((item) => item.id !== data.id) ?? [];
      });
    },
  });
  const handleDelete = async (id: string) => {
    deleteMutation.mutateAsync(id);
  };
  const handleDeleteBatch = async (id: string[]) => {
    await ProjectsService.projectsControllerDeleteBatch(id);
    queryClient.setQueryData(["projects"], (oldData?: ProjectDTO[]) => {
      return oldData?.filter((item) => !id.includes(item.id)) ?? [];
    });
    setSelectRows(undefined);
  };
  const [selectRows, setSelectRows] = useState<ProjectDTO[]>();
  const columns: ColumnDef<ProjectDTO>[] = [
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
    {
      id: "image",
      header: "图片",
      cell({ row }) {
        return (
          <ImageViewer
            src={row.original.image}
            className="cursor-pointer w-[100px] object-cover"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "项目名称",
      cell({ row }) {
        return (
          <Button variant="link" className="p-0">
            <a href={row.original.url}>{row.original.name}</a>
          </Button>
        );
      },
    },
    {
      accessorKey: "content",
      header: "项目描述",
    },
    {
      accessorKey: "github",
      header: "github",
    },
    {
      accessorKey: "post",
      header: "关联文章",
      cell({ row }) {
        return (
          <Button variant="link" className="p-0">
            <a href={row.original.post?.id}>{row.original.post?.title}</a>
          </Button>
        );
      },
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
                  //   setDeleteAlertTrue();
                  showAlertModal({
                    title: "删除该项目",
                    content: `确认要删除该项目 【${row.original.name}】？`,
                    onOk() {
                      handleDelete(row.original.id);
                    },
                  });
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
        <title>项目管理</title>
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
                  title: "批量删除项目",
                  content: "确认要删除选中的项目吗？",
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
      <EditDialog
        open={editModalVisible}
        onCanceled={() => setEditFalse()}
        onoK={() => setEditFalse()}
        clickItem={clickItem}
      />
    </div>
  );
}
