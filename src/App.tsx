import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Home from '@/pages/home';
import Menu from '@/pages/menu';
import Catering from '@/pages/catering';
import About from '@/pages/about';
import Gallery from '@/pages/gallery';
import Testimonials from '@/pages/testimonials';
import Contact from '@/pages/contact';
import Quote from '@/pages/quote';
import { RouteMetadata } from '@/components/RouteMetadata';
import DishDetail from '@/pages/dish-detail';
import OrderStatusPage from '@/pages/order-status';
import { ScrollToTop } from '@/components/ScrollToTop';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu/:slug" component={DishDetail} />
      <Route path="/menu" component={Menu} />
      <Route path="/catering" component={Catering} />
      <Route path="/about" component={About} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/contact" component={Contact} />
      <Route path="/quote" component={Quote} />
      <Route path="/order-status/:token" component={OrderStatusPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RouteMetadata />
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
