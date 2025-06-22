import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ReservationProvider } from "./contexts/ReservationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Restaurants from "./pages/Restaurants";
import Reservation from "./pages/Reservation";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import Validation from "./pages/Validation";
import RequireAdmin from "./components/RequireAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/Users";
import AdminReservations from "./pages/admin/Reservations";
import AdminPayments from "./pages/admin/Payments";
import Profile from "./pages/Profile";
import ReservationDetail from "./pages/admin/ReservationDetail";
import AdminRestaurants from "./pages/admin/Restaurants";
import AdminEvents from "./pages/admin/Events";
import RestaurantForm from './pages/admin/RestaurantForm';
import PaymentPage from "./pages/PaymentPage";
import RedirectAuthenticatedRoute from "./components/RedirectAuthenticatedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ReservationProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <div className="min-h-screen bg-background">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/auth"
                    element={
                      <RedirectAuthenticatedRoute>
                        <Auth />
                      </RedirectAuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <RedirectAuthenticatedRoute>
                        <Login />
                      </RedirectAuthenticatedRoute>
                    }
                  />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/validation" element={<Validation />} />
                  <Route
                    path="/restaurants"
                    element={
                      <ProtectedRoute>
                        <Restaurants />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reservation"
                    element={
                      <ProtectedRoute>
                        <Reservation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/confirmation"
                    element={
                      <ProtectedRoute>
                        <Confirmation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="reservations" element={<AdminReservations />} />
                    <Route path="reservations/:id" element={<ReservationDetail />} />
                    <Route path="payments" element={<AdminPayments />} />
                    <Route path="restaurants" element={<AdminRestaurants />} />
                    <Route path="restaurants/new" element={<RestaurantForm />} />
                    <Route path="restaurants/edit/:id" element={<RestaurantForm />} />
                    <Route path="events" element={<AdminEvents />} />
                  </Route>
                  <Route
                    path="/payment"
                    element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </ThemeProvider>
          </ReservationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
