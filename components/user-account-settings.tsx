"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Globe } from "lucide-react";

interface UserAccountSettingsProps {
  user: {
    id: string;
    email?: string | null;
    emailVerified?: boolean;
  };
}

export function UserAccountSettings({ user }: UserAccountSettingsProps) {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [marketingEmails, setMarketingEmails] = React.useState(false);
  const [language, setLanguage] = React.useState("en");
  const [timezone, setTimezone] = React.useState("UTC");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, save these settings to the database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Account settings updated successfully");
    } catch (error) {
      toast.error("Failed to update account settings");
      console.error("Account settings error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Address */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="pl-9"
            />
          </div>
          <Button variant="outline" disabled>
            Change
          </Button>
        </div>
        {user.emailVerified ? (
          <p className="text-xs text-green-600 dark:text-green-400">
            ✓ Email verified
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Email not verified. <button className="text-primary hover:underline">Verify now</button>
          </p>
        )}
      </div>

      {/* Language Preference */}
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose your preferred language for the interface
        </p>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger id="timezone">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
            <SelectItem value="Europe/London">London (GMT)</SelectItem>
            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Your timezone for displaying dates and times
        </p>
      </div>

      {/* Email Notifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Receive emails about your account activity
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
            <p className="text-xs text-muted-foreground">
              Receive emails about new features and updates
            </p>
          </div>
          <Switch
            id="marketing-emails"
            checked={marketingEmails}
            onCheckedChange={setMarketingEmails}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Account Settings"}
        </Button>
      </div>
    </div>
  );
}
