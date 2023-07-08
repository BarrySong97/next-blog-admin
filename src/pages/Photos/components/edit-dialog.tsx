import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "react-query";
import {
  CategoryDTO,
  CategoryService,
  CreateCategoryDto,
  PhotoDTO,
  PhotosService,
} from "@/api";
export interface EditDialogProps {
  clickItem?: PhotoDTO;
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
  const [url, setUrl] = useState<string>();
  const queryClient = useQueryClient();
  const addMutation = useMutation(PhotosService.photosControllerCreate, {
    onSuccess: (data) => {
      queryClient.setQueryData(["photos"], (oldData?: CreateCategoryDto[]) => {
        return [...(oldData ?? []), data];
      });
    },
  });
  const handleCreate = async () => {
    if (!url) {
      return;
    }
    await addMutation.mutateAsync({
      url,
    });
    onoK();
  };
  const handleEdit = async () => {
    if (!url || !clickItem) {
      return;
    }
    const res = await PhotosService.photosControllerUpdate(clickItem.id, {
      url,
    });
    queryClient.setQueryData(["photos"], (oldData?: CategoryDTO[]) => {
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
    setUrl(clickItem?.url);
  }, [clickItem]);
  return (
    <Dialog open={open}>
      <DialogContent
        onClose={() => {
          onCanceled();
          setUrl("");
        }}
      >
        <DialogHeader>
          <DialogTitle>{!clickItem ? "新增" : "编辑"}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center">
          <Input
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            value={url}
            placeholder="照片链接"
            id="url"
          />
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              onCanceled();
              setUrl("");
            }}
          >
            取消
          </Button>
          <Button
            disabled={!url}
            onClick={async () => {
              if (clickItem) {
                await handleEdit();
              } else {
                await handleCreate();
              }
              setUrl("");
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
