import { SettingsService } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import * as z from "zod";
const formSchema = z.object({
  github: z.string().url(),
  githubAvatar: z.string().url(),
  weibo: z.string().url(),
  weiboAvatar: z.string().url(),
  twitter: z.string().url(),
  twitterAvatar: z.string().url(),
  bilibili: z.string().url(),
  bilibiliAvatar: z.string().url(),
});
const Setting = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const { data } = useQuery({
    queryKey: ["setting"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: SettingsService.settingsControllerFind,
  });
  const handleSave = async () => {
    const formData = form.getValues();
    
    if (!data) {
      await SettingsService.settingsControllerCreate(formData);
    } else {
      await SettingsService.settingsControllerUpdate(data.id, {
        ...formData,
      });
    }
    toast({
      title: "保存成功",
      description: "设置已保存",
    });
  };
  useEffect(() => {
    form.reset(data);
  }, [data]);
  return (
    <div className="p-4 px-6">
      <div className="flex flex-col gap-4 w-[600px]">
        <Form {...form}>
          <FormField
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>github</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="github 链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubAvatar"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="gitub 头像链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weibo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>weibo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="weibo 链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weiboAvatar"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="weibo 头像链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>twitter</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="twitter 链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitterAvatar"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="twitter 头像链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bilibili"
            render={({ field }) => (
              <FormItem>
                <FormLabel>bilbili</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="bilibili 链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bilibiliAvatar"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="bilbili 头像链接" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        <Button onClick={handleSave}>保存</Button>

      </div>
    </div>
  );
};

export default Setting;
