import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventCard } from '@/components/common/event-card';
import { Search, Calendar, Trophy, Globe, MapPin } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@shared/schema';

export default function EventsIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const response = await fetch('/api/events', {
        headers: getAuthHeaders(),
      });
      return await response.json();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await apiRequest('POST', `/api/events/${eventId}/register`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Success',
        description: 'Successfully registered for the event!',
      });
      setSelectedEvent(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to register for the event',
        variant: 'destructive',
      });
    },
  });

  const filteredEvents = events?.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || event.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  }) || [];

  const categories = [...new Set(events?.map((e: any) => e.category) || [])];
  const locations = [...new Set(events?.map((e: any) => e.location) || [])];

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleConfirmRegistration = () => {
    if (selectedEvent) {
      registerMutation.mutate(selectedEvent.id);
    }
  };

  const upcomingEvents = filteredEvents.filter((event: any) => new Date(event.startDate) > new Date());
  const ongoingEvents = filteredEvents.filter((event: any) => 
    new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hackathons & Events</h1>
          <p className="text-gray-600 mt-2">Join global competitions and showcase your innovative solutions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{ongoingEvents.length}</p>
                  <p className="text-sm text-gray-600">Ongoing Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {events?.filter((e: any) => e.location.toLowerCase().includes('virtual')).length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Virtual Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
                  <p className="text-sm text-gray-600">Locations</p>
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
                    placeholder="Search events..."
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
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
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
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register for Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Register for{' '}
                  <strong>{selectedEvent?.title}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedEvent?.description}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedEvent(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmRegistration}
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Registering...' : 'Register Now'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
