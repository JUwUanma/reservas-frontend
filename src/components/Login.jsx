import React, { useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const navigation = [
    { name: 'Inicio', href: '/', current: false },
    { name: 'Empresas', href: '/companies', current: false },
    { name: 'Reservas', href: '/reservations', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Login() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", pass: "" });
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);

   const handleNavigation = (href) => {
          navigate(href);
          setMobileMenuOpen(false);
      };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
        console.log("🔐 Iniciando login...");
        
        // 1. Obtener CSRF cookie
        await axios.get("/sanctum/csrf-cookie");
        console.log("✅ CSRF cookie obtenida");

        // 2. Esperar más tiempo
        await new Promise(resolve => setTimeout(resolve, 300));

        // 3. Enviar login
        const response = await axios.post("/api/login", form);
        console.log("✅ Login exitoso:", response.data);
        
        // 4. Actualizar contexto sin verificar inmediatamente
        login(response.data.usuario);

        setMessage("Login correcto ✅");
        
        // 5. Verificar cookies
        console.log("🍪 Cookies:", document.cookie);
        
        // 6. Redirigir CON RECARGA COMPLETA (importante)
        setTimeout(() => {
            //window.location.href = "/";
            navigate("/");
        }, 800);
        
    } catch (err) {
        console.error("❌ Error:", err);
        
        if (err.response?.status === 401) {
            setMessage("Credenciales incorrectas ❌");
        } else if (err.response?.status === 419) {
            setMessage("Error de sesión. Intenta de nuevo ❌");
        } else {
            setMessage("Error de login ❌");
        }
    }
};

  return (
    <>
      <div className="bg-gray-900 min-h-screen flex flex-col text-gray-300">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Reserva!
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-300 hover:text-white',
                      'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/5'
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex space-x-4">
                <button
                    onClick={() => handleNavigation('/login')}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                    onClick={() => handleNavigation('/register')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                >
                  Registrarse
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                    <nav className="md:hidden pb-4 space-y-2">
                        {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                            item.current ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:text-white',
                            'block px-4 py-2 rounded-md text-sm font-medium transition-all'
                            )}
                        >
                            {item.name}
                        </a>
                        ))}

                        {/* Botones para móvil */}
                        <div className="mt-4 space-y-2">
                        <button
                            onClick={() => handleNavigation('/login')}
                            className="w-full px-4 py-2 text-gray-300 hover:text-white transition-colors border border-gray-600 rounded-md"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => handleNavigation('/register')}
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all"
                        >
                            Registrarse
                        </button>
                        </div>
                    </nav>
                    )}
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-xl max-w-md w-full"
          >
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 uppercase tracking-wider">
              Iniciar Sesión
            </h2>

            {message && (
              <p
                className={`mb-6 p-3 rounded text-center font-semibold ${
                  message.includes("correcto") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="correo">
                Correo
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <div className="mb-7">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="pass">
                Contraseña
              </label>
              <input
                id="pass"
                name="pass"
                type="password"
                placeholder="********"
                value={form.pass}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition duration-200"
            >
              Entrar
            </button>
          </form>
        </main>

        <footer className="bg-gray-800 text-gray-300 py-6 mt-12 text-center">
          <p>© 2025 Reserva!. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  );
}