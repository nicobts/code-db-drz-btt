"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceInput,
} from "@/lib/validations/workspace";
import { updateWorkspace } from "@/actions/workspaces";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  domain: string | null;
};

interface WorkspaceGeneralSettingsProps {
  workspace: Workspace;
  isOwner: boolean;
}

export function WorkspaceGeneralSettings({
  workspace,
  isOwner,
}: WorkspaceGeneralSettingsProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      slug: workspace.slug,
      logoUrl: workspace.logoUrl || "",
      domain: workspace.domain || "",
    },
  });

  const onSubmit = async (data: UpdateWorkspaceInput) => {
    setIsLoading(true);
    try {
      const result = await updateWorkspace(workspace.id, data);

      if (result.success) {
        toast.success("Workspace updated successfully!");
      } else {
        toast.error(result.error || "Failed to update workspace");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Update workspace error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">General Settings</h3>
          <p className="text-sm text-muted-foreground">
            View workspace information
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workspace Name
            </p>
            <p className="mt-1">{workspace.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Slug</p>
            <p className="mt-1">{workspace.slug}</p>
          </div>
          {workspace.logoUrl && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Logo URL
              </p>
              <p className="mt-1 truncate">{workspace.logoUrl}</p>
            </div>
          )}
          {workspace.domain && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Custom Domain
              </p>
              <p className="mt-1">{workspace.domain}</p>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Only workspace owners can modify these settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your workspace information
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Acme Inc."
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  This is your workspace&apos;s display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="acme-inc"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Used in URLs. Must be unique and URL-safe.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/logo.png"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  URL to your workspace logo image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Domain (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="workspace.example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Custom domain for this workspace.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
