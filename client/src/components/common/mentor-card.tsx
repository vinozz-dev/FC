import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageCircle } from 'lucide-react';
import { Mentor } from '@shared/schema';

interface MentorCardProps {
  mentor: Mentor & { user?: any };
  onConnect?: (mentor: Mentor) => void;
  showActions?: boolean;
}

export const MentorCard = ({ mentor, onConnect, showActions = true }: MentorCardProps) => {
  const rating = parseFloat(mentor.rating || "0");
  
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="w-16 h-16 mr-4">
            <AvatarImage src={mentor.user?.profileImage} />
            <AvatarFallback className="text-lg">
              {mentor.user?.firstName?.[0]}{mentor.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {mentor.user?.firstName} {mentor.user?.lastName}
            </h3>
            <p className="text-sm text-gray-600">{mentor.experience}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {mentor.expertise?.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{mentor.user?.bio}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({mentor.totalReviews || 0} reviews)
            </span>
          </div>
          
          {showActions && onConnect && (
            <Button 
              size="sm"
              onClick={() => onConnect(mentor)}
              className="bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
