
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import DepartmentList from "./pages/departments/DepartmentList";
import DepartmentDetail from "./pages/departments/DepartmentDetail";
import ProcessList from "./pages/processes/ProcessList";
import ProcessDetail from "./pages/processes/ProcessDetail";
import SubProcessList from "./pages/subprocesses/SubProcessList";
import SubProcessDetail from "./pages/subprocesses/SubProcessDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/processes" element={<ProcessList />} />
            <Route path="/processes/:id" element={<ProcessDetail />} />
            <Route path="/subprocesses" element={<SubProcessList />} />
            <Route path="/subprocesses/:id" element={<SubProcessDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
