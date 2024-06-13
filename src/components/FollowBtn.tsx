import React from 'react'
import { Button } from './ui/button';
import { api } from '~/trpc/react';
import { toast } from './ui/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';


interface FollowBtnProps {
    userId : string;
}

const FollowBtn : React.FC<FollowBtnProps> = ({userId}) => {
    const session = useSession()
    const queryClient = useQueryClient()
    const Follow = api.follow.create.useMutation({
        onError : () => {
            toast({title : "Error",description :"Something went wrong!"})
        }
    })
    const ifFollowing = api.follow.ifFollow.useQuery({
        followingId : userId
    })
    const onClick =async () => {
        await Follow.mutateAsync({
            followingId : userId
        })
        ifFollowing.refetch();
        queryClient.invalidateQueries()
      
    }
    const canFollow = session?.data?.user.id !== userId 

    if(!canFollow){
        return null
    }
  return (
    <>
    {
        ifFollowing.data?.followingId === userId ? (
            <Button onClick={onClick} variant={'destructive'} className="w-[80px] h-[30px]">UnFollow</Button>

        ) : (
            <Button onClick={onClick} className="bg-primary-500 w-[60px] h-[30px]">Follow</Button>
        )
    }
 
    </>
  )
}

export default FollowBtn