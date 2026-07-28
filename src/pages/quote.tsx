import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UtensilsCrossed } from "lucide-react";
import { config } from "@/data/config";
import { Order, OrderSubmissionResult, submitOrder } from "@/lib/order";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventDate: z.string().min(1, "Please select an event date"),
  eventType: z.string().min(1, "Please select an event type"),
  guestCount: z.coerce.number().positive("Please enter a guest count"),
  venue: z.string().optional(),
  menuNotes: z.string().optional(),
  dietaryNeeds: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Quote() {
  const [submissionResult, setSubmissionResult] = useState<OrderSubmissionResult | null>(null);
  const requestedDish = new URLSearchParams(window.location.search).get("dish");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "",
      menuNotes: requestedDish ? `I'm interested in ${requestedDish}.` : "",
    }
  });

  const onSubmit = async (data: FormValues) => {
    const result = await submitOrder({
      ...data,
      items: requestedDish ? [{ dishSlug: requestedDish.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), dishName: requestedDish }] : [],
    });
    setSubmissionResult(result);
  };

  return (
    <Layout>
      <PageHeader 
        title="Request a Quote" 
        description="Let's craft the perfect menu for your event."
      />
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-card p-8 md:p-12 rounded-[3rem] border border-border shadow-lg relative overflow-hidden">
            
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

            {submissionResult?.status === "success" ? <OrderConfirmation order={submissionResult.order} receiptUrl={submissionResult.receiptUrl} emailStatusUrl={submissionResult.emailStatusUrl} statusUrl={submissionResult.statusUrl} /> : <>
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border/50">
                  <div className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <UtensilsCrossed size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display text-primary">Event Details</h2>
                    <p className="text-foreground/70">Fill out the form below for an accurate quote.</p>
                  </div>
                </div>

                {submissionResult?.status === "not_configured" && <div role="status" className="mb-8 rounded-2xl border border-secondary/30 bg-secondary/10 p-4 text-sm text-foreground">
                  Online ordering is not connected yet. Your information has not been sent, but this page is ready for future order submission.
                </div>}
                {submissionResult?.status === "error" && <div role="alert" className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">{submissionResult.message}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                  
                  {/* Contact Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-display text-foreground border-l-4 border-secondary pl-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-semibold text-foreground">Full Name *</label>
                        <Input id="fullName" placeholder="Jane Doe" className={`h-12 rounded-xl bg-background border-border ${errors.fullName ? 'border-destructive' : ''}`} {...register("fullName")} />
                        {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address *</label>
                        <Input id="email" type="email" placeholder="jane@example.com" className={`h-12 rounded-xl bg-background border-border ${errors.email ? 'border-destructive' : ''}`} {...register("email")} />
                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="phone" className="text-sm font-semibold text-foreground">Phone Number *</label>
                        <Input id="phone" type="tel" placeholder="Enter a phone number" className={`h-12 rounded-xl bg-background border-border md:w-1/2 ${errors.phone ? 'border-destructive' : ''}`} {...register("phone")} />
                        {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Event Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-display text-foreground border-l-4 border-secondary pl-3">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="eventDate" className="text-sm font-semibold text-foreground">Event Date *</label>
                        <Input id="eventDate" type="date" className={`h-12 rounded-xl bg-background border-border ${errors.eventDate ? 'border-destructive' : ''}`} {...register("eventDate")} />
                        {errors.eventDate && <p className="text-destructive text-sm mt-1">{errors.eventDate.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="eventType" className="text-sm font-semibold text-foreground">Event Type *</label>
                        <select id="eventType" className={`flex h-12 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.eventType ? 'border-destructive' : ''}`} {...register("eventType")}>
                          <option value="" disabled>Select an event...</option>
                          <option value="wedding">Wedding</option>
                          <option value="family">Family Gathering</option>
                          <option value="community">Community Event</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="birthday">Birthday/Celebration</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.eventType && <p className="text-destructive text-sm mt-1">{errors.eventType.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="guestCount" className="text-sm font-semibold text-foreground">Estimated Guest Count *</label>
                        <Input id="guestCount" type="number" min="1" placeholder="Estimated guests" className={`h-12 rounded-xl bg-background border-border ${errors.guestCount ? 'border-destructive' : ''}`} {...register("guestCount")} />
                        {errors.guestCount && <p className="text-destructive text-sm mt-1">{errors.guestCount.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="venue" className="text-sm font-semibold text-foreground">Venue / City (If known)</label>
                        <Input id="venue" placeholder="e.g. Community Center, San Jose" className="h-12 rounded-xl bg-background border-border" {...register("venue")} />
                      </div>
                    </div>
                  </div>

                  {/* Menu Preferences Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-display text-foreground border-l-4 border-secondary pl-3">Menu & Preferences</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="menuNotes" className="text-sm font-semibold text-foreground">Preferred Dishes & Ideas</label>
                      <Textarea id="menuNotes" placeholder="Tell us what you have in mind! E.g. Chicken Biryani, Haleem, and Samosas for appetizers..." className="min-h-[120px] rounded-xl bg-background border-border resize-y" {...register("menuNotes")} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dietaryNeeds" className="text-sm font-semibold text-foreground">Dietary Requirements</label>
                      <Input id="dietaryNeeds" placeholder="E.g. Need 10 vegetarian portions, 5 gluten-free" className="h-12 rounded-xl bg-background border-border" {...register("dietaryNeeds")} />
                      <p className="text-xs text-foreground/60 mt-1">Gul Halal Food serves Pakistani halal catering.</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50">
                    <Button type="submit" className="w-full md:w-auto rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-12 h-14 text-lg shadow-md float-right">
                      Place Order
                    </Button>
                    <div className="clear-both"></div>
                  </div>
                </form>
            </>}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function OrderConfirmation({ order, receiptUrl, emailStatusUrl, statusUrl }: { order: Order; receiptUrl?: string; emailStatusUrl?: string; statusUrl?: string }) {
  const hasFollowUp = Boolean(receiptUrl || emailStatusUrl || statusUrl);
  return <div className="py-12 text-center"><h2 className="text-4xl text-primary">Thank you</h2><p className="mx-auto mt-4 max-w-lg text-foreground/75">Your order request has been received.</p><div className="mx-auto mt-8 max-w-lg rounded-2xl border border-border bg-background p-5 text-left"><p><strong>Reference:</strong> {order.reference}</p><p><strong>Status:</strong> {order.status}</p><p><strong>Event date:</strong> {order.eventDate}</p>{order.items.length > 0 && <p><strong>Dishes:</strong> {order.items.map((item) => item.dishName).join(", ")}</p>}</div>{hasFollowUp ? <div className="mt-8 flex flex-wrap justify-center gap-3">{receiptUrl && <Button asChild><a href={receiptUrl}>Email receipt</a></Button>}{emailStatusUrl && <Button asChild><a href={emailStatusUrl}>Email order status page</a></Button>}{statusUrl && <Button asChild><a href={statusUrl}>View order status</a></Button>}</div> : <p className="mt-8 text-sm text-foreground/60">Email receipt and order-status actions are available after online ordering is connected.</p>}</div>;
}
