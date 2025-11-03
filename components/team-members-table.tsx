"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Shield, Crown, User, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import { updateMemberRole, removeMember } from "@/actions/members";
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  profileFullName: string | null;
  profileAvatarUrl: string | null;
  role: "owner" | "admin" | "member" | "guest";
  joinedAt: Date;
};

interface TeamMembersTableProps {
  members: Member[];
  workspaceId: string;
  currentUserId: string;
}

export function TeamMembersTable({
  members,
  workspaceId,
  currentUserId,
}: TeamMembersTableProps) {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: "admin" | "member" | "guest") => {
    setIsLoading(userId);
    try {
      const result = await updateMemberRole({
        workspaceId,
        userId,
        newRole,
      });

      if (result.success) {
        toast.success("Member role updated successfully");
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from this workspace?`)) {
      return;
    }

    setIsLoading(userId);
    try {
      const result = await removeMember({
        workspaceId,
        userId,
      });

      if (result.success) {
        toast.success("Member removed successfully");
      } else {
        toast.error(result.error || "Failed to remove member");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "member":
        return <User className="h-4 w-4" />;
      case "guest":
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "member":
        return "outline";
      case "guest":
        return "outline";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "userName",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        const displayName =
          member.profileFullName || member.userName || member.userEmail;
        const initials = displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={member.profileAvatarUrl || member.userImage || undefined}
                alt={displayName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{displayName}</span>
              <span className="text-sm text-muted-foreground">
                {member.userEmail}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge
            variant={getRoleBadgeVariant(role)}
            className={cn("gap-1 capitalize")}
          >
            {getRoleIcon(role)}
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.getValue("joinedAt"));
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;
        const isCurrentUser = member.userId === currentUserId;
        const isOwner = member.role === "owner";
        const canModify = !isCurrentUser && !isOwner;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isLoading === member.userId}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(member.userEmail)}
              >
                Copy email
              </DropdownMenuItem>
              {canModify && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                  {member.role !== "admin" && (
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(member.userId, "admin")}
                    >
                      Make Admin
                    </DropdownMenuItem>
                  )}
                  {member.role !== "member" && (
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(member.userId, "member")}
                    >
                      Make Member
                    </DropdownMenuItem>
                  )}
                  {member.role !== "guest" && (
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(member.userId, "guest")}
                    >
                      Make Guest
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() =>
                      handleRemoveMember(
                        member.userId,
                        member.profileFullName || member.userName
                      )
                    }
                  >
                    Remove from workspace
                  </DropdownMenuItem>
                </>
              )}
              {isCurrentUser && (
                <DropdownMenuItem disabled className="text-muted-foreground">
                  You cannot modify yourself
                </DropdownMenuItem>
              )}
              {isOwner && !isCurrentUser && (
                <DropdownMenuItem disabled className="text-muted-foreground">
                  Cannot modify owner
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={members}
      searchKey="userName"
      searchPlaceholder="Search members..."
    />
  );
}
