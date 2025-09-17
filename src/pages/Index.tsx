import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Home, BarChart3, Map, Building } from "lucide-react";
import { Link } from "react-router-dom";
import propertyHero from "@/assets/property-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-dashboard">
      {/* Hero Section with Background Image */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={propertyHero} 
            alt="Modern luxury real estate cityscape with glass buildings" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/80" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-2xl">
              <Building className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Property Lead Generator
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your property business with powerful analytics, lead management, and 
            real-time insights. Drive more conversions with data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              <Link to="/dashboard/main">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 bg-card/50 backdrop-blur-sm"
            >
              <Link to="/leads">
                <Users className="mr-2 h-5 w-5" />
                Manage Leads
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive tools for property lead generation and management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard Analytics */}
            <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0">
              <CardHeader>
                <div className="p-3 bg-chart-1/10 rounded-lg w-fit">
                  <BarChart3 className="h-8 w-8 text-chart-1" />
                </div>
                <CardTitle className="text-xl text-foreground">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track KPIs, conversion rates, and lead performance with beautiful, 
                  interactive dashboards that update in real-time.
                </p>
              </CardContent>
            </Card>

            {/* Lead Management */}
            <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0">
              <CardHeader>
                <div className="p-3 bg-chart-2/10 rounded-lg w-fit">
                  <Users className="h-8 w-8 text-chart-2" />
                </div>
                <CardTitle className="text-xl text-foreground">Lead Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Capture, organize, and track property leads with comprehensive 
                  forms and automated workflows.
                </p>
              </CardContent>
            </Card>

            {/* Geographic Insights */}
            <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0">
              <CardHeader>
                <div className="p-3 bg-chart-3/10 rounded-lg w-fit">
                  <Map className="h-8 w-8 text-chart-3" />
                </div>
                <CardTitle className="text-xl text-foreground">Geographic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualize lead distribution across regions and identify 
                  high-performing areas for targeted marketing.
                </p>
              </CardContent>
            </Card>

            {/* Property Matching */}
            <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0">
              <CardHeader>
                <div className="p-3 bg-chart-4/10 rounded-lg w-fit">
                  <Home className="h-8 w-8 text-chart-4" />
                </div>
                <CardTitle className="text-xl text-foreground">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automatically match leads with suitable properties based on 
                  their preferences, budget, and requirements.
                </p>
              </CardContent>
            </Card>

            {/* Trend Analysis */}
            <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0">
              <CardHeader>
                <div className="p-3 bg-chart-5/10 rounded-lg w-fit">
                  <TrendingUp className="h-8 w-8 text-chart-5" />
                </div>
                <CardTitle className="text-xl text-foreground">Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Identify market trends, seasonal patterns, and growth 
                  opportunities with advanced analytics.
                </p>
              </CardContent>
            </Card>

            {/* Multi-Channel */}
            <Card className="bg-gradient-card shadow-widget hover:shadow-widget-hover transition-all duration-200 border-0">
              <CardHeader>
                <div className="p-3 bg-chart-6/10 rounded-lg w-fit">
                  <Building className="h-8 w-8 text-chart-6" />
                </div>
                <CardTitle className="text-xl text-foreground">Multi-Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrate with multiple lead sources and channels for 
                  comprehensive lead generation and management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-card shadow-widget-lg border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Transform Your Property Business?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Start generating and managing property leads more effectively with our comprehensive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6"
                >
                  <Link to="/leads">
                    <Users className="mr-2 h-5 w-5" />
                    Start Adding Leads
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <Link to="/dashboard/main">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Explore Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
