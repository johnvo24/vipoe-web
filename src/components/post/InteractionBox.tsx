'use client'

import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { Bookmark, Check, Heart, ImagePlus, MessageCircleMore, Send } from "lucide-react"
import { ShareAsImageModal } from "../share/ShareAsImageModal";

interface Props {
  editMode: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
  likeCount?: number;
  commentCount?: number;
  saveCount?: number;
  onLikePoem?: () => void;
  onUnlikePoem?: () => void;
  onCreatePoem?: () => void;
  onAddImage?: () => void;
  onSavePoem?: () => void;
  onUnsavePoem?: () => void;
  onCommentClick?: () => void;
  poemData?: any;
  isMargin?: boolean;
}

const InteractionBox = ({
  editMode,
  isLiked,
  isSaved,
  likeCount = 0,
  commentCount = 0,
  saveCount = 0,
  onLikePoem,
  onUnlikePoem,
  onCreatePoem,
  onAddImage,
  onSavePoem,
  onUnsavePoem,
  onCommentClick,
  poemData,
  isMargin = true,
}: Props) => {
  const [open, setOpen] = useState(false)

  if (editMode) return (
    <div className="interaction-box vi-text-third flex items-center rounded-lg pt-0.5 ml-11 mr-6 pb-1 justify-between">
      <button onClick={() => onAddImage} className="action-btn vi-button flex items-center gap-1 px-3">
        <ImagePlus className="text-gray-600" size={20} />
      </button>
      <button
        onClick={onCreatePoem}
        className="action-btn vi-button items-center gap-1 px-4 h-7 text-white bg-gradient-to-br from-green-600 via-green-500 to-green-300"
      >
        <Check className="stroke-3" size={16} />
        <span className="text-xs font-bold">PUBLISH</span>
      </button>
    </div>
  )

  return (
    <div className={`interaction-box flex rounded-lg pt-0.5 pb-1 ${isMargin ? 'vi-text-third ml-11' : ''}`}>
      {isLiked ? (
        <button onClick={onUnlikePoem} className="action-btn flex items-center vi-button px-3 gap-1">
          <Heart className="fill-current text-red-500" size={16} />
          <span className="text-sm">{formatNumber(likeCount)}</span>
        </button>
      ) : (
        <button onClick={onLikePoem} className="action-btn flex items-center vi-button px-3 gap-1">
          <Heart className="" size={16} />
          <span className="text-sm">{formatNumber(likeCount)}</span>
        </button>
      )}
      <button onClick={onCommentClick} className="action-btn flex items-center vi-button px-3 gap-1">
        <MessageCircleMore className="" size={16} />
        <span className="text-sm me">{formatNumber(commentCount)}</span>
      </button>
      {isSaved ? (
        <button onClick={onUnsavePoem} className="action-btn flex vi-button px-3 gap-1">
          <Bookmark className="fill-current text-yellow-400" size={16} />
          <span className="text-sm me">{formatNumber(saveCount)}</span>
        </button>
      ) : (
        <button onClick={onSavePoem} className="action-btn flex vi-button px-3 gap-1">
          <Bookmark className="" size={16} />
          <span className="text-sm me">{formatNumber(saveCount)}</span>
        </button>
      )}
      <button className="action-btn flex vi-button px-3 gap-1" onClick={() => setOpen(true)}>
        <Send className="" size={16} />
      </button>
      <ShareAsImageModal
        open={open}
        onClose={() => setOpen(false)}
        poemData={poemData}
      />
    </div>
  )
}

export default InteractionBox;