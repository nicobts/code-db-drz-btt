"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import { revokeInvitation } from "@/actions/members";

type Invitation = {
  id: string;
  email: string;
  role: "owner" | "admin" | "member" | "guest";
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: Date;
  expiresAt: Date;
  inviterName: string;
  inviterEmail: string;
};

interface InvitationsTableProps {
  invitations: Invitation[];
  workspaceId: string;
}

export function InvitationsTable({
  invitations,
  workspaceId,
}: InvitationsTableProps) {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleRevokeInvitation = async (invitationId: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke the invitation to ${email}?`)) {
      return;
    }

    setIsLoading(invitationId);
    try {
      const result = await revokeInvitation({
        workspaceId,
        invitationId,
      });

      if (result.success) {
        toast.success("Invitation revoked successfully");
      } else {
        toast.error(result.error || "Failed to revoke invitation");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle2 className="h-4 w-4" />;
      case "declined":
        return <XCircle className="h-4 w-4" />;
      case "expired":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
        return "default";
      case "declined":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("email")}</span>
            <span className="text-xs text-muted-foreground">
              Invited by {row.original.inviterName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <Badge variant="outline" className="capitalize">{role}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={getStatusVariant(status)} className="gap-1 capitalize">
            {getStatusIcon(status)}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Sent",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => {
        const date = new Date(row.getValue("expiresAt"));
        const isExpired = date < new Date();
        return (
          <span
            className={`text-sm ${
              isExpired ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invitation = row.original;
        const isPending = invitation.status === "pending";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isLoading === invitation.id}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(invitation.email)}
              >
                Copy email
              </DropdownMenuItem>
              {isPending && (
                <>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() =>
                      handleRevokeInvitation(invitation.id, invitation.email)
                    }
                  >
                    Revoke invitation
                  </DropdownMenuItem>
                </>
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
      data={invitations}
      searchKey="email"
      searchPlaceholder="Search invitations..."
    />
  );
}
