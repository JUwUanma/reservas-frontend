import React, { useState, useEffect, useContext } from 'react';
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const navigation = [
    { name: 'Inicio', href: '/', current: true },
    { name: 'Empresas', href: '/companies', current: false },
    { name: 'Reservas', href: '/reservations', current: false },
];


function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}


export default function Home() {
    const { user, logout, loading } = useContext(AuthContext); // ✅ Agregado loading
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // ✅ useEffect SIEMPRE al nivel superior, antes de cualquier return condicional
    //useEffect(() => {
    //    fetchHomeData();
    //}, []);

    //const fetchHomeData = async () => {
    //    try {
    //        await axios.get('/api/');
    //    } catch (err) {
    //        console.error('Error al obtener datos:', err);
    //    }
    //};

    const handleNavigation = (href) => {
        navigate(href);
        setMobileMenuOpen(false);
    };

    // ✅ Condicional DESPUÉS de todos los hooks
    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando...</p>
            </div>
        );
    }

    return (
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
                            {!user ? (
                                <>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        Iniciar sesión
                                    </button>
                                    <button 
                                        onClick={() => navigate('/register')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Registrarse
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                                >
                                    Cerrar sesión
                                </button>
                            )}
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
                                {!user ? (
                                    <>
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
                                    </>
                                ) : (
                                    <button
                                        onClick={logout}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:shadow-lg transition-all"
                                    >
                                        Cerrar sesión
                                    </button>
                                )}
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold mb-4 text-gray-100">
                    Bienvenido a <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Reserva!</span>
                </h1>
                <p className="text-lg mb-8 text-gray-300">
                    Organiza y gestiona tus reservas de manera fácil y rápida.
                </p>
                <button
                    onClick={() => handleNavigation('/companies')}
                    className="mb-12 px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition duration-200"
                >
                    Navegar Empresas
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="feature-card bg-gray-800 p-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:translate-y-4 transition-all">
                        <h3 className="text-xl font-semibold mb-2 text-gray-100">Gestiona tus reservas</h3>
                        <p>Controla tus reservas de manera rápida y eficiente.</p>
                    </div>
                    <div className="feature-card bg-gray-800 p-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:translate-y-4 transition-all">
                        <h3 className="text-xl font-semibold mb-2 text-gray-100">Empresas disponibles</h3>
                        <p>Explora y gestiona las empresas asociadas.</p>
                    </div>
                    <div className="feature-card bg-gray-800 p-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:translate-y-4 transition-all">
                        <h3 className="text-xl font-semibold mb-2 text-gray-100">Reportes y estadísticas</h3>
                        <p>Visualiza estadísticas de uso y desempeño.</p>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 text-gray-300 py-6 mt-12 text-center">
                <p>© 2025 Reserva!. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}