import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeadForm } from '@/components/LeadForm';
import { Home, User, Phone, Mail, MapPin, Calendar, DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock recent leads data for demonstration
const recentLeads = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    propertyType: 'Apartment',
    propertyArea: 'Downtown',
    budget: '$400K - $600K',
    status: 'new',
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@email.com',
    propertyType: 'House',
    propertyArea: 'Suburbs',
    budget: '$600K - $800K',
    status: 'contacted',
    date: '2024-01-14'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    phone: '+1 (555) 345-6789',
    email: 'emily.rodriguez@email.com',
    propertyType: 'Condo',
    propertyArea: 'Waterfront',
    budget: '$800K - $1M',
    status: 'qualified',
    date: '2024-01-13'
  }
];

const stats = [
  {
    title: 'Total Leads',
    value: '1,247',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Users
  },
  {
    title: 'This Month',
    value: '186',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Calendar
  },
  {
    title: 'Conversion Rate',
    value: '23.8%',
    change: '-2.1%',
    changeType: 'negative' as const,
    icon: Target
  },
  {
    title: 'Avg. Property Value',
    value: '$650K',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: TrendingUp
  }
];

export default function Leads() {
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'contacted':
        return <Badge variant="outline">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="default">Qualified</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChangeColor = (changeType: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Property Leads</h1>
                <p className="text-muted-foreground">Manage and track your property inquiries</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {showForm ? 'View Leads' : 'Add New Lead'}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showForm ? (
          /* Lead Form */
          <div className="max-w-2xl mx-auto">
            <LeadForm 
              onSuccess={(leadId) => {
                console.log('Lead submitted:', leadId);
                setShowForm(false);
              }}
            />
          </div>
        ) : (
          /* Leads Dashboard */
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                          <p className={cn("text-sm", getChangeColor(stat.changeType))}>
                            {stat.change} from last month
                          </p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Leads */}
            <Card className="bg-gradient-card shadow-widget border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground">{lead.name}</div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {lead.propertyType}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {lead.propertyArea}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {lead.budget}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(lead.status)}
                          <div className="text-sm text-muted-foreground">
                            {new Date(lead.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    View All Leads
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
                    <Home className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Property Listings</h3>
                  <p className="text-sm text-muted-foreground">Browse available properties</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-success rounded-full w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Market Analytics</h3>
                  <p className="text-sm text-muted-foreground">View market trends and insights</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-info rounded-full w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Client Management</h3>
                  <p className="text-sm text-muted-foreground">Manage client relationships</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}