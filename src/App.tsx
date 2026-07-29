import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Route, Switch, Router as WouterRouter, Redirect } from "wouter";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import About from "@/pages/about";
import Gallery from "@/pages/gallery";
import Testimonials from "@/pages/testimonials";
import Contact from "@/pages/contact";
import Quote from "@/pages/quote";
import { RouteMetadata } from "@/components/RouteMetadata";
import DishDetail from "@/pages/dish-detail";
import OrderStatusPage from "@/pages/order-status";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import AdminLogin from "@/pages/admin-login";
import AdminOrders from "@/pages/admin-orders";
import AdminOrderDetail from "@/pages/admin-order-detail";
import TrackOrder from "@/pages/track-order";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/orders/:reference" component={AdminOrderDetail} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/" component={Home} />
      {/* Legacy slug redirects */}
      <Route path="/menu/chicken-biryani">
        <Redirect to="/menu/biryani" />
      </Route>
      <Route path="/menu/beef-haleem">
        <Redirect to="/menu/haleem" />
      </Route>
      <Route path="/menu/daal-chawal">
        <Redirect to="/menu/daal" />
      </Route>
      {/* Removed Catering page — redirect old bookmarks to the quote form */}
      <Route path="/catering">
        <Redirect to="/quote" />
      </Route>
      <Route path="/menu/:slug" component={DishDetail} />
      <Route path="/menu" component={Menu} />
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
        <CartProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <RouteMetadata />
            <ScrollToTop />
            <Router />
            <CartDrawer />
          </WouterRouter>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
