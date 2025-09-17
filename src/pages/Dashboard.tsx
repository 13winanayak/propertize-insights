import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetKPI } from '@/components/widgets/WidgetKPI';
import { WidgetLineChart } from '@/components/widgets/WidgetLineChart';
import { WidgetTable } from '@/components/widgets/WidgetTable';
import { WidgetGeoMap } from '@/components/widgets/WidgetGeoMap';
import { apiService, type DashboardConfig, type Widget } from '@/services/api';
import { useState } from 'react';
import { Calendar, Filter, RefreshCw, TrendingUp, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardFilters {
  dateRange: string;
  region?: string;
  propertyType?: string;
}

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<DashboardFilters>({ 
    dateRange: '30d',
    region: 'all-regions',
    propertyType: 'all-types'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: config, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-config', id],
    queryFn: () => apiService.getDashboardConfig(id || 'default'),
    enabled: !!id,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleFilterChange = (key: keyof DashboardFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderWidget = (widget: Widget) => {
    const commonProps = {
      key: widget.id,
      widgetId: widget.id,
      title: widget.title,
      filters,
      className: getWidgetClassName(widget),
    };

    switch (widget.type) {
      case 'kpi':
        return <WidgetKPI {...commonProps} />;
      case 'lineChart':
        return <WidgetLineChart {...commonProps} />;
      case 'table':
        return <WidgetTable {...commonProps} />;
      case 'geoMap':
        return <WidgetGeoMap {...commonProps} />;
      default:
        return (
          <Card key={widget.id} className="bg-gradient-card shadow-widget border-0">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Widget type '{widget.type}' not implemented</p>
            </CardContent>
          </Card>
        );
    }
  };

  const getWidgetClassName = (widget: Widget) => {
    const { w, h } = widget.position;
    // Convert grid positions to responsive classes
    if (w <= 3) return 'col-span-1 md:col-span-1';
    if (w <= 6) return 'col-span-1 md:col-span-2';
    return 'col-span-1 md:col-span-3';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dashboard p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 bg-card rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-dashboard p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-card shadow-widget border-destructive/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Dashboard Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The dashboard you're looking for doesn't exist or couldn't be loaded.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
                  {config.description && (
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Card className="bg-card/60 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="h-4 w-4" />
                Filters:
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger className="w-32 bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Select value={filters.region || 'all-regions'} onValueChange={(value) => handleFilterChange('region', value)}>
                  <SelectTrigger className="w-40 bg-background/50 border-border/50">
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-regions">All regions</SelectItem>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="suburbs">Suburbs</SelectItem>
                    <SelectItem value="waterfront">Waterfront</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <Select value={filters.propertyType || 'all-types'} onValueChange={(value) => handleFilterChange('propertyType', value)}>
                  <SelectTrigger className="w-40 bg-background/50 border-border/50">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widgets */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {config.widgets.map(renderWidget)}
        </div>
      </main>
    </div>
  );
}