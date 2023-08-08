import { FC, useEffect, useState } from "react";
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
import toc from "markdown-it-toc-and-anchor";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MarkdownIt from "markdown-it";
const formSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string(),
  categoryId: z.string(),
  html: z.string(),
});
const mdParser = new MarkdownIt();
const mdToc = new MarkdownIt();
mdParser.enable("html_inline");
const NewPost: FC = () => {
  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: CategoryService.categoryControllerFindAll,
  });
  const { id } = useParams();
  const [cover, setCover] = useState<string>();
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
  useEffect(() => {
    setCover(data?.cover);
  }, [data]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const parseMarkdown = (markdown?: string) => {
    if (!markdown) {
      return "";
    }
    mdToc.use(toc, {
      anchorLinkSpace: false,
    });
    let tocTokens = "";
    mdToc.render(markdown, {
      tocCallback: function (tocMarkdown, tocArray, tocHtml) {
        tocTokens = JSON.stringify(tocArray);
      },
    });
    mdParser.renderer.rules.heading_open = function (tokens, idx) {
      const headingText = tokens[idx + 1].content;

      const id = headingText.toLowerCase().replace(/\*/g, "");

      return `<${tokens[idx].tag} id="${id}">`;
    };
    const html = mdParser.render(markdown);

    return [html, tocTokens];
  };
  const createPost = async () => {
    if (!user) {
      return;
    }
    const data = form.getValues();
    const [html, toc] = parseMarkdown(data.content);

    try {
      const res = await PostsService.postControllerCreate({
        ...data,
        authorId: user?.id,
        html,
        toc,
        cover,
      });
      toast({
        title: "创建文章: " + res.title,
        description: "创建成功",
      });
      navigate(`/posts`);
    } catch (error) {
      toast({
        title: "创建文章:",
        description: "创建失败",
      });
    }
  };

  const editPost = async () => {
    if (!user) {
      return;
    }
    const data = form.getValues();
    console.log(333333333);

    const [html, toc] = parseMarkdown(data.content);
    try {
      const postData = {
        ...data,
        authorId: user?.id,
        html,
        toc,
        cover,
      };
      postData.category = undefined;
      const res = await PostsService.postControllerUpdate(id!, postData);
      toast({
        title: "编辑文章: " + res.title,
        description: "编辑成功",
      });
      navigate(`/posts`);
    } catch (error) {
      toast({
        title: "创建文章:",
        description: "创建失败",
      });
    }
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
          <Dialog>
            <DialogTrigger>
              <Button size={"sm"} className="inline-block w-[56px]">
                发布
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加封面</DialogTitle>
                <DialogDescription>
                  为你的文章添加封面（非必要）
                </DialogDescription>
                <Input
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="封面链接"
                />
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      if (type === "edit") {
                        editPost();
                      } else {
                        createPost();
                      }
                    }}
                  >
                    发布
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  onChange={(t) => {
                    field.onChange(t ?? "");
                  }}
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
