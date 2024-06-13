"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from 'date-fns'

import {useSession } from "next-auth/react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination , Autoplay , Navigation } from 'swiper/modules';
import 'swiper/css/pagination';

import 'swiper/css';
import { Bookmark } from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import FollowBtn from "./FollowBtn";
import DeleteBtn from "./DeleteBtn";
interface PostCardProps {
    images : {url : string}[] ,
    user : {
        id : string ;
        image : string | null ;
        name : string | null;
    }
    post : {
        id :string;
        locaation : string ;
        createdAt : Date;
        caption: string;
    }
    Tags : {tag : string}[]
}

const PostCard = ({Tags,images,user,post} : PostCardProps) => {
  const session = useSession()
  const canDelete = session?.data?.user.id == user.id
  const AddToSavedapi = api.saved.create.useMutation({
    onSuccess : () => {
     
    } ,
    onError : (error) => {
      console.log(error);
      
    }
  })
  const SavedExist= api.saved.isExist.useQuery({
    postId : post.id
  })
  const Save =async () => {
    await AddToSavedapi.mutateAsync({
      postId : post.id
    })
    SavedExist.refetch()
  }
  const isSaved = SavedExist?.data?.postId === post.id;
    return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${user.id}`}>
            <Image
              src={user.image ? user.image : "/assets/icons/profile-placeholder.svg"
              }
              alt="creahrefr"
              className="w-12 lg:h-12 rounded-full object-cover"
              width={1000}
              height={1000}
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex justify-start items-center gap-1 md:gap-2">
            <p className="text-sm md:base-medium  lg:body-bold text-light-1 ">
              {user.name}
            </p>
            <FollowBtn userId={user.id} />
           
            </div>
         
            <div className="flex justify-start items-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
              {
                    formatDistance(new Date(`${post.createdAt}`) , new Date() , {addSuffix : true})
              }
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.locaation}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-5">
          {canDelete && <DeleteBtn postId={post.id} />} 
          <Bookmark onClick={Save} className={cn("hover:fill-primary-500 cursor-pointer" , isSaved && 'fill-primary-500')} color="#877EFF" size={20} />    
        </div>
        

      </div>

    
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {Tags.map((tag) => (
             
              <li key={`${tag.tag}`} className="text-light-3 small-regular">
                 <Link href={`/posts/${tag.tag}`}>
                #{tag.tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>

          
   
      <Swiper className="" slidesPerView={1}
      pagination={{
        clickable : true
    }} 
    navigation={true} modules={[Pagination]}
      >
          {
            images.map((image) => (
            <SwiperSlide key={image.url} className="">
              <Image src={image.url} className="post_details-img" width={400} height={400} alt="" />
          </SwiperSlide>
            ))
          }



      </Swiper>

    </div>
  );
};

export default PostCard;