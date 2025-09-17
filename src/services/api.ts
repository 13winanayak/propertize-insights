// API service layer for dashboard and lead management
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface DashboardConfig {
  id: string;
  title: string;
  description?: string;
  widgets: Widget[];
}

export interface Widget {
  id: string;
  type: 'kpi' | 'lineChart' | 'table' | 'geoMap' | 'pieChart';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
}

export interface KPIData {
  value: number;
  label: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  target?: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
}

export interface TableData {
  headers: string[];
  rows: Array<Record<string, any>>;
  pagination?: {
    page: number;
    total: number;
    pageSize: number;
  };
}

export interface GeoData {
  regions: Array<{
    name: string;
    value: number;
    coordinates: [number, number];
  }>;
}

export interface PropertyLead {
  name: string;
  phone: string;
  email: string;
  propertyArea: string;
  propertyType: string;
  budget?: string;
  message?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard endpoints
  async getDashboardConfig(dashboardId: string): Promise<DashboardConfig> {
    return this.request<DashboardConfig>(`/dashboard/${dashboardId}/config`);
  }

  async getWidgetData(params: { widgetId: string; filters?: Record<string, any> }): Promise<any> {
    const { widgetId, filters } = params;
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any>(`/widget/${widgetId}/data${queryParams}`);
  }

  async getKPIData(params: { widgetId: string; filters?: Record<string, any> }): Promise<KPIData> {
    return this.getWidgetData(params);
  }

  async getChartData(params: { widgetId: string; filters?: Record<string, any> }): Promise<ChartData> {
    return this.getWidgetData(params);
  }

  async getTableData(params: { widgetId: string; filters?: Record<string, any> }): Promise<TableData> {
    return this.getWidgetData(params);
  }

  async getGeoData(params: { widgetId: string; filters?: Record<string, any> }): Promise<GeoData> {
    return this.getWidgetData(params);
  }

  // Lead management endpoints
  async submitLead(lead: PropertyLead): Promise<{ success: boolean; leadId?: string }> {
    return this.request<{ success: boolean; leadId?: string }>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }

  async getLeads(page = 1, limit = 20): Promise<{ leads: PropertyLead[]; total: number }> {
    return this.request<{ leads: PropertyLead[]; total: number }>(`/leads?page=${page}&limit=${limit}`);
  }

  // Schema discovery endpoints
  async getDimensions(): Promise<string[]> {
    return this.request<string[]>('/schema/dimensions');
  }

  async getMeasures(): Promise<string[]> {
    return this.request<string[]>('/schema/measures');
  }
}

// Mock data for development
export class MockApiService extends ApiService {
  async getDashboardConfig(dashboardId: string): Promise<DashboardConfig> {
    return {
      id: dashboardId,
      title: 'Property Lead Dashboard',
      description: 'Real-time insights into property leads and market performance',
      widgets: [
        {
          id: 'kpi-leads',
          type: 'kpi',
          title: 'Total Leads',
          position: { x: 0, y: 0, w: 3, h: 2 },
          config: { metric: 'total_leads' }
        },
        {
          id: 'kpi-conversion',
          type: 'kpi',
          title: 'Conversion Rate',
          position: { x: 3, y: 0, w: 3, h: 2 },
          config: { metric: 'conversion_rate' }
        },
        {
          id: 'chart-leads-trend',
          type: 'lineChart',
          title: 'Leads Trend',
          position: { x: 0, y: 2, w: 6, h: 4 },
          config: { timeframe: '30d' }
        },
        {
          id: 'table-recent-leads',
          type: 'table',
          title: 'Recent Leads',
          position: { x: 6, y: 0, w: 6, h: 6 },
          config: { limit: 10 }
        },
        {
          id: 'geo-leads-map',
          type: 'geoMap',
          title: 'Leads by Region',
          position: { x: 0, y: 6, w: 8, h: 4 },
          config: { mapType: 'regions' }
        }
      ]
    };
  }

  async getKPIData(params: { widgetId: string; filters?: Record<string, any> }): Promise<KPIData> {
    const { widgetId } = params;
    const mockData: Record<string, KPIData> = {
      'kpi-leads': {
        value: 1247,
        label: 'Total Leads',
        change: 12.5,
        changeType: 'positive',
        target: 1500
      },
      'kpi-conversion': {
        value: 23.8,
        label: 'Conversion Rate (%)',
        change: -2.1,
        changeType: 'negative',
        target: 25
      }
    };
    return mockData[widgetId] || mockData['kpi-leads'];
  }

  async getChartData(params: { widgetId: string; filters?: Record<string, any> }): Promise<ChartData> {
    return {
      labels: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'New Leads',
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 20),
          color: 'hsl(var(--chart-1))'
        }
      ]
    };
  }

  async getTableData(params: { widgetId: string; filters?: Record<string, any> }): Promise<TableData> {
    const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse', 'Villa'];
    const areas = ['Downtown', 'Suburbs', 'Waterfront', 'City Center', 'Residential'];
    
    return {
      headers: ['Name', 'Phone', 'Property Type', 'Area', 'Budget', 'Date'],
      rows: Array.from({ length: 10 }, (_, i) => ({
        name: `Lead ${i + 1}`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        area: areas[Math.floor(Math.random() * areas.length)],
        budget: `$${(Math.floor(Math.random() * 500) + 200)}K`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      })),
      pagination: { page: 1, total: 50, pageSize: 10 }
    };
  }

  async getGeoData(params: { widgetId: string; filters?: Record<string, any> }): Promise<GeoData> {
    return {
      regions: [
        { name: 'Downtown', value: 450, coordinates: [-74.006, 40.7128] },
        { name: 'Brooklyn', value: 320, coordinates: [-73.9442, 40.6782] },
        { name: 'Queens', value: 280, coordinates: [-73.7949, 40.7282] },
        { name: 'Bronx', value: 180, coordinates: [-73.8648, 40.8448] },
        { name: 'Staten Island', value: 120, coordinates: [-74.1502, 40.5795] }
      ]
    };
  }

  async submitLead(lead: PropertyLead): Promise<{ success: boolean; leadId?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, leadId: `lead_${Date.now()}` };
  }
}

export const apiService = new MockApiService();