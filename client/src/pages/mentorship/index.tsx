import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MentorCard } from '@/components/common/mentor-card';
import { Search, Users, MessageSquare } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Mentor } from '@shared/schema';

export default function MentorshipIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['/api/mentors'],
    queryFn: async () => {
      const response = await fetch('/api/mentors', {
        headers: getAuthHeaders(),
      });
      return await response.json();
    },
  });

  const connectMutation = useMutation({
    mutationFn: async (mentorId: number) => {
      const response = await apiRequest('POST', '/api/mentorships', {
        mentorId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Mentorship request sent successfully!',
      });
      setSelectedMentor(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send mentorship request',
        variant: 'destructive',
      });
    },
  });

  const filteredMentors = mentors?.filter((mentor: any) => {
    const matchesSearch = mentor.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.experience?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExpertise = expertiseFilter === 'all' || 
                           mentor.expertise?.some((skill: string) => skill.toLowerCase().includes(expertiseFilter.toLowerCase()));
    
    return matchesSearch && matchesExpertise;
  }) || [];

  const allExpertise = [...new Set(mentors?.flatMap((m: any) => m.expertise || []) || [])];

  const handleConnect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleConfirmConnect = () => {
    if (selectedMentor) {
      connectMutation.mutate(selectedMentor.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor</h1>
          <p className="text-gray-600 mt-2">Connect with experienced professionals who can guide your journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{mentors?.length || 0}</p>
                  <p className="text-sm text-gray-600">Available Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-sm text-gray-600">Support Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{allExpertise.length}</p>
                  <p className="text-sm text-gray-600">Areas of Expertise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search mentors..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  {allExpertise.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor: any) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onConnect={handleConnect}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No mentors found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connect Dialog */}
        <Dialog open={!!selectedMentor} onOpenChange={() => setSelectedMentor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect with Mentor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Send a mentorship request to{' '}
                  <strong>
                    {selectedMentor?.user?.firstName} {selectedMentor?.user?.lastName}
                  </strong>
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedMentor(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmConnect}
                  disabled={connectMutation.isPending}
                >
                  {connectMutation.isPending ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
