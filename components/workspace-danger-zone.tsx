"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { deleteWorkspace } from "@/actions/workspaces";

type Workspace = {
  id: string;
  name: string;
};

interface WorkspaceDangerZoneProps {
  workspace: Workspace;
  workspaceId: string;
}

export function WorkspaceDangerZone({
  workspace,
  workspaceId,
}: WorkspaceDangerZoneProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [confirmationText, setConfirmationText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (confirmationText !== workspace.name) {
      toast.error("Workspace name doesn't match");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteWorkspace({
        workspaceId,
        confirmationText,
      });

      if (result.success) {
        toast.success("Workspace deleted successfully");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to delete workspace");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete workspace error:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setConfirmationText("");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-lg font-medium">Danger Zone</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Irreversible and destructive actions
        </p>

        <div className="rounded-lg border border-destructive p-4 space-y-4">
          <div>
            <h4 className="font-medium text-destructive">Delete Workspace</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Once you delete a workspace, there is no going back. All data,
              members, and settings will be permanently deleted.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Workspace
          </Button>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Workspace
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong>{workspace.name}</strong> workspace and remove all
              associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type <strong>{workspace.name}</strong> to confirm
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={workspace.name}
                disabled={isDeleting}
              />
            </div>
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <p className="font-medium">Warning: This will delete:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>All workspace members and invitations</li>
                <li>All workspace data and settings</li>
                <li>All associated projects and content</li>
                <li>All audit logs and history</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setConfirmationText("");
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmationText !== workspace.name || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
