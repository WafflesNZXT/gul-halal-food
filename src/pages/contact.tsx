import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { config } from "@/data/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  const [showSubmissionNotice, setShowSubmissionNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send validated inquiry data to the approved email or backend integration.
    setShowSubmissionNotice(true);
  };

  return (
    <Layout>
      <PageHeader 
        title="Contact Us" 
        description="Have a question or just want to say hello? Reach out to us, and our family will get back to yours shortly."
      />
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-display text-primary mb-6">We're Here for You</h2>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  Whether you're planning a massive wedding or an intimate family gathering, we're ready to bring the authentic taste of Pakistan to your table. 
                </p>
                <div className="mt-6">
                  <Link href="/quote" className="text-secondary font-bold hover:underline inline-flex items-center gap-2">
                    Looking to book an event? Request a Quote instead →
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {config.phone && <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-primary">Call Us</h3>
                    <a href={`tel:${config.phone}`} className="text-foreground/80 mt-1 hover:text-primary">{config.phone}</a>
                  </div>
                </div>}

                {config.email && <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-primary">Email Us</h3>
                    <a href={`mailto:${config.email}`} className="text-foreground/80 mt-1 break-all hover:text-primary">{config.email}</a>
                  </div>
                </div>}

                {config.hours.length > 0 && <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-primary">Hours</h3>
                    {config.hours.map((hours) => <p key={hours} className="text-foreground/80 mt-1 text-sm">{hours}</p>)}
                  </div>
                </div>}

                {config.address && <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-primary">Location</h3>
                    <p className="text-foreground/80 mt-1 text-sm">{config.address}</p>
                    {config.serviceArea && <p className="text-secondary font-semibold text-sm mt-2">Serving: {config.serviceArea}</p>}
                  </div>
                </div>}
              </div>

              {/* Decorative Map Placeholder */}
              {config.serviceArea && <div className="w-full h-48 bg-card rounded-3xl border border-border flex flex-col items-center justify-center text-primary/50 relative overflow-hidden group">
                 <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
                    </svg>
                 </div>
                 <MapPin size={32} className="mb-2 group-hover:scale-110 transition-transform text-secondary" />
                 <span className="font-semibold text-sm">Serving the {config.serviceArea}</span>
              </div>}
            </div>

            {/* General Inquiry Form */}
            <div className="bg-card p-8 md:p-10 rounded-[3rem] border border-border shadow-sm h-fit">
              <>
                  <h3 className="text-2xl font-display text-primary mb-6">Send a Message</h3>
                  {showSubmissionNotice && <div role="status" className="rounded-2xl border border-secondary/30 bg-secondary/10 p-4 text-sm text-foreground">
                    Online message submission is not connected yet. Your message has not been sent.
                  </div>}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-foreground">Name</label>
                      <Input id="name" required placeholder="Your name" className="h-12 rounded-xl bg-background border-border" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-foreground">Email</label>
                      <Input id="email" type="email" required placeholder="your@email.com" className="h-12 rounded-xl bg-background border-border" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-semibold text-foreground">Subject</label>
                      <Input id="subject" required placeholder="How can we help?" className="h-12 rounded-xl bg-background border-border" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-semibold text-foreground">Message</label>
                      <Textarea id="message" required placeholder="Type your message here..." className="min-h-[150px] rounded-xl bg-background border-border resize-y" />
                    </div>
                    
                    <Button type="submit" className="w-full rounded-full bg-primary text-white hover:bg-primary/90 font-bold h-14 text-lg shadow-md">
                      Show Submission Status
                    </Button>
                  </form>
              </>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
