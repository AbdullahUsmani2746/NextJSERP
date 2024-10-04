import React from "react";
import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import { MotionConfig } from "framer-motion";

const page = () => {
  return (
    <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
      <div className="app">
        <Sidebar />
        <Dashboard />
      </div>
    </MotionConfig>
  );
};

export default page;
