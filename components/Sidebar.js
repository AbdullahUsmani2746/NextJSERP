"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LuHome,
  LuBuilding,
  LuUser,
  LuShoppingCart,
  LuBox,
  LuTag,
  LuUsers,
  LuBriefcase,
  LuClipboard,
  LuFolderOpen,
  LuChevronRight,
  LuChevronLeft,
} from "react-icons/lu";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SIDEBAR_ITEMS = [
  { id: "", title: "Dashboard", icon: LuHome },
  { id: "organizations", title: "Organization", icon: LuBuilding },
  { id: "users", title: "Users", icon: LuUser },
  { id: "products", title: "Products", icon: LuShoppingCart },
  { id: "vendors", title: "Vendors", icon: LuBriefcase },
  { id: "units", title: "Units", icon: LuBox },
  { id: "brands", title: "Brands", icon: LuTag },
  { id: "customers", title: "Customers", icon: LuUsers },
  { id: "companies", title: "Companies", icon: LuBuilding },
  { id: "product_categories", title: "Product Categories", icon: LuFolderOpen },
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Ensure pathname is defined
    const currentPath = router.pathname || "";
    const currentSegment = currentPath.split("/")[1]; // Get the first segment of the path
    setActiveTab(currentSegment || ""); // Update activeTab based on the current path
  }, [router.pathname]); // Run when the pathname changes

  return (
    <motion.div
      className="sidebar"
      animate={{ width: isCollapsed ? 80 : 280 }}
      layout
    >
      <h3>Logo</h3>
      <button
        className="sidebar__collapse-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <LuChevronRight /> : <LuChevronLeft />}
      </button>
      {SIDEBAR_ITEMS.map((item) => (
        <SidebarItem
          isSidebarCollapsed={isCollapsed}
          key={item.id}
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ))}
    </motion.div>
  );
}

function SidebarItem({ item, activeTab, setActiveTab, isSidebarCollapsed }) {
  const IconComponent = item.icon;

  return (
    <Link href={`/${item.id}`} onClick={() => setActiveTab(item.id)}>
      {" "}
      {/* Set active tab on click */}
      <motion.div
        layout
        className={clsx(
          "sidebar-item flex items-center p-2 rounded-lg transition duration-200 ease-in-out",
          {
            "sidebar-item__active":
              activeTab === item.id
                ? "bg-white-500 text-black" // Active tab color
                : "hover:bg-blue-200 hover:text-black", // Hover color
          }
        )}
        whileHover={{ scale: 1.05, backgroundColor: "#E0F7FA", color: "#000" }} // Scale and change color on hover
      >
        {activeTab === item.id ? (
          <motion.div
            layoutId="sidebar-item-indicator"
            className="sidebar-item__active-bg"
          />
        ) : null}
        <span className="sidebar-item__icon mr-2">
          <IconComponent />
        </span>
        <motion.span
          className="sidebar-item__title"
          animate={{
            clipPath: isSidebarCollapsed
              ? "inset(0% 100% 0% 0%)"
              : "inset(0% 0% 0% 0%)",
            opacity: isSidebarCollapsed ? 0 : 1,
          }}
        >
          {item.title}
        </motion.span>
      </motion.div>
    </Link>
  );
}

export default Sidebar;
