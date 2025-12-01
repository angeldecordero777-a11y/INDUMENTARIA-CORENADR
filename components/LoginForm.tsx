import React, { useState } from 'react';
import { USERS } from '../constants';
import { User } from '../types';
import { ShieldCheck } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = USERS.find(u => u.username === username && u.pass === password);
    
    if (foundUser) {
      onLogin({
        username: foundUser.username,
        fullName: foundUser.name,
        role: 'ADMIN'
      });
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-8 border-cdmx-guinda">
        <div className="flex justify-center mb-6">
          <ShieldCheck className="h-16 w-16 text-cdmx-gold" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          CONTROL DE INDUMENTARIA
        </h2>
        <h3 className="text-lg text-center text-cdmx-gold font-semibold mb-6">
          "PROGRAMA ALTEPETL BIENESTAR"
        </h3>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-cdmx-gold focus:border-cdmx-gold"
              placeholder="Ingrese su usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-cdmx-gold focus:border-cdmx-gold"
              placeholder="Ingrese su contraseña"
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-cdmx-guinda text-white py-2 px-4 rounded-md hover:bg-[#851b35] transition-colors font-bold"
          >
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
};