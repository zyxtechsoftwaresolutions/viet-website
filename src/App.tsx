import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Critical components - loaded immediately (above the fold)
import Index from "./pages/Index";

// Lazy load all other pages for code splitting
const AboutUs = lazy(() => import("./pages/AboutUs"));
const VisionMission = lazy(() => import("./pages/VisionMission"));
const Chairman = lazy(() => import("./pages/Chairman"));
const Principal = lazy(() => import("./pages/Principal"));
const DeanAcademics = lazy(() => import("./pages/DeanAcademics"));
const DeanInnovation = lazy(() => import("./pages/DeanInnovation"));
const OrganizationalChart = lazy(() => import("./pages/OrganizationalChart"));
const GoverningBody = lazy(() => import("./pages/GoverningBody"));
const GrievanceRedressal = lazy(() => import("./pages/GrievanceRedressal"));
const Committees = lazy(() => import("./pages/Committees"));
const Accreditation = lazy(() => import("./pages/Accreditation"));
const Accreditations = lazy(() => import("./pages/Accreditations"));
const ComputerScience = lazy(() => import("./pages/ComputerScience"));
const CyberSecurity = lazy(() => import("./pages/CyberSecurity"));
const DataScience = lazy(() => import("./pages/DataScience"));
const AIML = lazy(() => import("./pages/AIML"));
const AutomobileEngineering = lazy(() => import("./pages/AutomobileEngineering"));
const BSH = lazy(() => import("./pages/BSH"));
const CivilEngineering = lazy(() => import("./pages/CivilEngineering"));
const ECE = lazy(() => import("./pages/ECE"));
const EEE = lazy(() => import("./pages/EEE"));
const MechanicalEngineering = lazy(() => import("./pages/MechanicalEngineering"));
const Placements = lazy(() => import("./pages/Placements"));
const PlacementsCell = lazy(() => import("./pages/PlacementsCell"));
const ResearchDevelopment = lazy(() => import("./pages/ResearchDevelopment"));
const UGPGExaminations = lazy(() => import("./pages/UGPGExaminations"));
const DiplomaSBTET = lazy(() => import("./pages/DiplomaSBTET"));
const AQAR2023_2024 = lazy(() => import("./pages/AQAR2023-2024"));
const AQAR2022_2023 = lazy(() => import("./pages/AQAR2022-2023"));
const AQAR2021_2022 = lazy(() => import("./pages/AQAR2021-2022"));
const Transport = lazy(() => import("./pages/Transport"));
const Library = lazy(() => import("./pages/Library"));
const Laboratory = lazy(() => import("./pages/Laboratory"));
const Hostel = lazy(() => import("./pages/Hostel"));
const NSSPage = lazy(() => import("./pages/NSS"));
const Sports = lazy(() => import("./pages/Sports"));
const Cafeteria = lazy(() => import("./pages/Cafeteria"));
const CampusLife = lazy(() => import("./pages/CampusLife"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));
const DynamicRouteHandler = lazy(() => import("./components/DynamicRouteHandler"));
const FacultyPage = lazy(() => import("./pages/FacultyPage"));
const DepartmentGallery = lazy(() => import("./pages/DepartmentGallery"));

