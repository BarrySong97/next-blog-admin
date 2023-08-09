import { FC, useEffect, useRef, useState } from "react";
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
import { CategoryDTO, CreateCategoryDto, PhotoDTO, PhotosService } from "@/api";
import { Separator } from "@/components/ui/separator";
import { uploadImages } from "@/image";
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
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const addMutation = useMutation(PhotosService.photosControllerCreate, {
    onSuccess: (data) => {
      queryClient.setQueryData(["photos"], (oldData?: CreateCategoryDto[]) => {
        return [...(oldData ?? []), data];
      });
    },
  });
  const handleCreate = async () => {
    if (!url && !inputRef.current) {
      return;
    }
    if (!inputRef.current) {
      return;
    }

    const file = inputRef.current.files?.[0];
    console.log(file);

    if (!file) {
      return;
    }
    const imageUrl = await uploadImages(file);
    if (imageUrl) {
      await addMutation.mutateAsync({
        url: imageUrl,
      });
      onoK();
    }
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

        <div className="flex flex-col items-center">
          <Input
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            value={url}
            placeholder="照片链接"
            id="url"
          />
          <Separator className="my-4" />
          <div className="grid w-full  items-center gap-1.5">
            <Input ref={inputRef} type="file" />
          </div>
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
            onClick={async () => {
              if (clickItem) {
                await handleEdit();
              } else {
                await handleCreate();
              }
              setUrl("");
              setFile(undefined);
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
