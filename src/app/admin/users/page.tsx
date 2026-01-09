'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/ui/avatar';
import { MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { AddUserDialog } from '@/components/admin/add-user-dialog';
import { EditUserDialog } from '@/components/admin/edit-user-dialog';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/reduxHooks'
import { selectAuthLoading, selectToken } from '@/lib/store/auth/authSlice'
import { User } from '@/types/auth'
import { getUsers, createUser, updateUser, changeUserPassword, deleteUser } from '@/lib/api/admin';
import { toast, Toaster } from 'sonner';

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const authLoading = useAppSelector(selectAuthLoading)
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers(token!);
        setUsers(data);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    }
    fetchUsers();
  }, [token, authLoading, dispatch]);

  const handleAddUser = async (data: { full_name: string; username: string; email: string; password: string }) => {
    try {
      const newUser = await createUser(data, token!);
      setUsers([...users, newUser]);
      toast.success(`User "${data.username}" added successfully`);
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const handleEditUser = async (data: any) => {
    try {
      const updatedUser = await updateUser(selectedUser!.id, data, token!);
      setUsers(users.map(u => u.id === selectedUser!.id ? updatedUser : u));
      toast.success('User updated successfully');
      setEditUserOpen(false);
      setSelectedUser(undefined);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handlePasswordChange = async (data: {
    old_password: string;
    new_password: string;
  }) => {
    try {
      await changeUserPassword(data, token!);
      toast.success('Password updated successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update password');
      throw error;
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId, token!);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage your user accounts and permissions
          </p>
        </div>
        <Button onClick={() => setAddUserOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({users.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email Verified</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        id={'user-avatar-' + user.id}
                        className={"w-10 h-10 cursor-pointer"}
                        src={user.avt_url}
                        alt={user.username}
                        fallbackText={user.username.charAt(0).toUpperCase()}
                      />
                      <div>
                        <p className="font-medium">{user.full_name || user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span>{user.username}</span></TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'default'
                          : 'outline'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.is_verified ? 'default' : 'secondary'
                      }
                    >
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSubmit={handleAddUser}
      />

      <EditUserDialog
        open={editUserOpen}
        onOpenChange={(open) => {
          setEditUserOpen(open);
          if (!open) setSelectedUser(undefined);
        }}
        user={selectedUser}
        onSubmit={handleEditUser}
        onPasswordChange={handlePasswordChange}
      />
      <Toaster position='bottom-right' richColors />
    </div>
  );
}
