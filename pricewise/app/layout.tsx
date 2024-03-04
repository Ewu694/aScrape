import type { Metadata } from "next";
import { Inter, Space_Grotesk} from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'], weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {//used to change title and description of project
  title: "Pricewise", //title of project
  description: "Track product prices effortlessly and save money on your online shopping", //description of project
};

export default function RootLayout({ //layout is useful for allowing us to access whatever we make in the layout page accessible throughout other pages
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <main className="max-w-10xl mx-auto"> 
        <Navbar />
        {children}
       </main>
      </body>
    </html>
  );
}
