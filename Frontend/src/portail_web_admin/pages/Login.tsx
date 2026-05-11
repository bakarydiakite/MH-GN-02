import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const HERO_IMAGE = '/hero-login.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { redirectPath } = await login(email, password);
      if (redirectPath === '/mobile') {
        setError('ℹ️ Les agents et familles doivent utiliser l\'application mobile.');
        setLoading(false);
        return;
      }
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@naissancechain.gn', role: 'Admin', password: 'password123' },
    { email: 'superviseur@naissancechain.gn', role: 'Superviseur', password: 'password123' },
  ];

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* Left Side: Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={HERO_IMAGE} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Guinea Innovation"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/90 via-emerald-800/50 to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between w-full h-full text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Lock size={20} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase opacity-60">Gouvernement de Guinée</p>
              <h2 className="text-lg font-black tracking-tight">NaissanceChain</h2>
            </div>
          </div>

          <div className="max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-black leading-tight mb-6"
            >
              Modernisez l&apos;État Civil Guinéen
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-emerald-50 opacity-80 mb-10 leading-relaxed"
            >
              Rejoignez la révolution numérique et sécurisez l&apos;identité de chaque citoyen sur la blockchain nationale. Simple, infalsifiable et transparent.
            </motion.p>

            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Naissances" value="50k+" delay={0.2} />
              <StatCard label="Centres" value="120+" delay={0.3} />
              <StatCard label="Sécurité" value="100%" delay={0.4} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-emerald-800" alt="user" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-emerald-800 bg-emerald-700 flex items-center justify-center text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-100/80">
              Plus de 2,000 agents utilisent déjà la plateforme.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Bienvenue !</h2>
            <p className="text-slate-500">Connectez-vous à votre portail d&apos;administration pour continuer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm animate-shake">
                <AlertCircle size={18} />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">Mot de passe</label>
                <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Mot de passe oublié ?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" id="remember" />
              <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer">Se souvenir de moi</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative px-4 bg-gray-50/50 text-xs font-bold text-slate-400 uppercase tracking-widest">Ou continuer avec</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <SocialBtn icon="https://www.svgrepo.com/show/355037/google.svg" label="Google" />
              <SocialBtn icon="https://www.svgrepo.com/show/353733/facebook.svg" label="Facebook" />
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Vous n&apos;avez pas de compte ?{' '}
              <button className="text-emerald-600 font-black hover:underline underline-offset-4">Inscrivez-vous</button>
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div className="mt-12 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 text-center">Accès rapide (Démo)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {demoAccounts.map(a => (
                <button 
                  key={a.email}
                  onClick={() => { setEmail(a.email); setPassword(a.password); }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-[11px] font-bold text-slate-700 hover:text-emerald-700 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} className="text-slate-400" />
                  {a.role}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl"
    >
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-xs font-bold text-emerald-100/60 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

function SocialBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]">
      <img src={icon} className="w-5 h-5" alt={label} />
      <span className="font-bold text-slate-700">{label}</span>
    </button>
  );
}
