import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authAPI } from '@/lib/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
      navigate('/admin/dashboard');
    } catch (err: any) {
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please ensure the backend server is running.');
      } else {
        setError(err.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50">
      {/* Base background */}
      <div className="absolute inset-0 bg-slate-50" />

      {/* Animated gradient background */}
      <div className="absolute inset-0 admin-login-bg-morph-light" style={{ background: 'radial-gradient(ellipse 100% 80% at 30% 20%, rgba(148,163,184,0.08), transparent 50%), radial-gradient(ellipse 80% 60% at 70% 80%, rgba(203,213,225,0.06), transparent 50%)' }} />

      {/* Floating orbs - soft pastels for light theme */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-200/60 blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-sky-200/50 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-slate-200/50 blur-[90px]"
      />

      {/* Animated grid lines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div
        className="absolute inset-0 opacity-20 admin-login-grid-drift"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-slate-400/40"
          style={{
            left: `${15 + i * 7}%`,
            top: `${10 + (i % 5) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Logo with float animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <motion.img
              src="/logo-viet.png"
              alt="VIET"
              className="mx-auto h-28 w-auto object-contain drop-shadow-lg"
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-slate-700 text-base md:text-lg font-medium tracking-[0.12em] leading-snug max-w-sm mx-auto mt-6 uppercase"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            Visakha Institute of Engineering & Technology
          </motion.h1>
        </motion.div>

        {/* Login form card with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative group"
        >
          {/* Subtle border shadow on hover */}
          <div className="absolute -inset-px rounded-2xl bg-slate-200/50 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
            {/* Shine overlay */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full"
                animate={{ x: ['0%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-bold text-slate-800 mb-6 text-center tracking-tight"
            >
              Admin Portal
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5 relative">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="[&>div]:rounded-xl"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-slate-700 font-medium text-sm">Username or Email</Label>
                <div className="group/input relative">
                  <div className="absolute -inset-[1px] rounded-2xl bg-slate-300/30 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-1 py-1 transition-all duration-300 group-focus-within/input:border-slate-400 group-focus-within/input:bg-white group-hover/input:border-slate-300">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username or email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 min-w-0 h-11 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-800 placeholder:text-slate-400 text-[15px] px-3"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                <div className="group/input relative">
                  <div className="absolute -inset-[1px] rounded-2xl bg-slate-300/30 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-1 py-1 transition-all duration-300 group-focus-within/input:border-slate-400 group-focus-within/input:bg-white group-hover/input:border-slate-300">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                      <Lock className="h-4 w-4 text-slate-500" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 min-w-0 h-11 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-800 placeholder:text-slate-400 text-[15px] px-3"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base shadow-lg shadow-slate-300/50 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="inline-block w-4 h-4 border-2 border-slate-300 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Powered by with animated underline */}
        <motion.a
          href="https://www.zyxtechsolutions.in"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="group/link block text-center mt-10"
        >
          <span className="relative inline-block text-slate-500 group-hover/link:text-slate-700 text-xs md:text-sm tracking-[0.25em] uppercase transition-colors duration-300">
            Powered by ZYX Tech Solutions
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-500 group-hover/link:w-full transition-all duration-300" />
          </span>
        </motion.a>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
