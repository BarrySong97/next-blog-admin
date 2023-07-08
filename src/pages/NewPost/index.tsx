import { FC, useState } from "react";
import "./markdownstyle.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "react-query";
import { CategoryService } from "@/api/services/CategoryService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PostsService } from "@/api";
import { useAuth } from "@/auth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
const formSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string(),
  categoryId: z.string(),
});
const NewPost: FC = () => {
  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: CategoryService.categoryControllerFindAll,
  });
  const { id } = useParams();
  const type = id ? "edit" : "create";

  const { data } = useQuery({
    queryKey: ["post"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    enabled: !!id,
    onSuccess(data) {
      form.reset(data);
    },
    queryFn: () => PostsService.postControllerFindOne(id!),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title,
      content: data?.content,
      categoryId: data?.categoryId,
    },
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const createPost = async () => {
    if (!user) {
      return;
    }
    const data = form.getValues();

    const res = await PostsService.postControllerCreate({
      ...data,
      authorId: user?.id,
    });
    toast({
      title: "创建文章: " + res.title,
      description: "创建成功",
    });
    navigate(`/posts`);
  };

  const editPost = async () => {
    if (!user) {
      return;
    }
    const data = form.getValues();

    const res = await PostsService.postControllerUpdate(id!, {
      ...data,
      authorId: user?.id,
    });
    toast({
      title: "编辑文章: " + res.title,
      description: "编辑成功",
    });
    navigate(`/posts`);
  };

  return (
    <div
      className="p-4 "
      style={{
        height: "calc(100vh - 114px)",
      }}
    >
      <Form {...form}>
        <div className="flex mb-4 gap-4 items-center">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryData?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
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
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="标题" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            onClick={() => {
              if (type === "edit") {
                editPost();
              } else {
                createPost();
              }
            }}
            size={"sm"}
            className="inline-block w-[56px]"
          >
            发布
          </Button>
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MDEditor
                  value={field.value}
                  height={"calc(100vh - 148px)"}
                  className="w-full"
                  // {...register("content")}
                  onChange={(t) => field.onChange(t ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};

export default NewPost;
