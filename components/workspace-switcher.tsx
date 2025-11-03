"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: "owner" | "admin" | "member" | "guest";
};

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  currentWorkspaceId?: string;
  onWorkspaceChange?: (workspaceId: string) => void;
  onCreateWorkspace?: () => void;
}

export function WorkspaceSwitcher({
  workspaces,
  currentWorkspaceId,
  onWorkspaceChange,
  onCreateWorkspace,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);

  const currentWorkspace = workspaces.find(
    (ws) => ws.id === currentWorkspaceId
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "text-blue-600";
      case "admin":
        return "text-purple-600";
      case "member":
        return "text-green-600";
      case "guest":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a workspace"
          className="w-full justify-between"
        >
          {currentWorkspace ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={currentWorkspace.logoUrl || undefined}
                  alt={currentWorkspace.name}
                />
                <AvatarFallback className="text-xs">
                  {getInitials(currentWorkspace.name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{currentWorkspace.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select workspace...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace..." />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  onSelect={() => {
                    if (onWorkspaceChange) {
                      onWorkspaceChange(workspace.id);
                    }
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={workspace.logoUrl || undefined}
                      alt={workspace.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(workspace.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{workspace.name}</span>
                      <span
                        className={cn(
                          "text-xs capitalize",
                          getRoleBadgeColor(workspace.role)
                        )}
                      >
                        {workspace.role}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentWorkspaceId === workspace.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  if (onCreateWorkspace) {
                    onCreateWorkspace();
                  }
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
