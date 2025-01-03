import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout/Layout";
import AuthGuard from "./components/layout/AuthGuard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Finance from "./pages/Finance";
import Contacts from "./pages/Contacts";
import Links from "./pages/Links";
import Calendar from "./pages/Calendar";
import Passwords from "./pages/Passwords";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import Shopping from "./pages/Desires";
import Files from "./pages/Files";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/*"
          element={
            <AuthGuard>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/links" element={<Links />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/passwords" element={<Passwords />} />
                  <Route path="/impresszum" element={<Settings />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/desires" element={<Shopping />} />
                  <Route path="/files" element={<Files />} />
                </Routes>
              </Layout>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;