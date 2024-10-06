"use client"; // Add this line to mark the component as a Client Component

import DynamicPage from "@/app/[entity]/page";
import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import { MotionConfig } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation"; // No changes needed here

export default function Home() {
  return (
    <>
      <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
        <div className="app">
          <Sidebar />

              <Dashboard />
           
        </div>
      </MotionConfig>
    </>
  );
}
