/* eslint-disable react/no-unescaped-entities */
"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "~/components/ui/form"
  
import { toast, useToast } from "~/components/ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "~/components/ui/textarea";
import FileUploader from "./FileUpload";
import { ImageUpload } from "./component/ImageUpload";
import { PostValidation } from "~/lib/utils";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { Post } from "@prisma/client";

type PostFormProps = {
  post?: Post;
  action: "Create" | "Update";

};



const PostForm = () => {
  const createPost = api.post.create.useMutation({
    onSuccess : () => {
        toast({title : "Success",description:"Post Created!"})
        form.reset()
    } ,
    onError : () =>{
       toast({title : "Error",description:"Something went wrong!", variant:'destructive'})
       form.reset()
    }
  })
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: '',
      images: [],
      location: "",
      tags: '', 
  }});



  // Handler
  const handleSubmit = async (values: z.infer<typeof PostValidation>) => {
    try {
    await createPost.mutateAsync(values)
    } catch (error) {
      console.log(error); 
    }

  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                disabled={createPost.isPending}
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
              <ImageUpload 
                    value={field.value?.map((image) => image.url)} 
                    disabled={createPost.isPending}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                  />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input    disabled={createPost.isPending} type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                   disabled={createPost.isPending}
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            disabled={createPost.isPending}
           >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={createPost.isPending}
            >
              {createPost.isPending ? (
                <Loader2 color="#fff" />
              ) : "Post"}
          
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
