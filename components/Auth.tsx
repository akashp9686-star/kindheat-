
import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.ADOPTER);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold">KindHeart</h2>
          <p className="opacity-80 mt-2">{isRegistering ? 'Join our mission' : 'Welcome back'}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setRole(UserRole.ADOPTER)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.ADOPTER ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              For Families
            </button>
            <button 
              onClick={() => setRole(UserRole.ORPHANAGE)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.ORPHANAGE ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              For Orphanages
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(role); }}>
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email / Phone</label>
              <input type="text" placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 mt-2">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <i className="fas fa-phone text-slate-600"></i>
              <span className="text-sm font-medium text-slate-700">Phone</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsRegistering(!isRegistering)} className="text-indigo-600 font-semibold ml-1 hover:underline">
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
