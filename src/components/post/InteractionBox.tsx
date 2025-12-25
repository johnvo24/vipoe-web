'use client'

import { formatNumber } from "@/lib/utils";
import { Bookmark, Check, Heart, ImagePlus, MessageCircleMore, Send } from "lucide-react"

interface Props {
  editMode: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
  likeCount?: number;
  commentCount?: number;
  onLikePoem?: () => void;
  onUnlikePoem?: () => void;
  onCreatePoem?: () => void;
  onAddImage?: () => void;
  onSavePoem?: () => void;
  onUnsavePoem?: () => void;
  onCommentClick?: () => void;
}

const InteractionBox = ({
  editMode,
  isLiked,
  isSaved,
  likeCount = 0,
  commentCount = 0,
  onLikePoem,
  onUnlikePoem,
  onCreatePoem,
  onAddImage,
  onSavePoem,
  onUnsavePoem,
  onCommentClick,
}: Props) => {


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
    <div className="interaction-box vi-text-third flex rounded-lg pt-0.5 ml-11 pb-1">
      { isLiked ? (
        <button onClick={onUnlikePoem} className="action-btn flex items-center vi-button px-3 gap-1">
          <Heart className="fill-current text-red-500" size={16} />
          <span className="text-sm">{ formatNumber(likeCount) }</span>
        </button>
      ) : (
        <button onClick={onLikePoem}className="action-btn flex items-center vi-button px-3 gap-1">
          <Heart className="" size={16} />
          <span className="text-sm">{ formatNumber(likeCount) }</span>
        </button>
      )}
      <button onClick={onCommentClick} className="action-btn flex items-center vi-button px-3 gap-1">
        <MessageCircleMore className="" size={16} />
        <span className="text-sm me">{ formatNumber(commentCount) }</span>
      </button>
      { isSaved ? (
        <button onClick={onUnsavePoem} className="action-btn flex vi-button px-3 gap-1">
          <Bookmark className="fill-current text-yellow-400" size={16} />
          <span className="text-sm me">{ formatNumber(46) }</span>
        </button>
      ) : (
        <button onClick={onSavePoem} className="action-btn flex vi-button px-3 gap-1">
          <Bookmark className="" size={16} />
          <span className="text-sm me">{ formatNumber(45) }</span>
        </button>
      )}
      <button className="action-btn flex vi-button px-3 gap-1">
        <Send className="" size={16} />
      </button>
    </div>
  )
}

export default InteractionBox;