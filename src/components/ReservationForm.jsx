import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const navigation = [
    { name: 'Inicio', href: '/', current: true },
    { name: 'Empresas', href: '/companies', current: false },
    { name: 'Reservas', href: '/reservations', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ReservationForm() {

    const [isAuthenticated, logout] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();


    const handleNavigation = (href) => {
        navigate(href);
        setMobileMenuOpen(false);
    };


    const { productId } = useParams(); // /products/:productId/reserve
    const [product, setProduct] = useState(null);
    const [company, setCompany] = useState(null);

    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [horasDisponibles, setHorasDisponibles] = useState([]);

    const [errores, setErrores] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        axios.get(`/api/products/${productId}/reserve`)
            .then(res => {
                setProduct(res.data.product);
                setCompany(res.data.product.company);
                generarHoras(res.data.product.company);
            });
    }, [productId]);

    // Genera franjas horarias según apertura/cierre de la empresa
    const generarHoras = (company) => {
        const apertura = company.hora_apertura; // "10:00"
        const cierre = company.hora_cierre;     // "00:00" o "23:59"

        const listaHoras = [];
        let h = apertura;

        // Evitar bucles infinitos
        for (let i = 0; i < 48; i++) {
            listaHoras.push(h);

            // Sumar 30 minutos
            let [hour, minute] = h.split(":").map(Number);
            minute += 30;
            if (minute >= 60) {
                minute = 0;
                hour++;
            }

            const nueva = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            if (nueva > cierre) break;
            h = nueva;
        }

        setHorasDisponibles(listaHoras);
    };

    // Enviar reserva
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`/api/products/${productId}/reserve`, {
            product_id: productId,
            fecha,
            hora_inicio: horaInicio,
            hora_fin: horaFin
        })
            .then(res => {
                setSuccess("Reserva creada correctamente.");
                setErrores(null);
            })
            .catch(error => {
                setErrores(error.response?.data?.errors || "Error al reservar");
            });
    };

    if (!product || !company) return <p>Cargando...</p>;

    return (
        <div className="max-w-lg mx-auto bg-slate-800 p-8 mt-10 rounded-xl shadow-lg text-gray-200">
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
                            {!isAuthenticated ? (
                                <>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        Iniciar sesión</button>
                                    <button 
                                        onClick={() => navigate('/register')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Registrarse</button>
                                </>
                            ) : (
                                <button o
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Cerrar sesión</button>
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
            
            <h1 className="text-3xl font-bold text-center text-white mb-6">
                Reservar {product.nombre}
            </h1>

            <p className="text-center text-gray-400 mb-4">
                Horario disponible: {company.hora_apertura} - {company.hora_cierre}
            </p>

            {errores && (
                <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
                    {typeof errores === "string"
                        ? errores
                        : Object.values(errores).flat().map((e, i) => <p key={i}>{e}</p>)}
                </div>
            )}

            {success && (
                <div className="bg-green-500/20 text-green-400 p-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* FECHA */}
                <div>
                    <label className="block text-sm mb-1">Fecha:</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                        className="w-full p-2 bg-slate-700 rounded"
                    />
                </div>

                {/* HORA INICIO */}
                <div>
                    <label className="block text-sm mb-1">Hora inicio:</label>
                    <select
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        required
                        className="w-full p-2 bg-slate-700 rounded"
                    >
                        <option value="">Selecciona...</option>
                        {horasDisponibles.map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>

                {/* HORA FIN */}
                <div>
                    <label className="block text-sm mb-1">Hora fin:</label>
                    <select
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        required
                        className="w-full p-2 bg-slate-700 rounded"
                    >
                        <option value="">Selecciona...</option>
                        {horasDisponibles.map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded text-white mt-4"
                >
                    Confirmar reserva
                </button>
            </form>

            <footer className="bg-gray-800 text-gray-300 py-6 mt-12 text-center">
                <p>© 2025 Reserva!. Todos los derechos reservados.</p>
            </footer>

        </div>
    );
}
