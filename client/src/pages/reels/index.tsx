import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ReelCard } from '@/components/common/reel-card';
import { Plus, Play, Image as ImageIcon, TrendingUp } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertReelSchema, Reel } from '@shared/schema';

export default function ReelsIndex() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reels, isLoading } = useQuery({
    queryKey: ['/api/reels'],
    queryFn: async () => {
      const response = await fetch('/api/reels', {
        headers: getAuthHeaders(),
      });
      return await response.json();
    },
  });

  const form = useForm({
    resolver: zodResolver(insertReelSchema),
    defaultValues: {
      title: '',
      description: '',
      media: '',
      mediaType: 'image',
    },
  });

  const createReelMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/reels', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reels'] });
      toast({
        title: 'Success',
        description: 'Reel created successfully!',
      });
      setCreateDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create reel',
        variant: 'destructive',
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (reelId: number) => {
      const response = await apiRequest('POST', `/api/reels/${reelId}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reels'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async ({ reelId, comment }: { reelId: number; comment: string }) => {
      const response = await apiRequest('POST', `/api/reels/${reelId}/comment`, { comment });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reels'] });
      toast({
        title: 'Success',
        description: 'Comment added successfully!',
      });
    },
  });

  const handleLike = (reel: Reel) => {
    likeMutation.mutate(reel.id);
  };

  const handleComment = (reel: Reel) => {
    // For now, just add a placeholder comment
    commentMutation.mutate({
      reelId: reel.id,
      comment: 'Great work!',
    });
  };

  const handleShare = (reel: Reel) => {
    // Simple share functionality
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        text: reel.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Share link copied to clipboard',
      });
    }
  };

  const onSubmit = (data: any) => {
    createReelMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Innovation Reels</h1>
            <p className="text-gray-600 mt-2">Discover and share short videos of breakthrough innovations</p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Reel
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{reels?.length || 0}</p>
                  <p className="text-sm text-gray-600">Total Reels</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reels?.reduce((sum: number, reel: any) => sum + (reel.likes || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reels?.reduce((sum: number, reel: any) => sum + (reel.comments || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Comments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reels?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((reel: any) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Play className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No reels yet</h3>
                <p>Be the first to share your innovation story!</p>
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="mt-4"
                >
                  Create First Reel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Reel Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Reel</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter reel title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your innovation..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/media.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createReelMutation.isPending}
                  >
                    {createReelMutation.isPending ? 'Creating...' : 'Create Reel'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