// Admin routes - heavy, lazy loaded
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const NewsAndAnnouncements = lazy(() => import("./pages/admin/NewsAndAnnouncements"));
const Events = lazy(() => import("./pages/admin/Events"));
const HeroVideos = lazy(() => import("./pages/admin/HeroVideos"));
const Ticker = lazy(() => import("./pages/admin/Ticker"));
const Departments = lazy(() => import("./pages/admin/Departments"));
const Faculty = lazy(() => import("./pages/admin/Faculty"));
const HODs = lazy(() => import("./pages/admin/HODs"));
const Gallery = lazy(() => import("./pages/admin/Gallery"));
const VibeAtVietAdmin = lazy(() => import("./pages/admin/VibeAtVietAdmin"));
const Recruiters = lazy(() => import("./pages/admin/Recruiters"));
const PlacementSection = lazy(() => import("./pages/admin/PlacementSection"));
const Pages = lazy(() => import("./pages/admin/LeaderPagesAdmin"));
const TransportRoutes = lazy(() => import("./pages/admin/TransportRoutes"));
const AccreditationsAdmin = lazy(() => import("./pages/admin/Accreditations"));
const DepartmentPages = lazy(() => import("./pages/admin/DepartmentPages"));
const IntroVideoAdmin = lazy(() => import("./pages/admin/IntroVideo"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/vision-mission" element={<VisionMission />} />
            <Route path="/chairman" element={<Chairman />} />
            <Route path="/principal" element={<Principal />} />
            <Route path="/dean-academics" element={<DeanAcademics />} />
            <Route path="/dean-innovation" element={<DeanInnovation />} />
            <Route path="/organizational-chart" element={<OrganizationalChart />} />
            <Route path="/governing-body" element={<GoverningBody />} />
            <Route path="/grievance-redressal" element={<GrievanceRedressal />} />
            <Route path="/committees" element={<Committees />} />
            <Route path="/accreditation" element={<Accreditation />} />
            <Route path="/accreditations" element={<Accreditations />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/placements-cell" element={<PlacementsCell />} />
            <Route path="/research-development" element={<ResearchDevelopment />} />
            <Route path="/rd" element={<ResearchDevelopment />} />
            <Route path="/programs/engineering/ug/cse" element={<ComputerScience />} />
            <Route path="/computer-science" element={<ComputerScience />} />
            <Route path="/programs/engineering/ug/cyber-security" element={<CyberSecurity />} />
            <Route path="/cyber-security" element={<CyberSecurity />} />
            <Route path="/programs/engineering/ug/data-science" element={<DataScience />} />
            <Route path="/data-science" element={<DataScience />} />
            <Route path="/programs/engineering/ug/aiml" element={<AIML />} />
            <Route path="/aiml" element={<AIML />} />
            <Route path="/automobile-engineering" element={<AutomobileEngineering />} />
            <Route path="/programs/engineering/ug/ame" element={<AutomobileEngineering />} />
            <Route path="/bs-h" element={<BSH />} />
            <Route path="/programs/engineering/ug/bsh" element={<BSH />} />
            <Route path="/civil-engineering-ug" element={<CivilEngineering />} />
            <Route path="/programs/engineering/ug/civil" element={<CivilEngineering />} />
            <Route path="/electronics-communications-engineering-ug" element={<ECE />} />
            <Route path="/programs/engineering/ug/ece" element={<ECE />} />
            <Route path="/electrical-electronics-engineering-ug" element={<EEE />} />
            <Route path="/programs/engineering/ug/eee" element={<EEE />} />
            <Route path="/mechanical-engineering-ug" element={<MechanicalEngineering />} />
            <Route path="/programs/engineering/ug/mechanical" element={<MechanicalEngineering />} />
            <Route path="/examinations/ug-pg" element={<UGPGExaminations />} />
            <Route path="/examinations/diploma" element={<DiplomaSBTET />} />
            <Route path="/aqar-2023-2024" element={<AQAR2023_2024 />} />
            <Route path="/aqar-2022-2023" element={<AQAR2022_2023 />} />
            <Route path="/aqar-2021-2022" element={<AQAR2021_2022 />} />
            <Route path="/facilities/transport" element={<Transport />} />
            <Route path="/facilities/library" element={<Library />} />
            <Route path="/facilities/laboratory" element={<Laboratory />} />
            <Route path="/facilities/hostel" element={<Hostel />} />
            <Route path="/facilities/nss" element={<NSSPage />} />
            <Route path="/facilities/sports" element={<Sports />} />
            <Route path="/facilities/cafeteria" element={<Cafeteria />} />
            <Route path="/campus-life" element={<CampusLife />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/department/:slug/gallery" element={<DepartmentGallery />} />
            
            {/* Dynamic Pages Route - Must be after all specific routes */}
            <Route path="/page/:slug" element={<DynamicPage />} />
            
            {/* Admin Routes - Must be before dynamic route handler */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="news-announcements" element={<NewsAndAnnouncements />} />
              <Route path="events" element={<Events />} />
              <Route path="hero-videos" element={<HeroVideos />} />
              <Route path="intro-video" element={<IntroVideoAdmin />} />
              <Route path="ticker" element={<Ticker />} />
              <Route path="departments" element={<Departments />} />
              <Route path="department-pages" element={<DepartmentPages />} />
              <Route path="faculty" element={<Faculty />} />
              <Route path="hods" element={<HODs />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="vibe-at-viet" element={<VibeAtVietAdmin />} />
              <Route path="recruiters" element={<Recruiters />} />
              <Route path="placement-section" element={<PlacementSection />} />
              <Route path="transport-routes" element={<TransportRoutes />} />
              <Route path="accreditations" element={<AccreditationsAdmin />} />
              <Route path="pages" element={<Pages />} />
            </Route>
            
            {/* Dynamic Route Handler - Checks if route matches a page in database */}
            {/* This is the catch-all route - must be last */}
            <Route path="*" element={<DynamicRouteHandler />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
