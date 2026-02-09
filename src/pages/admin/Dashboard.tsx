import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Bell,
  Newspaper,
  Calendar,
  Image,
  Building2,
  Users,
  Camera,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  announcementsAPI,
  newsAPI,
  eventsAPI,
  carouselAPI,
  departmentsAPI,
  facultyAPI,
  galleryAPI,
  recruitersAPI
} from '@/lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    announcements: 0,
    news: 0,
    events: 0,
    carousel: 0,
    departments: 0,
    faculty: 0,
    gallery: 0,
    recruiters: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const [announcements, news, events, carousel, departments, faculty, gallery, recruiters] = await Promise.all([
          announcementsAPI.getAll().catch((err) => {
            console.error('Error fetching announcements:', err);
            return [];
          }),
          newsAPI.getAll().catch((err) => {
            console.error('Error fetching news:', err);
            return [];
          }),
          eventsAPI.getAll().catch((err) => {
            console.error('Error fetching events:', err);
            return [];
          }),
          carouselAPI.getAll().catch((err) => {
            console.error('Error fetching carousel:', err);
            return [];
          }),
          departmentsAPI.getAll().catch((err) => {
            console.error('Error fetching departments:', err);
            return [];
          }),
          facultyAPI.getAll().catch((err) => {
            console.error('Error fetching faculty:', err);
            return [];
          }),
          galleryAPI.getAll().catch((err) => {
            console.error('Error fetching gallery:', err);
            return [];
          }),
          recruitersAPI.getAll().catch((err) => {
            console.error('Error fetching recruiters:', err);
            return [];
          }),
        ]);

        setStats({
          announcements: Array.isArray(announcements) ? announcements.length : 0,
          news: Array.isArray(news) ? news.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          carousel: Array.isArray(carousel) ? carousel.length : 0,
          departments: Array.isArray(departments) ? departments.length : 0,
          faculty: Array.isArray(faculty) ? faculty.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          recruiters: Array.isArray(recruiters) ? recruiters.length : 0,
        });
      } catch (error: any) {
        console.error('Error fetching stats:', error);
        setError(error.message || 'Failed to load dashboard data. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: Bell, label: 'Announcements', count: stats.announcements, path: '/admin/announcements', color: 'bg-green-500' },
    { icon: Newspaper, label: 'News', count: stats.news, path: '/admin/news', color: 'bg-slate-700' },
    { icon: Calendar, label: 'Events', count: stats.events, path: '/admin/events', color: 'bg-purple-500' },
    { icon: Image, label: 'Carousel Images', count: stats.carousel, path: '/admin/carousel', color: 'bg-pink-500' },
    { icon: Building2, label: 'Departments', count: stats.departments, path: '/admin/departments', color: 'bg-orange-500' },
    { icon: Users, label: 'Faculty', count: stats.faculty, path: '/admin/faculty', color: 'bg-indigo-500' },
    { icon: Camera, label: 'Gallery', count: stats.gallery, path: '/admin/gallery', color: 'bg-slate-700' },
    { icon: Briefcase, label: 'Recruiters', count: stats.recruiters, path: '/admin/recruiters', color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to VIET Admin Panel</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-sm mt-2">
            Make sure the backend server is running on port 3001. 
            <button 
              onClick={() => window.location.reload()} 
              className="ml-2 text-red-600 underline hover:text-red-800"
            >
              Retry
            </button>
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(stat.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.count}</p>
                      </div>
                      <div className={`${stat.color} p-4 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-700">
                      <span>Manage</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/admin/announcements')}
            >
              <Bell className="h-6 w-6 mb-2" />
              Add Announcement
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/admin/news')}
            >
              <Newspaper className="h-6 w-6 mb-2" />
              Add News
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/admin/events')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              Add Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

