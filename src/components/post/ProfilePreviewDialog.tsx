"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/ui/avatar"

interface ProfilePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  avatarUrl: string
  name: string
  username: string
  bio: string
  followers: number
  is_following: boolean
  followUser: () => void
  unfollowUser: () => void
}

export function ProfilePreviewDialog({
  open,
  onOpenChange,
  avatarUrl,
  name,
  username,
  bio,
  followers,
  is_following,
  followUser,
  unfollowUser
}: ProfilePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">
        Profile preview
      </DialogTitle>
      <DialogContent className="w-[23%] rounded-2xl p-6 [&>button.absolute]:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground">
              @{username}
            </p>
          </div>

          <UserAvatar
            id={'post-avatar'}
            className={"w-16 h-16 cursor-pointer"}
            src={avatarUrl}
            alt={username}
            fallbackText={username.charAt(0).toUpperCase() || "U"}
          />
        </div>

        <p className="text-[15px] font-normal">{bio}</p>

        <p className="text-sm text-muted-foreground font-normal">
          {followers.toLocaleString()} followers
        </p>

        {is_following ? (
          <Button
            className="mt-1.5 py-2 w-full border bg-white text-black font-semibold rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={unfollowUser}
          >
            Unfollow
          </Button>
        ) :
          <Button
            className="mt-1.5 py-2 w-full bg-black text-white font-semibold rounded-lg cursor-pointer"
            onClick={followUser}
          >
            Follow
          </Button>
        }
      </DialogContent>
    </Dialog>
  )
}
