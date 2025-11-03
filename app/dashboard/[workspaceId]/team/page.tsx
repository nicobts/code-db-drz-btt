import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMembers, getInvitations } from "@/actions/members";
import { getWorkspace } from "@/actions/workspaces";
import { TeamMembersTable } from "@/components/team-members-table";
import { InvitationsTable } from "@/components/invitations-table";
import { InviteMemberButton } from "@/components/invite-member-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamPageProps {
  params: {
    workspaceId: string;
  };
}

async function TeamContent({ workspaceId }: { workspaceId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    notFound();
  }

  // Fetch workspace, members, and invitations in parallel
  const [workspaceResult, membersResult, invitationsResult] =
    await Promise.all([
      getWorkspace(workspaceId),
      getMembers(workspaceId),
      getInvitations(workspaceId),
    ]);

  if (!workspaceResult.success || !workspaceResult.data) {
    notFound();
  }

  const workspace = workspaceResult.data;
  const members = membersResult.success ? membersResult.data || [] : [];
  const invitations = invitationsResult.success ? invitationsResult.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage members and invitations for {workspace.name}
          </p>
        </div>
        <InviteMemberButton workspaceId={workspaceId} />
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            Members
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {members.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {invitations.filter((inv) => inv.status === "pending").length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                All members who have access to this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembersTable
                members={members}
                workspaceId={workspaceId}
                currentUserId={session.user.id}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Manage outstanding invitations to join this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvitationsTable
                invitations={invitations}
                workspaceId={workspaceId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TeamPage({ params }: TeamPageProps) {
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
      <TeamContent workspaceId={params.workspaceId} />
    </Suspense>
  );
}
