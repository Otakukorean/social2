import "~/styles/globals.css";
import { SessionProvider } from 'next-auth/react'

import { auth } from '../auth'
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
    <html lang="en" className={``}>
      <body>
        <TRPCReactProvider>
          {children}
          <Toaster />

          </TRPCReactProvider>
          
      </body>
    </html>
    </SessionProvider>
  );
}
