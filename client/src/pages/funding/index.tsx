import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ProjectCard } from '@/components/common/project-card';
import { Plus, Search, Filter } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@shared/schema';

export default function FundingIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [fundingAmount, setFundingAmount] = useState('');
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

  const fundingMutation = useMutation({
    mutationFn: async ({ projectId, amount }: { projectId: number; amount: string }) => {
      const response = await apiRequest('POST', '/api/fundings', {
        projectId,
        amount,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: 'Success',
        description: 'Funding contributed successfully!',
      });
      setSelectedProject(null);
      setFundingAmount('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to contribute funding',
        variant: 'destructive',
      });
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
        description: 'Collaboration request sent!',
      });
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
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(projects?.map((p: any) => p.category) || [])];

  const handleFund = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCollaborate = (project: Project) => {
    collaborationMutation.mutate({
      projectId: project.id,
      role: 'Developer', // This could be made dynamic
    });
  };

  const handleFundingSubmit = () => {
    if (!selectedProject || !fundingAmount) return;
    
    fundingMutation.mutate({
      projectId: selectedProject.id,
      amount: fundingAmount,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Funding Opportunities</h1>
            <p className="text-gray-600 mt-2">Discover and support innovative projects</p>
          </div>
          <Link href="/funding/create">
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </Link>
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
                onFund={handleFund}
                onCollaborate={handleCollaborate}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Funding Dialog */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fund Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Project</Label>
                <p className="text-sm text-gray-600">{selectedProject?.title}</p>
              </div>
              <div>
                <Label htmlFor="amount">Funding Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProject(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleFundingSubmit}
                  disabled={!fundingAmount || fundingMutation.isPending}
                >
                  {fundingMutation.isPending ? 'Processing...' : 'Fund Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
