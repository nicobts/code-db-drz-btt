import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Database,
  Lock,
  Layers,
  Zap,
  Globe,
  Users,
  Shield,
  Code,
  Palette,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            <span className="text-xl font-bold">SaaS Starter</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#tech-stack"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tech Stack
            </Link>
            <Link
              href="#getting-started"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Get Started
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 space-y-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-4">
            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
            Production-Ready SaaS Template
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Build Your SaaS Product{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Faster Than Ever
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, type-safe, and production-ready SaaS starter built with
            Next.js 16, PostgreSQL, Drizzle ORM, and BetterAuth. Start building
            features, not infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Building Free
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Explore Features
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Authentication Built-in
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Type-Safe Database
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Multi-Tenant Ready
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              i18n Support
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Launch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pre-built features and integrations to accelerate your development
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Authentication & Authorization</CardTitle>
              <CardDescription>
                Complete auth system with email/password, OAuth (Google,
                GitHub), sessions, and RBAC
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Type-Safe Database</CardTitle>
              <CardDescription>
                PostgreSQL with Drizzle ORM for type-safe queries, migrations,
                and schema management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Multi-Tenancy</CardTitle>
              <CardDescription>
                Workspace management, team invitations, and role-based access
                control out of the box
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Internationalization</CardTitle>
              <CardDescription>
                Built-in i18n support with English, Italian, German, and
                Spanish translations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Beautiful UI Components</CardTitle>
              <CardDescription>
                Shadcn UI components with dark mode, fully customizable and
                accessible
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Security First</CardTitle>
              <CardDescription>
                Built-in security best practices, SQL injection prevention, and
                secure session management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Layers className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>CRUD Framework</CardTitle>
              <CardDescription>
                Reusable patterns for Create, Read, Update, Delete operations
                with server actions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Developer Experience</CardTitle>
              <CardDescription>
                TypeScript strict mode, ESLint, Prettier, and comprehensive type
                safety throughout
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>
                Next.js 16 with App Router, React Server Components, and
                Turbopack for blazing fast development
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="container py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built with Modern Technologies
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A carefully selected tech stack for performance, developer
            experience, and scalability
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Frontend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Next.js 16</span>
                <span className="text-xs text-muted-foreground">
                  App Router, RSC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">TypeScript</span>
                <span className="text-xs text-muted-foreground">
                  Strict Mode
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tailwind CSS 4</span>
                <span className="text-xs text-muted-foreground">Styling</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Shadcn UI</span>
                <span className="text-xs text-muted-foreground">
                  Components
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">next-themes</span>
                <span className="text-xs text-muted-foreground">
                  Dark Mode
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">PostgreSQL 16</span>
                <span className="text-xs text-muted-foreground">Database</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Drizzle ORM</span>
                <span className="text-xs text-muted-foreground">
                  Type-safe queries
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">BetterAuth</span>
                <span className="text-xs text-muted-foreground">
                  Authentication
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Docker</span>
                <span className="text-xs text-muted-foreground">
                  Containerization
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Actions</span>
                <span className="text-xs text-muted-foreground">API Layer</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Getting Started Section */}
      <section
        id="getting-started"
        className="container py-24 bg-muted/30"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes with our comprehensive starter template
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js, PostgreSQL, Drizzle ORM, and BetterAuth
          </p>
          <p className="mt-2">A production-ready SaaS starter template</p>
        </div>
      </footer>
    </div>
  );
}
