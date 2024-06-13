
import Image from "next/image";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
    <div className="flex justify-between items-center">
   
    <section className="flex flex-1 justify-center items-center flex-col">
     {children}
     </section>
     <Image src={'/assets/images/side-img.svg'} width={300} height={300} alt="" className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat" />
     </div>
    </>
  );
}        
