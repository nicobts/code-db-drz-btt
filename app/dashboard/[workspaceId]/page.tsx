import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  Users,
  CreditCard,
  Activity,
  DollarSign,
  FolderKanban,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getWorkspaceById } from "@/lib/db/workspaces";
import { getWorkspaceMembers } from "@/lib/db/members";
import { getWorkspaceInvitations } from "@/lib/db/invitations";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface WorkspaceDashboardPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

// Sample data for charts (in real app, fetch from database)
const monthlyData = [
  { month: "Jan", revenue: 4500, users: 120 },
  { month: "Feb", revenue: 5200, users: 145 },
  { month: "Mar", revenue: 4800, users: 138 },
  { month: "Apr", revenue: 6100, users: 167 },
  { month: "May", revenue: 7200, users: 189 },
  { month: "Jun", revenue: 8500, users: 210 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default async function WorkspaceDashboardPage({
  params,
}: WorkspaceDashboardPageProps) {
  const { workspaceId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch workspace data
  const workspace = await getWorkspaceById(workspaceId, session.user.id);

  if (!workspace) {
    notFound();
  }

  // Fetch workspace stats in parallel
  const [members, invitations] = await Promise.all([
    getWorkspaceMembers(workspaceId, session.user.id),
    getWorkspaceInvitations(workspaceId, session.user.id),
  ]);

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
          <Badge variant="outline">{workspace.slug}</Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your workspace
          today.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingInvitations.length} pending invitations
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2 p-0 h-auto"
              asChild
            >
              <Link href={`/dashboard/${workspaceId}/team`}>
                Manage team <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 active this week</p>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.filter((m) => m.userId).length}</div>
            <p className="text-xs text-muted-foreground">Team members online</p>
            <Progress value={45} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Workspace activity for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Growth</CardTitle>
            <CardDescription>New members per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="users"
                    fill="var(--color-users)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex-1">
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Current members in this workspace
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/${workspaceId}/team`}>
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.slice(0, 5).map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.user?.name || "N/A"}
                  </TableCell>
                  <TableCell>{member.user?.email || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.role === "owner"
                          ? "default"
                          : member.role === "admin"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {members.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/${workspaceId}/team`}>
                  View all {members.length} members
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workspace Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
          <CardDescription>Information about this workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Workspace ID</p>
              <p className="text-sm text-muted-foreground font-mono">
                {workspace.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(workspace.createdAt).toLocaleDateString()}
              </p>
            </div>
            {workspace.domain && (
              <div>
                <p className="text-sm font-medium">Domain</p>
                <p className="text-sm text-muted-foreground">
                  {workspace.domain}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Your Role</p>
              <Badge
                variant={
                  workspace.userRole === "owner"
                    ? "default"
                    : workspace.userRole === "admin"
                    ? "secondary"
                    : "outline"
                }
              >
                {workspace.userRole}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
