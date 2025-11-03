"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  FolderKanban,
  LogOut,
  UserCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "@/lib/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { CreateWorkspaceDialog } from "@/components/create-workspace-dialog";
import { getMyWorkspaces } from "@/actions/workspaces";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const getNavItems = (workspaceId?: string) => {
  const baseUrl = workspaceId ? `/dashboard/${workspaceId}` : "/dashboard";

  return [
    {
      title: "Dashboard",
      url: baseUrl,
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: `${baseUrl}/projects`,
      icon: FolderKanban,
    },
    {
      title: "Team",
      url: `${baseUrl}/team`,
      icon: Users,
    },
    {
      title: "Analytics",
      url: `${baseUrl}/analytics`,
      icon: BarChart3,
    },
    {
      title: "Documents",
      url: `${baseUrl}/documents`,
      icon: FileText,
    },
    {
      title: "Settings",
      url: `${baseUrl}/settings`,
      icon: Settings,
    },
  ];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [workspaces, setWorkspaces] = React.useState<any[]>([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = React.useState<string>();
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = React.useState(true);

  React.useEffect(() => {
    async function loadWorkspaces() {
      setIsLoadingWorkspaces(true);
      try {
        const result = await getMyWorkspaces();
        if (result.success && result.data) {
          setWorkspaces(result.data);
          // Set current workspace from pathname if available
          const pathMatch = pathname.match(/\/dashboard\/([^\/]+)/);
          if (pathMatch && pathMatch[1]) {
            setCurrentWorkspaceId(pathMatch[1]);
          } else if (result.data.length > 0) {
            // Default to first workspace
            setCurrentWorkspaceId(result.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load workspaces:", error);
      } finally {
        setIsLoadingWorkspaces(false);
      }
    }

    if (session?.user) {
      loadWorkspaces();
    }
  }, [session?.user, pathname]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    router.push(`/dashboard/${workspaceId}`);
  };

  const handleCreateWorkspaceSuccess = async () => {
    // Reload workspaces after creating new one
    const result = await getMyWorkspaces();
    if (result.success && result.data) {
      setWorkspaces(result.data);
      // Navigate to newly created workspace (it will be last in array)
      const newWorkspace = result.data[result.data.length - 1];
      if (newWorkspace) {
        handleWorkspaceChange(newWorkspace.id);
      }
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">SaaS Starter</span>
                  <span className="text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="my-2" />
        <WorkspaceSwitcher
          workspaces={workspaces}
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={handleWorkspaceChange}
          onCreateWorkspace={() => setCreateDialogOpen(true)}
          isLoading={isLoadingWorkspaces}
        />
        <CreateWorkspaceDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateWorkspaceSuccess}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {getNavItems(currentWorkspaceId).map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image || undefined}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.email || ""}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${currentWorkspaceId}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Workspace Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
