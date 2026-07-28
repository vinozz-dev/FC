import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Reel } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface ReelCardProps {
  reel: Reel & { author?: any; isLiked?: boolean };
  onLike?: (reel: Reel) => void;
  onComment?: (reel: Reel) => void;
  onShare?: (reel: Reel) => void;
}

export const ReelCard = ({ reel, onLike, onComment, onShare }: ReelCardProps) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked || false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(reel);
  };

  const timeAgo = reel.createdAt 
    ? formatDistanceToNow(new Date(reel.createdAt), { addSuffix: true })
    : '';

  return (
    <Card className="card-hover">
      <CardContent className="p-0">
        {reel.mediaType === 'image' ? (
          <img 
            src={reel.media} 
            alt={reel.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <video 
            src={reel.media}
            className="w-full h-48 object-cover rounded-t-lg"
            controls
          />
        )}
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={reel.author?.profileImage} />
                <AvatarFallback className="text-xs">
                  {reel.author?.firstName?.[0]}{reel.author?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {reel.author?.firstName} {reel.author?.lastName}
                </p>
                <p className="text-xs text-gray-500">@{reel.author?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{timeAgo}</span>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <h3 className="font-medium text-gray-900 mb-2">{reel.title}</h3>
          <p className="text-gray-600 mb-3">{reel.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : 'text-gray-600'}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{reel.likes || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment?.(reel)}
                className="text-gray-600"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{reel.comments || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(reel)}
                className="text-gray-600"
              >
                <Share2 className="w-4 h-4 mr-1" />
                <span className="text-sm">{reel.shares || 0}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
