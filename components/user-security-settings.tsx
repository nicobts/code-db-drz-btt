"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Lock, Shield, Smartphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface UserSecuritySettingsProps {
  user: {
    id: string;
  };
}

export function UserSecuritySettings({ user }: UserSecuritySettingsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    try {
      // In a real app, call the password change API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password updated successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to update password");
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEnable2FA = async () => {
    try {
      // In a real app, this would initiate 2FA setup
      toast.info("Two-factor authentication setup coming soon");
      setTwoFactorEnabled(true);
    } catch (error) {
      toast.error("Failed to enable two-factor authentication");
    }
  };

  const handleDisable2FA = async () => {
    try {
      // In a real app, this would disable 2FA
      toast.info("Two-factor authentication disabled");
      setTwoFactorEnabled(false);
    } catch (error) {
      toast.error("Failed to disable two-factor authentication");
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          <h3 className="text-lg font-medium">Change Password</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters with uppercase, lowercase,
                    number, and special character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">
                  Authenticator App
                  {twoFactorEnabled && (
                    <Badge variant="default" className="ml-2">
                      Enabled
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Use an authenticator app to generate one-time codes
                </CardDescription>
              </div>
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {twoFactorEnabled ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication is currently enabled on your account.
                </p>
                <Button variant="destructive" onClick={handleDisable2FA}>
                  Disable 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </p>
                <Button onClick={handleEnable2FA}>Enable 2FA</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <Button variant="outline" size="sm">
            Sign out all devices
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-xs text-muted-foreground">
                    Your current browser session
                  </p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
