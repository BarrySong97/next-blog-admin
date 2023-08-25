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
import { Textarea } from "@/components/ui/textarea";
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
        return [data, ...(oldData ?? [])];
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

        <div className="flex items-center justify-center w-full ">
          <label
            // for="dropzone-file"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              uploadImages(file).then((url) => {
                setUrl(url);
              });
            }}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            {url ? (
              <img src={url} className="w-full h-64 object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  uploadImages(file).then((url) => {
                    setUrl(url);
                  });
                }
              }}
              className="hidden"
            />
          </label>
        </div>
        <Separator className="my-1" />
        <div className="flex flex-col items-center">
          <Input placeholder="标题" className="mb-4" />
          <Textarea placeholder="内容" />
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
