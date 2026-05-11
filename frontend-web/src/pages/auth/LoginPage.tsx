import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { authService } from '../../services/api';
import { motion } from 'framer-motion';

interface User {
  id: string;
  username: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotations, setRotations] = useState<{ rx: number; ry: number }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const usersData = await authService.getAllUsers();
        setUsers(usersData);
      } catch {
        setUsers([]);
      }
    };
    getAllUsers();
  }, []);

  useEffect(() => {
    // Initialize random rotations for each letter
    setRotations(
      Array.from({ length: 6 }, () => ({
        rx: (Math.random() - 0.5) * 20,
        ry: (Math.random() - 0.5) * 20,
      }))
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      setMousePosition({ x: rotateY, y: -rotateX });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    const userExists = users.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (!userExists) {
      toast.error('El usuario no existe');
      return;
    }
    
    try {
      await login(username, password);
      navigate('/');
    } catch {
      toast.error('Contraseña incorrecta');
    }
  };

  const letters = ['W', 'O', 'R', 'D', 'L', 'E'];
  const letterColors = [
    'from-cyan-400 to-blue-600',
    'from-purple-400 to-pink-600',
    'from-yellow-400 to-orange-600',
    'from-green-400 to-emerald-600',
    'from-pink-400 to-rose-600',
    'from-indigo-400 to-purple-600',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#1a1a2e]">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move"></div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating cubes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`cube-${i}`}
            className="absolute"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              rotateX: Math.random() * 360,
              rotateY: Math.random() * 360,
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              rotateX: [null, Math.random() * 360],
              rotateY: [null, Math.random() * 360],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              width: 20 + Math.random() * 30,
              height: 20 + Math.random() * 30,
            }}
          >
            <div className="w-full h-full border border-purple-500/20 transform-style-3d animate-spin-slow">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            </div>
          </motion.div>
        ))}

        {/* Light beams */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`beam-${i}`}
            className="absolute w-1 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"
            style={{
              left: `${20 + i * 30}%`,
              top: 0,
              height: '100%',
              animation: `beam-fall ${3 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          ></div>
        ))}

        {/* Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(236,72,153,0.8) 0%, transparent 70%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
              y: [0, -30 - Math.random() * 50],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md w-full px-6">
        {/* 3D Floating WORDLE Title with individual letter animations */}
        <div className="mb-12 perspective-1000">
          <motion.div 
            className="flex justify-center gap-3 mb-8"
            style={{ perspective: '1000px' }}
          >
            {letters.map((letter, index) => (
              <motion.div
                key={index}
                className="relative"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  y: [0, -15 + Math.random() * 10, 0],
                  rotateX: [0, rotations[index]?.rx || 0, 0],
                  rotateY: [0, rotations[index]?.ry || 0, 0],
                  rotateZ: [0, (Math.random() - 0.5) * 10, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.2,
                  rotateY: 180,
                  transition: { duration: 0.5 },
                }}
              >
                {/* 3D depth layers */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${letterColors[index]} rounded-xl transform translate-x-1.5 translate-y-1.5 blur-md opacity-60`}
                ></div>
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${letterColors[index]} rounded-xl transform translate-x-0.5 translate-y-0.5 opacity-80`}
                ></div>
                
                {/* Main letter block */}
                <div className={`relative bg-gradient-to-br ${letterColors[index]} text-white font-black text-5xl w-16 h-16 flex items-center justify-center rounded-xl shadow-2xl border-2 border-white/20`}>
                  <span className="drop-shadow-2xl filter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                    {letter}
                  </span>
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl"></div>
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.3)]"></div>
                </div>

                {/* Letter shadow on "floor" */}
                <div 
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-black/30 rounded-full blur-sm"
                  style={{
                    animation: `shadow-pulse ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                ></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            className="text-center text-purple-300/60 text-sm font-light tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            El Juego de Palabras
          </motion.p>
        </div>

        {/* Login Card with 3D tilt effect */}
        <motion.div
          ref={cardRef}
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.3 },
          }}
        >
          {/* 3D shadow layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-600/30 to-blue-600/40 rounded-3xl transform translate-y-4 blur-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl transform translate-y-2 blur-xl"></div>
          
          {/* Card border glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-50 blur-sm animate-gradient-xy"></div>
          
          {/* Main card */}
          <div className="relative bg-[#0f0f1a]/90 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Scanning line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan"></div>
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/30 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-pink-500/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-pink-500/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl"></div>

            <div className="relative">
              {/* Title with glow */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '0 0 30px rgba(139,92,246,0.5)' }}>
                  Iniciar Sesión
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto rounded-full"></div>
              </motion.div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Username input */}
                  <div className="relative group transition-transform duration-300 focus-within:scale-[1.02]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 transition-opacity duration-500 animate-gradient-xy"></div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="w-full bg-[#1a1a2e]/80 backdrop-blur-md border border-purple-500/30 text-white placeholder-purple-300/50 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Password input */}
                  <div className="relative group transition-transform duration-300 focus-within:scale-[1.02]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 transition-opacity duration-500 animate-gradient-xy"></div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full bg-[#1a1a2e]/80 backdrop-blur-md border border-purple-500/30 text-white placeholder-purple-300/50 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  className="relative w-full group overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Button content */}
                  <div className="relative bg-transparent text-white font-black py-4 px-6 rounded-xl border border-white/20 flex items-center justify-center gap-2">
                    <span className="drop-shadow-lg tracking-wider">ENTRAR</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>
                
                {/* Register link */}
                <div className="text-center">
                  <Link 
                    to="/register" 
                    className="text-purple-300/80 hover:text-purple-200 font-medium transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span>¿No tienes cuenta?</span>
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-semibold underline decoration-2 underline-offset-4 decoration-purple-500/50 group-hover:decoration-pink-400 transition-all">
                      Regístrate aquí
                    </span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Footer decoration */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center gap-4 text-purple-500/30 text-xs">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/30"></div>
            <span className="tracking-widest uppercase">WORDLE Challenge</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/30"></div>
          </div>
        </motion.div>
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        
        @keyframes beam-fall {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes shadow-pulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
          50% { transform: translateX(-50%) scale(1.5); opacity: 0.1; }
        }
        
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 200%; }
        }
        
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;