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
import { uploadImages } from "@/image";
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
      tocCallback: function (_, tocArray) {
        tocArray?.forEach((element) => {
          element.anchor = element.content
            .toLowerCase()
            .replace(/\*/g, "")
            .replace(/\s/g, "-");
          element.content = element.content.replace(/\*/g, "");
        });
        tocTokens = JSON.stringify(tocArray);
      },
    });
    mdParser.renderer.rules.heading_open = function (tokens, idx) {
      const headingText = tokens[idx + 1].content;

      const id = headingText
        .toLowerCase()
        .replace(/\*/g, "")
        .replace(/\s/g, "-");
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
  const insertToTextArea = (intsertString: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) {
      return null;
    }

    let sentence = textarea.value;
    const len = sentence.length;
    const pos = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const front = sentence.slice(0, pos);
    const back = sentence.slice(pos, len);

    sentence = front + intsertString + back;

    textarea.value = sentence;
    textarea.selectionEnd = end + intsertString.length;

    return sentence;
  };

  const onImagePasted = async (
    dataTransfer: DataTransfer,
    setMarkdown: (value: string) => void
  ) => {
    const files: File[] = [];
    for (let index = 0; index < dataTransfer.items.length; index += 1) {
      const file = dataTransfer.files.item(index);

      if (file) {
        files.push(file);
      }
    }

    await Promise.all(
      files.map(async (file) => {
        const url = await uploadImages(file);
        const insertedMarkdown = insertToTextArea(`![](${url})`);
        if (!insertedMarkdown) {
          return;
        }
        setMarkdown(insertedMarkdown);
      })
    );
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
                <div className="">
                  <div className="flex items-center justify-center w-full mb-2">
                    <label
                      // for="dropzone-file"
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        uploadImages(file).then((url) => {
                          setCover(url);
                        });
                      }}
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      {cover ? (
                        <img src={cover} className="w-full h-64 object-cover" />
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
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
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
                              setCover(url);
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="mb-2 text-center">或者</div>
                  {/* <img
                    src={cover}
                    className="flex-1 h-[250px] object-cover mb-4"
                  /> */}

                  <Input
                    className=""
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder="封面链接"
                  />
                </div>
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
                  onPaste={async (event) => {
                    await onImagePasted(
                      event.clipboardData,
                      (content: string) => {
                        form.setValue("content", content);
                      }
                    );
                  }}
                  onDrop={async (event) => {
                    event.preventDefault();
                    await onImagePasted(
                      event.dataTransfer,
                      (content: string) => {
                        form.setValue("content", content);
                      }
                    );
                  }}
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
