import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "react-query";
import { CategoryDTO, CategoryService, CreateCategoryDto } from "@/api";
import { useBoolean } from "ahooks";
export interface EditDialogProps {
  clickItem?: CategoryDTO;
  open: boolean;
  onCanceled: () => void;
  onoK: () => void;
}
const EditDialog: FC<EditDialogProps> = ({
  clickItem,
  open,
  onCanceled,
  onoK,
}) => {
  const [name, setName] = useState<string>();
  const queryClient = useQueryClient();
  const addMutation = useMutation(CategoryService.categoryControllerCreate, {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["categories"],
        (oldData?: CreateCategoryDto[]) => {
          return [...(oldData ?? []), data];
        }
      );
    },
  });
  const handleCreate = async () => {
    if (!name) {
      return;
    }
    await addMutation.mutateAsync({
      name,
    });
    onoK();
  };
  const handleEdit = async () => {
    if (!name || !clickItem) {
      return;
    }
    const res = await CategoryService.categoryControllerUpdate(clickItem.id, {
      name,
    });
    queryClient.setQueryData(["categories"], (oldData?: CategoryDTO[]) => {
      const newData = oldData?.map((item) => {
        if (item.id === clickItem?.id) {
          return {
            ...res,
          };
        }
        return item;
      });
      return [...(newData ?? [])];
    });
    onoK();
  };
  useEffect(() => {
    setName(clickItem?.name);
  }, [clickItem]);
  return (
    <Dialog open={open}>
      <DialogContent
        onClose={() => {
          onCanceled();
          setName("");
        }}
      >
        <DialogHeader>
          <DialogTitle>{!clickItem ? "新增" : "编辑"}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center">
          <Input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            placeholder="分类名称"
            id="name"
          />
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              onCanceled();
              setName("");
            }}
          >
            取消
          </Button>
          <Button
            disabled={!name}
            onClick={async () => {
              if (clickItem) {
                await handleEdit();
              } else {
                await handleCreate();
              }
              setName("");
            }}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
