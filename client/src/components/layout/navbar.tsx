import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { RoleBadge } from '@/components/common/role-badge';

export const Navbar = () => {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', current: location === '/dashboard' },
    { name: 'Projects', href: '/projects', current: location === '/projects' },
    { name: 'Funding', href: '/funding', current: location === '/funding' },
    { name: 'Mentorship', href: '/mentorship', current: location === '/mentorship' },
    { name: 'Resources', href: '/resources', current: location === '/resources' },
    { name: 'Events', href: '/events', current: location === '/events' },
    { name: 'Reels', href: '/reels', current: location === '/reels' },
  ];

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FC</span>
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-900">FusionCircle</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">FC</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">FusionCircle</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navigationItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={item.current ? 'default' : 'ghost'}
                      className="text-sm font-medium"
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search projects, mentors, events..."
                className="w-64 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <RoleBadge role={user?.role || 'student'} />
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={item.current ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
