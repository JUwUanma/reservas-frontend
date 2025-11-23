import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const navigation = [
    { name: 'Inicio', href: '/', current: false },
    { name: 'Empresas', href: '/companies', current: true },
    { name: 'Reservas', href: '/reservations', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Companies() {
    const { user, logout, loading } = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get('/api/companies')
        .then(response => {
            setCompanies(response.data);
        })
        .catch(error => {
            console.error('Error fetching empresas:', error);
        });
    }, []);

    const handleNavigation = (href) => {
        navigate(href);
        setMobileMenuOpen(false);
    };
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
            <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-10 text-center">
                    Lista de Empresas
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.map((company) => (
                    <div
                        key={company.id}
                        className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full min-h-[260px] hover:-translate-y-2 hover:border-blue-400"
                    >
                        <h3 className="text-xl font-semibold text-blue-400">
                            {company.nombre}
                        </h3>
                            <div className="mt-4 text-sm text-gray-400 space-y-1">
                                <p><span className="text-gray-500">📍 Dirección:</span> {company.direccion}</p>
                                <p><span className="text-gray-500">📞 Teléfono:</span> {company.telefono}</p>
                                <p><span className="text-gray-500">✉️ Email:</span> {company.email}</p>
                            </div>
                        

                        <button
                            onClick={() => navigate(`/products/${company.id}`)}
                            className="mt-auto w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Ver productos
                        </button>
                    </div>
                    ))}
                </div>
            </main>
            <footer className="bg-gray-800 text-gray-300 py-6 mt-12 text-center">
                <p>© 2025 Reserva!. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}