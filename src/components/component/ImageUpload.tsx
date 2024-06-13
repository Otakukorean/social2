"use client";
import { Button } from "~/components/ui/button"
import Image from "next/image"
import {CldUploadWidget} from 'next-cloudinary'
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
interface ImageUploadProps {
    disabled ?: boolean ;
    onChange : (value : string) => void ;
    onRemove : (value : string) => void;
    value : string[];
}
export const ImageUpload : React.FC<ImageUploadProps> = ({onChange,onRemove,value,disabled}) => {
  const [isMounted,SetIsMounted] = useState(false) ;
  useEffect(() => {
       SetIsMounted(true)
  },[])
  const onUpload = (result : any) => {
      onChange(result?.info?.secure_url)
      console.log(result?.info?.secure_url);
      
  }

     
  if(!isMounted) {
    return null
  }
  return (
    <>
    <CldUploadWidget  onUpload={onUpload} uploadPreset="z1w6dtxd">
    {({open}) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6 py-12">
                      <div onClick={onClick} className="w-full border-2 border-gray-300 border-dashed rounded-lg p-12 flex flex-col items-center justify-center space-y-4 hover:border-gray-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500 dark:border-gray-600 dark:hover:border-gray-500">
                        <UploadIcon className="w-12 h-12 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Drag and drop your files here or
                          <span className="font-medium text-gray-700 dark:text-gray-300">select from your filesystem</span>
                        </p>
                        <input aria-describedby="file-upload-description" className="sr-only" multiple type="file" />
                      </div>
                      <Button onClick={onClick}>Upload Files</Button>
                    </div>
                    ) 
                }}

      </CldUploadWidget>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-6">
        {value?.map((url: string) => (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2"> 
              <Button type="button" onClick={() => onRemove(url)} variant={'destructive'} size={'icon'}>
                            <Trash className="h-4 w-4" />
                        </Button>
              </div>
           <Image
           
           alt="Uploaded Image"
           className="rounded-lg object-cover"
           height="300"
           src={url}
           style={{
             aspectRatio: "300/300",
             objectFit: "cover",
           }}
           width="300"
         />
         </div>
        ))}
      </div>
    </>
  )
}

function UploadIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
