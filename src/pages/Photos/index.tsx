import { PhotoDTO, PhotosService } from "@/api";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditDialog from "./components/edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import ImageViewer from "@/components/image-viewer";

export default function Photos() {
  const queryClient = useQueryClient();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [editModalVisible, { setTrue: setEditTrue, setFalse: setEditFalse }] =
    useBoolean(false);
  const [clickItem, setClickItem] = useState<PhotoDTO>();
  const { data } = useQuery({
    queryKey: ["photos"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: PhotosService.photosControllerFindAll,
  });
  const deleteMutation = useMutation(PhotosService.photosControllerRemove, {
    onSuccess: (data) => {
      queryClient.setQueryData(["photos"], (oldData?: PhotoDTO[]) => {
        return oldData?.filter((item) => item.id !== data.id) ?? [];
      });
    },
  });
  const handleDelete = async (id: string) => {
    deleteMutation.mutateAsync(id);
  };
  const handleDeleteBatch = async (id: string[]) => {
    await PhotosService.photosControllerDeleteBatch(id);
    queryClient.setQueryData(["photos"], (oldData?: PhotoDTO[]) => {
      return oldData?.filter((item) => !id.includes(item.id)) ?? [];
    });
    setSelectRows(undefined);
  };
  const [selectRows, setSelectRows] = useState<PhotoDTO[]>();
  const columns: ColumnDef<PhotoDTO>[] = [
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
      id: "img",
      header: "图片",
      cell({ row }) {
        return (
          <ImageViewer
            src={row.original.url}
            className="cursor-pointer w-[100px] object-cover"
          />
        );
      },
    },
    {
      accessorKey: "url",
      header: "链接",
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
                    title: "删除照片",
                    content: "确认要删除该照片？",
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
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            onClick={() => {
              // setEditTrue();
              showAlertModal({
                title: "批量删除照片",
                content: "确认要删除选中的照片吗？",
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
        </div>
        <Tabs
          onValueChange={(e) => {
            setLayout(e as "grid" | "list");
          }}
          defaultValue="grid"
        >
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {layout === "list" ? (
        <DataTable
          // search={false}
          pagination={true}
          visibleRows={true}
          columns={columns}
          toolActions={<></>}
          data={data ?? []}
        />
      ) : (
        <section className="flex flex-col md:grid md:grid-cols-4 gap-2 mt-4  ">
          {data?.map((img) => {
            return (
              <div key={img.id} className="mb-3  h-[350px] ">
                <ImageViewer
                  key={img.id}
                  src={img.url ?? ""}
                  className={`object-cover rounded-md w-full h-full cursor-pointer  `}
                />
              </div>
            );
          })}
        </section>
      )}
      <EditDialog
        open={editModalVisible}
        onCanceled={() => setEditFalse()}
        onoK={() => setEditFalse()}
        clickItem={clickItem}
      />
    </div>
  );
}
