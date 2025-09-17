import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { apiService, type KPIData } from '@/services/api';
import { cn } from '@/lib/utils';

interface WidgetKPIProps {
  widgetId: string;
  title: string;
  filters?: Record<string, any>;
  className?: string;
}

export function WidgetKPI({ widgetId, title, filters, className }: WidgetKPIProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['widget-kpi', widgetId, filters],
    queryFn: () => apiService.getKPIData({ widgetId, filters }),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className={cn("bg-gradient-card shadow-widget animate-pulse", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded w-24"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={cn("bg-gradient-card shadow-widget border-destructive/20", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load data</p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (changeType: KPIData['changeType']) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getChangeColor = (changeType: KPIData['changeType']) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatValue = (value: number) => {
    if (title.toLowerCase().includes('rate') || title.toLowerCase().includes('%')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const progressPercentage = data.target ? Math.min((data.value / data.target) * 100, 100) : 0;

  return (
    <Card className={cn(
      "bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 cursor-default border-0",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-3xl font-bold text-foreground">
            {formatValue(data.value)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {getTrendIcon(data.changeType)}
            <span className={getChangeColor(data.changeType)}>
              {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>
        
        {data.target && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to target</span>
              <span>{data.target.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% of target
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}