import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { apiService, type GeoData } from '@/services/api';
import { cn } from '@/lib/utils';

interface WidgetGeoMapProps {
  widgetId: string;
  title: string;
  filters?: Record<string, any>;
  className?: string;
}

export function WidgetGeoMap({ widgetId, title, filters, className }: WidgetGeoMapProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['widget-geo', widgetId, filters],
    queryFn: () => apiService.getGeoData({ widgetId, filters }),
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  if (isLoading) {
    return (
      <Card className={cn("bg-gradient-card shadow-widget", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={cn("bg-gradient-card shadow-widget border-destructive/20", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-sm text-destructive">Failed to load map data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort regions by value for better visualization
  const sortedRegions = [...data.regions].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...data.regions.map(r => r.value));

  const getIntensityColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'bg-chart-1';
    if (intensity > 0.6) return 'bg-chart-2';
    if (intensity > 0.4) return 'bg-chart-3';
    if (intensity > 0.2) return 'bg-chart-4';
    return 'bg-chart-5';
  };

  const getBadgeVariant = (value: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'default';
    if (intensity > 0.6) return 'secondary';
    return 'outline';
  };

  return (
    <Card className={cn(
      "bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0",
      className
    )}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simplified map visualization using regional distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedRegions.map((region, index) => (
            <div
              key={region.name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  getIntensityColor(region.value)
                )} />
                <div>
                  <div className="font-medium text-foreground">{region.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {region.coordinates[1].toFixed(4)}, {region.coordinates[0].toFixed(4)}
                  </div>
                </div>
              </div>
              <Badge variant={getBadgeVariant(region.value)}>
                {region.value.toLocaleString()}
              </Badge>
            </div>
          ))}
        </div>

        {/* Summary statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {data.regions.length}
            </div>
            <div className="text-xs text-muted-foreground">Regions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {data.regions.reduce((sum, r) => sum + r.value, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(data.regions.reduce((sum, r) => sum + r.value, 0) / data.regions.length).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Avg per Region</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-chart-1" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-chart-3" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-chart-5" />
            <span>Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}