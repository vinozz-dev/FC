import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { Event } from '@shared/schema';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event & { organizer?: any };
  onRegister?: (event: Event) => void;
  showActions?: boolean;
}

export const EventCard = ({ event, onRegister, showActions = true }: EventCardProps) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const isUpcoming = startDate > new Date();
  const isOngoing = startDate <= new Date() && endDate >= new Date();
  
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge 
            variant={isUpcoming ? "default" : isOngoing ? "secondary" : "outline"}
            className="text-xs"
          >
            {event.category}
          </Badge>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{format(startDate, 'MMM d')}</span>
            {startDate.toDateString() !== endDate.toDateString() && (
              <span>- {format(endDate, 'MMM d')}</span>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              {event.participantCount || 0}
              {event.maxParticipants && `/${event.maxParticipants}`} participants
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Organized by {event.organizer?.firstName} {event.organizer?.lastName}
            </span>
          </div>
          
          {showActions && onRegister && isUpcoming && (
            <Button 
              onClick={() => onRegister(event)}
              className="bg-primary hover:bg-primary/90"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Register
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
