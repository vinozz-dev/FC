import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Package, Laptop, Wrench, Camera, Plus } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Resource } from '@shared/schema';

const resourceIcons = {
  'Hardware': Laptop,
  'IoT': Package,
  'Video Equipment': Camera,
  'Tools': Wrench,
  'Default': Package,
};

export default function ResourcesIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/resources'],
    queryFn: async () => {
      const response = await fetch('/api/resources', {
        headers: getAuthHeaders(),
      });
      return await response.json();
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      const response = await apiRequest('POST', '/api/resource-requests', {
        resourceId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Resource request sent successfully!',
      });
      setSelectedResource(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send resource request',
        variant: 'destructive',
      });
    },
  });

  const filteredResources = resources?.filter((resource: any) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    return matchesSearch && matchesCategory && resource.available;
  }) || [];

  const categories = [...new Set(resources?.map((r: any) => r.category) || [])];

  const handleRequest = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleConfirmRequest = () => {
    if (selectedResource) {
      requestMutation.mutate(selectedResource.id);
    }
  };

  const getResourceIcon = (category: string) => {
    const Icon = resourceIcons[category as keyof typeof resourceIcons] || resourceIcons.Default;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resource Sharing Hub</h1>
          <p className="text-gray-600 mt-2">Access equipment, tools, and resources from institutions and community members</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Laptop className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {resources?.filter((r: any) => r.category === 'Hardware').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Hardware</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {resources?.filter((r: any) => r.category === 'IoT').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">IoT Devices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {resources?.filter((r: any) => r.category === 'Video Equipment').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Video Equipment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Wrench className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {resources?.filter((r: any) => r.category === 'Tools').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Tools</p>
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
                    placeholder="Search resources..."
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

        {/* Resources Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map((resource: any) => {
              const Icon = getResourceIcon(resource.category);
              const availableCount = Math.floor(Math.random() * 20) + 1; // Mock availability
              
              return (
                <Card key={resource.id} className="card-hover cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={availableCount > 10 ? "default" : availableCount > 5 ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {availableCount} available
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequest(resource)}
                      >
                        Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Request Dialog */}
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Send a request for{' '}
                  <strong>{selectedResource?.name}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedResource?.description}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedResource(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmRequest}
                  disabled={requestMutation.isPending}
                >
                  {requestMutation.isPending ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
