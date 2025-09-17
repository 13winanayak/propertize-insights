import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { apiService, type TableData } from '@/services/api';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface WidgetTableProps {
  widgetId: string;
  title: string;
  filters?: Record<string, any>;
  className?: string;
  onRowClick?: (row: Record<string, any>) => void;
}

export function WidgetTable({ widgetId, title, filters, className, onRowClick }: WidgetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['widget-table', widgetId, filters, currentPage],
    queryFn: () => apiService.getTableData({ widgetId, filters: { ...filters, page: currentPage } }),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <Card className={cn("bg-gradient-card shadow-widget", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
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
          <p className="text-sm text-destructive">Failed to load table data</p>
        </CardContent>
      </Card>
    );
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data.pagination && currentPage < Math.ceil(data.pagination.total / data.pagination.pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string' && value.startsWith('$')) return value;
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  return (
    <Card className={cn(
      "bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0",
      className
    )}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {data.headers.map((header, index) => (
                  <th key={index} className="text-left p-4 font-medium text-muted-foreground text-sm">
                    {header}
                  </th>
                ))}
                {onRowClick && <th className="w-12 p-4"></th>}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/30 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {data.headers.map((header, cellIndex) => (
                    <td key={cellIndex} className="p-4 text-sm">
                      <span className="text-foreground">
                        {formatCellValue(row[header.toLowerCase().replace(/\s+/g, '')])}
                      </span>
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="p-4">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.pagination && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * data.pagination.pageSize) + 1} to{' '}
              {Math.min(currentPage * data.pagination.pageSize, data.pagination.total)} of{' '}
              {data.pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= Math.ceil(data.pagination.total / data.pagination.pageSize)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}