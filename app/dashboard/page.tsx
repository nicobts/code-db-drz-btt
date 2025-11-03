import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserWorkspaces } from "@/lib/db/workspaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's workspaces
  const workspaces = await getUserWorkspaces(session.user.id);

  // If user has workspaces, redirect to the first one
  if (workspaces.length > 0) {
    redirect(`/dashboard/${workspaces[0].id}`);
  }

  // If user has no workspaces, show welcome page
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome to SaaS Starter!</CardTitle>
          <CardDescription className="text-base mt-2">
            You don't have any workspaces yet. Create your first workspace to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Create a workspace</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Workspaces help you organize your projects, team members, and
              resources in one place.
            </p>
            <Button className="mt-6" size="lg" asChild>
              <Link href="/dashboard/workspaces/new">Create Your First Workspace</Link>
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">What you can do with workspaces:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Collaborate with team members on projects</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Manage roles and permissions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Organize documents and resources</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Track analytics and team activity</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
