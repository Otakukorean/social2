import Image from "next/image";
import Link from "next/link";
import { cn } from "~/lib/utils";
import {motion} from 'framer-motion'
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  images,
  id
}: {
  className?: string;
  images: {url : string}[] ,
  id : string;
}) => {
  return (
    <motion.div
      layout
      className={cn(
        "row-span-1 relative rounded-xl cursor-pointer group/bento hover:shadow-xl  duration-200 shadow-input dark:shadow-none  bg-black   justify-between flex flex-col space-y-4 w-full h-full hover:scale-[1.02] transition",
        className
      )}
    >

     <Image src={images[0]?.url as string} width={10000} height={100000} 
     className="w-full h-full rounded-[30px] object-cover  " 
     alt="img" />
      {images.length > 1 && (
        <Image src={'/assets/images/Carousel.png'}  width={24} height={24} alt="Carousel" className="absolute top-[24px] right-[24px]" />
      )}
  
    </motion.div>
  );
};
