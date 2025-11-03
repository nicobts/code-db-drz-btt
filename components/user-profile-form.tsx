"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  profile?: {
    bio?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
    website?: string | null;
  } | null;
}

export function UserProfileForm({ user, profile }: UserProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      bio: profile?.bio || "",
      avatarUrl: profile?.avatarUrl || user.image || "",
      location: profile?.location || "",
      website: profile?.website || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const result = await updateProfile({
        name: data.name,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
        location: data.location || null,
        website: data.website || null,
      });

      if (result.success) {
        toast.success("Profile updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={form.watch("avatarUrl") || user.image || undefined}
              alt={form.watch("name") || "User"}
            />
            <AvatarFallback>{getInitials(form.watch("name"))}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Profile Picture</p>
            <p className="text-xs text-muted-foreground">
              Enter an image URL below to update your profile picture
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      // In a real app, this would open a file upload dialog
                      toast.info("File upload coming soon");
                    }}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Enter the URL of your profile picture.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile. Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="San Francisco, CA" {...field} />
              </FormControl>
              <FormDescription>
                Where are you based?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://yourwebsite.com" {...field} />
              </FormControl>
              <FormDescription>
                Your personal website or portfolio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
