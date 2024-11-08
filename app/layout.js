// app/layout.js
import './globals.css'; // Adjust the path if necessary for your global CSS
import { Inter } from 'next/font/google'; // Example of importing fonts, modify as needed
import { MotionConfig } from 'framer-motion';
import Sidebar from '@/components/Sidebar'; // Adjust the path to your Sidebar component
import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarProvider,
} from "@/components/ui/sidebar"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App Title', // Set your app title here
  description: 'Your App Description', // Set your app description here
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add any additional head elements like meta tags, links, or scripts */}
      </head>
      <body className={inter.className}>
      <SidebarProvider>

        <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
          <div className="app w-full">
          <AppSidebar />
            <div className="flex-1">{children}</div> {/* Main content area */}
          </div>
        </MotionConfig>
        </SidebarProvider>

      </body>
    </html>
  );
}
