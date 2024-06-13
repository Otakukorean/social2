import LeftSidebar from "~/components/LeftSidebar";
import TopBar from "~/components/TopBar";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <div className="w-full md:flex h-full">
      <TopBar />
      <LeftSidebar />
      <section className={`flex  flex-1 h-full`}>
        {children}
      </section>
    </div>
  );
}        
