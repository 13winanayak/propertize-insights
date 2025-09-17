import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiService, type PropertyLead } from '@/services/api';
import { User, Phone, Mail, MapPin, Home, DollarSign, MessageSquare, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  propertyArea: z.string().min(1, 'Please select a property area'),
  propertyType: z.string().min(1, 'Please select a property type'),
  budget: z.string().optional(),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

const propertyTypes = [
  'Apartment',
  'House',
  'Condo',
  'Townhouse',
  'Villa',
  'Studio',
  'Penthouse',
  'Duplex'
];

const propertyAreas = [
  'Downtown',
  'Suburbs',
  'Waterfront',
  'City Center',
  'Residential District',
  'Business District',
  'Historic District',
  'Beachfront'
];

const budgetRanges = [
  'Under $200K',
  '$200K - $400K',
  '$400K - $600K',
  '$600K - $800K',
  '$800K - $1M',
  '$1M - $2M',
  'Over $2M'
];

interface LeadFormProps {
  className?: string;
  onSuccess?: (leadId: string) => void;
}

export function LeadForm({ className, onSuccess }: LeadFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      propertyArea: '',
      propertyType: '',
      budget: '',
      message: '',
    },
  });

  const submitLeadMutation = useMutation({
    mutationFn: (lead: PropertyLead) => apiService.submitLead(lead),
    onSuccess: (response) => {
      setIsSubmitted(true);
      toast({
        title: 'Lead submitted successfully!',
        description: 'Thank you for your interest. We\'ll contact you soon.',
      });
      if (response.leadId && onSuccess) {
        onSuccess(response.leadId);
      }
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Submission failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      console.error('Lead submission error:', error);
    },
  });

  const onSubmit = (data: LeadFormData) => {
    submitLeadMutation.mutate(data as PropertyLead);
  };

  if (isSubmitted) {
    return (
      <Card className={cn("bg-gradient-card shadow-widget-lg border-0", className)}>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Thank You!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your lead has been submitted successfully. Our team will review your requirements and contact you within 24 hours.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mt-6"
            >
              Submit Another Lead
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-card shadow-widget-lg border-0", className)}>
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          Property Lead Form
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Tell us about your property requirements and we'll help you find the perfect match.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field}
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(555) 123-4567" 
                          {...field}
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@example.com" 
                        type="email"
                        {...field}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Property Requirements */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Property Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="propertyArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Preferred Area
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select preferred area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Budget Range (Optional)
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Additional Information
              </h4>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your specific requirements, timeline, or any questions you have..."
                        className="bg-background/50 min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
              disabled={submitLeadMutation.isPending}
            >
              {submitLeadMutation.isPending ? 'Submitting...' : 'Submit Lead Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}