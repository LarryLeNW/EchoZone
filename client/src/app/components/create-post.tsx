"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ImageIcon, Smile, MapPin } from "lucide-react";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { useCreatePostMutation } from "@/queries/useBlog";
import { CreatePostRequestSchema, CreatePostRequestType } from "@/schemaValidations/post.schema";
import { PostVisibility } from "@/constants/post";
import { handleErrorApi } from "@/lib/utils";
import ImageUpload from "@/components/upload";

export function CreatePost() {
  const createPostMutation = useCreatePostMutation();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<Array<String> | null>(null);
  console.log("🚀 ~ CreatePost ~ imageUrl:", imageUrl)
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
  } = useForm<CreatePostRequestType>({
    resolver: zodResolver(CreatePostRequestSchema),
    defaultValues: {
      body: "",
      mediaJson: null,
      visibility: PostVisibility.Public,
      allowComments: true,
      allowReactions: true,
      allowUserIds: [],
      denyUserIds: [],
    },
  });

  const onSubmit = async (values: CreatePostRequestType) => {
    try {
      await createPostMutation.mutateAsync(values);
      toast.success("Đăng bài viết thành công!");
      reset();
      setImageUrl(null);
      setOpen(false);
    } catch (error) {
      handleErrorApi({ error, setError });
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="w-10 h-10 border-2 border-purple-300 dark:border-purple-600">
            <AvatarImage src="/diverse-profile-avatars.png" />
            <AvatarFallback className="bg-purple-600 text-white">U</AvatarFallback>
          </Avatar>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex-1 text-left rounded-full border px-4  text-sm
                             border-purple-200 dark:border-purple-700
                             bg-purple-50/50 dark:bg-gray-700/50
                             text-gray-600 dark:text-gray-300 hover:bg-purple-100/60
                             transition"
              >
                Bạn đang nghĩ gì?
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tạo bài viết</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src="/diverse-profile-avatars.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Bạn</span>
                  <span className="text-xs text-muted-foreground">Công khai</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Textarea
                  autoFocus
                  placeholder="Bạn đang nghĩ gì?"
                  {...register("body")}
                  className="min-h-[120px] resize-none"
                />

                <div className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Thêm vào bài viết của bạn</span>
                    <div className="flex items-center gap-2">
                      <ImageUpload
                        updateStatus={(status) => {
                          setIsUploading(status)
                        }}
                        onUploadSuccess={(urls) => {
                          setImageUrl(urls);
                        }}
                        isUploading={isUploading}
                      >
                        <Button type="button" variant="ghost" size="sm" className="gap-2">
                          <ImageIcon className="w-5 h-5" />
                          Ảnh
                        </Button>
                      </ImageUpload>

                      <Button type="button" variant="ghost" size="sm" className="gap-2">
                        <Smile className="w-5 h-5" />
                        Cảm xúc
                      </Button>

                      <Button type="button" variant="ghost" size="sm" className="gap-2">
                        <MapPin className="w-5 h-5" />
                        Vị trí
                      </Button>
                    </div>
                  </div>

                  {/* {imageUrl && (
                    <div className="mt-3">
                      <img
                        src={imageUrl}
                        alt="preview"
                        className="max-h-64 w-full rounded-md object-cover border"
                      />
                    </div>
                  )} */}
                </div>

                {Object.entries(errors).length > 0 && (
                  <div className="text-red-500 text-sm space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <p key={field}>{error?.message?.toString()}</p>
                    ))}
                  </div>
                )}

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Hủy
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting} className="min-w-24 bg-primary">
                    {isSubmitting ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      "Đăng"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
