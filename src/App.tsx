import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import VisionMission from "./pages/VisionMission";
import Chairman from "./pages/Chairman";
import Principal from "./pages/Principal";
import DeanAcademics from "./pages/DeanAcademics";
import DeanInnovation from "./pages/DeanInnovation";
import OrganizationalChart from "./pages/OrganizationalChart";
import GoverningBody from "./pages/GoverningBody";
import GrievanceRedressal from "./pages/GrievanceRedressal";
import Committees from "./pages/Committees";
import Accreditation from "./pages/Accreditation";
import Accreditations from "./pages/Accreditations";
import ComputerScience from "./pages/ComputerScience";
import CyberSecurity from "./pages/CyberSecurity";
import DataScience from "./pages/DataScience";
import AIML from "./pages/AIML";
import AutomobileEngineering from "./pages/AutomobileEngineering";
import BSH from "./pages/BSH";
import CivilEngineering from "./pages/CivilEngineering";
import ECE from "./pages/ECE";
import EEE from "./pages/EEE";
import MechanicalEngineering from "./pages/MechanicalEngineering";
import Placements from "./pages/Placements";
import PlacementsCell from "./pages/PlacementsCell";
import ResearchDevelopment from "./pages/ResearchDevelopment";
import UGPGExaminations from "./pages/UGPGExaminations";
import DiplomaSBTET from "./pages/DiplomaSBTET";
import AQAR2023_2024 from "./pages/AQAR2023-2024";
import AQAR2022_2023 from "./pages/AQAR2022-2023";
import AQAR2021_2022 from "./pages/AQAR2021-2022";
import Transport from "./pages/Transport";
import Library from "./pages/Library";
import Laboratory from "./pages/Laboratory";
import Hostel from "./pages/Hostel";
import NSSPage from "./pages/NSS";
import Sports from "./pages/Sports";
import Cafeteria from "./pages/Cafeteria";
import CampusLife from "./pages/CampusLife";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import NewsAndAnnouncements from "./pages/admin/NewsAndAnnouncements";
import Events from "./pages/admin/Events";
import HeroVideos from "./pages/admin/HeroVideos";
import Ticker from "./pages/admin/Ticker";
import Departments from "./pages/admin/Departments";
import Faculty from "./pages/admin/Faculty";
import HODs from "./pages/admin/HODs";
import Gallery from "./pages/admin/Gallery";
import VibeAtVietAdmin from "./pages/admin/VibeAtVietAdmin";
import Recruiters from "./pages/admin/Recruiters";
import PlacementSection from "./pages/admin/PlacementSection";
import Pages from "./pages/admin/Pages";
import TransportRoutes from "./pages/admin/TransportRoutes";
import DepartmentPages from "./pages/admin/DepartmentPages";
import DynamicPage from "./pages/DynamicPage";
import DynamicRouteHandler from "./components/DynamicRouteHandler";
import FacultyPage from "./pages/FacultyPage";
import DepartmentGallery from "./pages/DepartmentGallery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route path="pages" element={<Pages />} />
          </Route>
          
          {/* Dynamic Route Handler - Checks if route matches a page in database */}
          {/* This is the catch-all route - must be last */}
          <Route path="*" element={<DynamicRouteHandler />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
