"use client"
import Link from "next/link";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items
}) {
  return (
    (<SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
              <Link href={`/${item.url}`}>
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>

                <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}

                
                    <span>{item.title}</span>
                
                 
          
                </SidebarMenuButton>

              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
          </Link>

        ))}
      </SidebarMenu>
    </SidebarGroup>)
  );
}
