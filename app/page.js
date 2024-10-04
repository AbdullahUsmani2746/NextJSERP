import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import { MotionConfig } from "framer-motion";

export default function Home() {
  return (
    <>
      <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
        <div className="app">
          <Sidebar />
          {/* <Dashboard /> */}
        </div>
      </MotionConfig>
    </>
  );
}
