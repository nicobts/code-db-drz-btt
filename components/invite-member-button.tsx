"use client";

import * as React from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  inviteMemberSchema,
  type InviteMemberInput,
} from "@/lib/validations/member";
import { inviteMember } from "@/actions/members";

interface InviteMemberButtonProps {
  workspaceId: string;
}

export function InviteMemberButton({ workspaceId }: InviteMemberButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
      workspaceId,
    },
  });

  const onSubmit = async (data: InviteMemberInput) => {
    setIsLoading(true);
    try {
      const result = await inviteMember(data);

      if (result.success) {
        toast.success(
          `Invitation sent to ${data.email}`,
          {
            description: "They will receive an email with instructions to join.",
          }
        );
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to send invitation");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Invite member error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join this workspace via email.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="colleague@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the email address of the person you want to invite.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex flex-col">
                          <span className="font-medium">Admin</span>
                          <span className="text-xs text-muted-foreground">
                            Can manage members and settings
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex flex-col">
                          <span className="font-medium">Member</span>
                          <span className="text-xs text-muted-foreground">
                            Can view and edit workspace content
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="guest">
                        <div className="flex flex-col">
                          <span className="font-medium">Guest</span>
                          <span className="text-xs text-muted-foreground">
                            Limited access to workspace
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the role for this member.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
