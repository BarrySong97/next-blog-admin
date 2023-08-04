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
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  CreateCategoryDto,
  PostsService,
  ProjectDTO,
  ProjectsService,
} from "@/api";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
const formSchema = z.object({
  name: z.string().min(2).max(50),
  image: z.string(),
  url: z.string(),
  content: z.string(),
  github: z.string().optional(),
  postId: z.string().optional(),
});
export interface EditDialogProps {
  clickItem?: ProjectDTO;
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
  const queryClient = useQueryClient();
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: PostsService.postControllerFindAll,
  });
  const addMutation = useMutation(ProjectsService.projectsControllerCreate, {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["projects"],
        (oldData?: CreateCategoryDto[]) => {
          return [...(oldData ?? []), data];
        }
      );
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const handleCreate = async () => {
    const values = form.getValues();
    await addMutation.mutateAsync({
      ...values,
    });
    form.reset();
    onoK();
  };
  const handleEdit = async () => {
    if (!clickItem) {
      return;
    }
    const values = form.getValues();
    const res = await ProjectsService.projectsControllerUpdate(clickItem.id, {
      ...values,
    });
    queryClient.setQueryData(["projects"], (oldData?: ProjectDTO[]) => {
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
    form.reset();
    onoK();
  };

  useEffect(() => {
    if (clickItem) {
      form.reset({
        name: clickItem.name,
        image: clickItem.image,
        content: clickItem.content,
        url: clickItem.url,
        github : clickItem.github,
        postId: clickItem.post?.id,
      });
    }
  }, [clickItem]);
  return (
    <Dialog open={open}>
      <DialogContent
        onClose={() => {
          onCanceled();
        }}
      >
        <DialogHeader>
          <DialogTitle>{!clickItem ? "新增" : "编辑"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>项目名称</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="链接名称" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>github</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="github url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>项目链接</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="链接链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>链接文章</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="文章链接" />
                    </SelectTrigger>
                    <SelectContent>
                      {posts?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="项目描述" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>预览图片</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="链接链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              onCanceled();
            }}
          >
            取消
          </Button>
          <Button
            // disabled={!url}
            onClick={async () => {
              if (clickItem) {
                await handleEdit();
              } else {
                await handleCreate();
              }
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
