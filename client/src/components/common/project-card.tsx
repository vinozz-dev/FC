import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, DollarSign, Users } from 'lucide-react';
import { Project } from '@shared/schema';

interface ProjectCardProps {
  project: Project & { creator?: any; fundings?: any[] };
  onFund?: (project: Project) => void;
  onCollaborate?: (project: Project) => void;
  showActions?: boolean;
}

export const ProjectCard = ({ project, onFund, onCollaborate, showActions = true }: ProjectCardProps) => {
  const fundingProgress = project.fundingGoal 
    ? (parseFloat(project.fundingRaised || "0") / parseFloat(project.fundingGoal)) * 100
    : 0;

  const daysLeft = project.deadline 
    ? Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className="card-hover">
      <CardContent className="p-0">
        {project.image && (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary">{project.category}</Badge>
            {daysLeft !== null && (
              <span className="text-sm text-gray-500">
                {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-gray-900">{project.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
          
          {project.fundingGoal && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  ${parseFloat(project.fundingRaised || "0").toLocaleString()} raised
                </span>
                <span className="text-gray-600">
                  ${parseFloat(project.fundingGoal).toLocaleString()} goal
                </span>
              </div>
              <Progress value={fundingProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.creator?.profileImage} />
                <AvatarFallback className="text-xs">
                  {project.creator?.firstName?.[0]}{project.creator?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                {project.creator?.firstName} {project.creator?.lastName}
              </span>
            </div>
            
            {showActions && (
              <div className="flex space-x-2">
                {onFund && (
                  <Button 
                    size="sm" 
                    onClick={() => onFund(project)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Fund
                  </Button>
                )}
                {onCollaborate && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onCollaborate(project)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Collaborate
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
