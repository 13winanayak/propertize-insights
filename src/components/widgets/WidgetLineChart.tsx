import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiService, type ChartData } from '@/services/api';
import { cn } from '@/lib/utils';

interface WidgetLineChartProps {
  widgetId: string;
  title: string;
  filters?: Record<string, any>;
  className?: string;
}

export function WidgetLineChart({ widgetId, title, filters, className }: WidgetLineChartProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['widget-chart', widgetId, filters],
    queryFn: () => apiService.getChartData({ widgetId, filters }),
    refetchInterval: 60000, // Refresh every minute
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
            <p className="text-sm text-destructive">Failed to load chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for recharts
  const chartData = data.labels.map((label, index) => {
    const point: any = { name: label };
    data.datasets.forEach((dataset, datasetIndex) => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });

  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <Card className={cn(
      "bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0",
      className
    )}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)',
              }}
            />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.color || colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}