import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';
import Header from '../components/Header';


export default function Home() {
    const { loading } = useContext(AuthContext); // ✅ Agregado loading
    const setMobileMenuOpen = useState(false);
    const navigate = useNavigate();

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
            <Header />

            <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold mb-4 text-gray-100">
                    Bienvenido a <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Reserva!</span>
                </h1>
                <p className="text-lg mb-8 text-gray-300">
                    Organiza y gestiona tus reservas de manera fácil y rápida.
                </p>
                <button
                    onClick={() => navigate('/companies')}
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

            <Footer />
        </div>
    );
}