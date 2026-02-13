import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Building2,
  Users,
  UserCog,
  Camera,
  Laptop,
  Grid3x3,
  FileText,
  BookOpen,
  Bus,
  LogOut,
  Menu,
  X,
  ScrollText,
  PlayCircle,
  Briefcase,
  Award,
  Film,
  Warehouse,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', section: 'dashboard', adminOnly: false },
    { icon: PlayCircle, label: 'Hero Videos', path: '/admin/hero-videos', section: 'hero-videos', adminOnly: false },
    { icon: Film, label: 'Intro Video', path: '/admin/intro-video', section: 'intro-video', adminOnly: false },
    { icon: ScrollText, label: 'SCROLLING TEXT', path: '/admin/ticker', section: 'ticker', adminOnly: false },
    { icon: Newspaper, label: 'News & Announcements', path: '/admin/news-announcements', section: 'news-announcements', adminOnly: false },
    { icon: Calendar, label: 'Events', path: '/admin/events', section: 'events', adminOnly: false },
    { icon: Building2, label: 'Departments', path: '/admin/departments', section: 'departments', adminOnly: false },
    { icon: BookOpen, label: 'Department Pages', path: '/admin/department-pages', section: 'department-pages', adminOnly: false },
    { icon: Users, label: 'Faculty', path: '/admin/faculty', section: 'faculty', adminOnly: false },
    { icon: UserCog, label: 'HODs', path: '/admin/hods', section: 'hods', adminOnly: false },
    { icon: Camera, label: 'Gallery', path: '/admin/gallery', section: 'gallery', adminOnly: false },
    { icon: Grid3x3, label: 'Vibe@Viet', path: '/admin/vibe-at-viet', section: 'vibe-at-viet', adminOnly: false },
    { icon: Laptop, label: 'Recruiters', path: '/admin/recruiters', section: 'recruiters', adminOnly: false },
    { icon: Briefcase, label: 'Placement Section', path: '/admin/placement-section', section: 'placement-section', adminOnly: false },
    { icon: Bus, label: 'Transport Routes', path: '/admin/transport-routes', section: 'transport-routes', adminOnly: false },
    { icon: Warehouse, label: 'Facilities', path: '/admin/facilities', section: 'facilities', adminOnly: false },
    { icon: Award, label: 'Accreditations', path: '/admin/accreditations', section: 'accreditations', adminOnly: false },
    { icon: FileText, label: 'Pages', path: '/admin/pages', section: 'pages', adminOnly: false },
    { icon: UserCog, label: 'AUTHORITIES', path: '/admin/authorities', section: 'authorities', adminOnly: false },
    { icon: Shield, label: 'Sub-Admins', path: '/admin/sub-admins', section: 'sub-admins', adminOnly: true },
  ];

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ role?: string; allowedSections?: string[] } | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await authAPI.verify();
        setUser(res?.user || null);
        setIsAuthenticated(true);
      } catch (err: any) {
        console.error('Auth verification failed:', err);
        setIsAuthenticated(false);
        setUser(null);
        // Only navigate if it's an auth error, not a connection error
        if (!err.message?.includes('fetch') && !err.message?.includes('Failed to fetch')) {
          navigate('/admin/login');
        }
      }
    };
    verifyAuth();
  }, [navigate]);

  const isAdmin = user?.role === 'admin';
  const allowedSections = user?.allowedSections || [];
  const menuItems = allMenuItems.filter((item) => {
    if (item.adminOnly) return isAdmin;
    if (isAdmin) return true;
    return item.section === 'dashboard' || allowedSections.includes(item.section);
  });

  const currentSection = allMenuItems.find((m) => m.path === location.pathname)?.section;
  const canAccessCurrentPath =
    isAdmin ||
    currentSection === 'dashboard' ||
    (currentSection && allowedSections.includes(currentSection)) ||
    (location.pathname === '/admin' || location.pathname === '/admin/');

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">
            Cannot connect to the backend server. Please make sure the server is running on port 3001.
          </p>
          <div className="space-y-2 text-left bg-gray-50 p-4 rounded mb-4">
            <p className="font-semibold">To start the backend server:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open a terminal/command prompt</li>
              <li>Navigate to the <code className="bg-gray-200 px-1 rounded">server</code> directory</li>
              <li>Run: <code className="bg-gray-200 px-1 rounded">npm start</code></li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry Connection
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">VIET Admin</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -280,
          }}
          className="fixed lg:sticky top-0 left-0 h-screen w-70 bg-white border-r shadow-lg z-40 flex flex-col"
          style={{ width: '280px' }}
        >
          <div className="p-6 border-b flex-shrink-0">
            <h2 className="text-2xl font-bold text-blue-600">VIET Admin</h2>
            <p className="text-sm text-muted-foreground">Content Management</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex-shrink-0 p-4 border-t bg-white">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {!canAccessCurrentPath && isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Shield className="h-16 w-16 text-amber-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
                <p className="text-gray-600 mb-4 max-w-md">
                  You do not have permission to access this section. Contact your admin to request access.
                </p>
                <Button onClick={() => navigate('/admin/dashboard')}>Go to Dashboard</Button>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout from the admin panel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminLayout;

