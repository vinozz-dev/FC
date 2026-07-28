import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Zap, 
  Users, 
  DollarSign, 
  Building, 
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const roles = [
    {
      name: 'Student',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      description: 'Access resources, find mentors, join hackathons, and collaborate on innovative projects',
      features: ['Project collaboration tools', 'Mentorship programs', 'Resource sharing', 'Hackathon discovery']
    },
    {
      name: 'Entrepreneur',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Launch your startup, secure funding, build teams, and scale your innovations',
      features: ['Funding opportunities', 'Team building', 'Investor connections', 'Business mentorship']
    },
    {
      name: 'Mentor',
      icon: Users,
      color: 'from-green-500 to-green-600',
      description: 'Guide the next generation of innovators and share your expertise',
      features: ['Mentorship matching', 'Knowledge sharing', 'Project reviews', 'Career guidance']
    },
    {
      name: 'Investor',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      description: 'Discover promising projects and fund the next breakthrough innovations',
      features: ['Project discovery', 'Due diligence tools', 'Portfolio tracking', 'Deal flow management']
    },
    {
      name: 'Institution',
      icon: Building,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Provide resources, support innovation programs, and connect with talent',
      features: ['Resource management', 'Talent discovery', 'Program hosting', 'Partnership building']
    },
    {
      name: 'Wantrepreneur',
      icon: Lightbulb,
      color: 'from-gray-500 to-gray-600',
      description: 'Explore ideas, learn from experts, and take your first steps into entrepreneurship',
      features: ['Idea validation', 'Learning resources', 'Community support', 'Skill development']
    }
  ];

  const stats = [
    { label: 'Active Projects', value: '2,400+' },
    { label: 'Funding Raised', value: '$12M+' },
    { label: 'Network Connections', value: '50K+' },
    { label: 'Successful Exits', value: '180+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Connect. Create. Innovate.</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join the global innovation ecosystem where students, entrepreneurs, mentors, and investors 
              collaborate to bring breakthrough ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-gray-600">Select your role to access personalized features and connect with the right community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <Card key={index} className="card-hover cursor-pointer group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{role.name}</h3>
                    <p className="text-gray-600 mb-4">{role.description}</p>
                    <ul className="space-y-2">
                      {role.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-gray-600">Everything you need to innovate and collaborate</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Funding System</h3>
              <p className="text-gray-600">Secure funding for your innovative projects through our crowdfunding platform</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mentorship Network</h3>
              <p className="text-gray-600">Connect with experienced mentors who can guide your journey</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resource Sharing</h3>
              <p className="text-gray-600">Access equipment, tools, and resources from institutions and community</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Innovation Journey?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of innovators who are already building the future</p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Join FusionCircle Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
