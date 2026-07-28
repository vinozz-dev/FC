import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ProjectCard } from '@/components/common/project-card';
import { Search, Users, Code, Component, Briefcase } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@shared/schema';

const collaborationRoles = [
  { value: 'Developer', label: 'Developer', icon: Code },
  { value: 'Designer', label: 'Designer', icon: Component },
  { value: 'Marketing', label: 'Marketing', icon: Briefcase },
  { value: 'Business', label: 'Business', icon: Users },
];

export default function CollaborationIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects', {
        headers: getAuthHeaders(),
      });
      return await response.json();
    },
  });

  const collaborationMutation = useMutation({
    mutationFn: async ({ projectId, role }: { projectId: number; role: string }) => {
      const response = await apiRequest('POST', '/api/collaborations', {
        projectId,
        role,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Collaboration request sent successfully!',
      });
      setSelectedProject(null);
      setSelectedRole('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send collaboration request',
        variant: 'destructive',
      });
    },
  });

  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesCategory && project.status === 'active';
  }) || [];

  const categories = [...new Set(projects?.map((p: any) => p.category) || [])];

  const handleCollaborate = (project: Project) => {
    setSelectedProject(project);
  };

  const handleConfirmCollaboration = () => {
    if (selectedProject && selectedRole) {
      collaborationMutation.mutate({
        projectId: selectedProject.id,
        role: selectedRole,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Collaboration Hub</h1>
          <p className="text-gray-600 mt-2">Find projects to contribute to and build amazing things together</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {collaborationRoles.map((role) => {
            const Icon = role.icon;
            const count = Math.floor(Math.random() * 50) + 10; // Mock counts
            
            return (
              <Card key={role.value}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600">{role.label} Roles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={project}
                onCollaborate={handleCollaborate}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collaboration Dialog */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Project</Label>
                <p className="text-sm text-gray-600">{selectedProject?.title}</p>
              </div>
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {collaborationRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProject(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmCollaboration}
                  disabled={!selectedRole || collaborationMutation.isPending}
                >
                  {collaborationMutation.isPending ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
