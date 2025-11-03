import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWorkspace } from "@/actions/workspaces";
import { isWorkspaceOwner } from "@/lib/db/members";
import { WorkspaceGeneralSettings } from "@/components/workspace-general-settings";
import { WorkspaceDangerZone } from "@/components/workspace-danger-zone";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings, Shield, CreditCard, AlertTriangle } from "lucide-react";

interface SettingsPageProps {
  params: {
    workspaceId: string;
  };
}

async function SettingsContent({ workspaceId }: { workspaceId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    notFound();
  }

  // Fetch workspace
  const workspaceResult = await getWorkspace(workspaceId);

  if (!workspaceResult.success || !workspaceResult.data) {
    notFound();
  }

  const workspace = workspaceResult.data;
  const isOwner = await isWorkspaceOwner(workspaceId, session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          {isOwner && (
            <TabsTrigger value="danger" className="gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <WorkspaceGeneralSettings
              workspace={workspace}
              isOwner={isOwner}
            />
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure security and access controls
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all workspace members
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Coming soon
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">IP Whitelist</p>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Coming soon
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Auto logout after inactivity
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Coming soon
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Billing & Subscription</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and billing information
                </p>
              </div>
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">Free Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Currently on the free plan
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Upgrade coming soon
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {isOwner && (
          <TabsContent value="danger" className="space-y-4">
            <Card className="p-6 border-destructive">
              <WorkspaceDangerZone
                workspace={workspace}
                workspaceId={workspaceId}
              />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default function SettingsPage({ params }: SettingsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      }
    >
      <SettingsContent workspaceId={params.workspaceId} />
    </Suspense>
  );
}
