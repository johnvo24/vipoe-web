'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types/auth';

const editUserSchema = z.object({
  full_name: z.string().min(8, 'Name must be at least 8 characters'),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  date_of_birth: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EditUserFormData = z.infer<typeof editUserSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSubmit?: (data: EditUserFormData) => void;
  onPasswordChange?: (data: {
    old_password: string;
    new_password: string;
  }) => Promise<void>;

}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  onPasswordChange,
}: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const editForm = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || '',
      date_of_birth: user?.date_of_birth || '',
      role: user?.role || 'user',
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!open || !user) return;
    editForm.reset({
      full_name: user.full_name ?? '',
      bio: user.bio ?? '',
      phone: user.phone ?? '',
      location: user.location ?? '',
      date_of_birth: user.date_of_birth ?? '',
      role: user.role ?? 'user',
    });
  }, [user, open]);

  useEffect(() => {
    if (!open) {
      editForm.reset({
        full_name: '',
        bio: '',
        phone: '',
        location: '',
        date_of_birth: '',
        role: 'user',
      });

      passwordForm.reset({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    }
  }, [open]);

  async function handleEditSubmit(data: EditUserFormData) {
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(data: ChangePasswordFormData) {
    setIsPasswordLoading(true);
    try {
      if (onPasswordChange) {
        await onPasswordChange({
          old_password: data.oldPassword,
          new_password: data.newPassword,
        });
      }
      passwordForm.reset();
    } finally {
      setIsPasswordLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.body.style.pointerEvents = '';
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleEditSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about this user..."
                          className="resize-none"
                          rows={3}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Hue" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Change the password for this user account. They will need to use the new password on their next login.
              </p>
            </div>

            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>Minimum 8 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>Minimum 8 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="w-full"
                >
                  {isPasswordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
