import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReservationModal from '../components/ReservationModal';
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function ProductsCompanies() {
    const { user, loading } = useContext(AuthContext);

    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [company, setCompany] = useState(null);

    const [products, setProducts] = useState([]);


    const [selectedProduct, setSelectedProduct] = useState(null); // para modal
    const [reservationId, setReservationId] = useState(null);

    const handleReserveClick = (product) => {
        if (!user || !user.id) {
            alert('Debes iniciar sesión para reservar un producto.');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        setSelectedProduct(product); // Abrir modal
    };

    const handleReservationSuccess = (id) => {
        setReservationId(id);
        // Opcional: redirigir a página de resumen
        // navigate(`/reservations/${id}`);
    };



    useEffect(() => {
        axios.get(`/api/products/${id}`)
        .then(response => {
            setProducts(response.data.products);
            setCompany(response.data.company);
        })
        .catch(error => {
            console.error('Error fetching empresas:', error);
        });
    }, [id]);


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
            <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {company ? company.nombre : ''}
                </h1>
                <p className="text-xl text-center text-gray-400 mb-8">{company ? company.descripcion : ''}</p>

                
                <h2 className="text-3xl font-bold text-white mb-10 text-center">
                    {products || products.length > 0 ? "Listado de Productos" : "No hay productos disponibles para esta empresa."}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full min-h-[285px] hover:-translate-y-2 hover:border-blue-400"
                    >
                        <h3 className="text-xl font-semibold text-blue-400">
                            {product.nombre}
                        </h3>

                        <div className="mt-4 text-sm text-gray-400 space-y-1">
                            <p><span className="text-gray-500">💲 Precio:</span> {product.precio}€</p>
                            <p><span className="text-gray-500">⏳ Stock Disponible:</span> {product.stock} unidades</p>
                            <p className="break-all"><span className="text-gray-500">📄 Descripción:</span> {product.descripcion? product.descripcion : '...'}</p>

                        </div>
                        
                        <button
                            onClick={() => handleReserveClick(product)}
                            className="mt-auto w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                                Reservar
                        </button>
                       
                    </div>
                    
                    ))}
                    
                </div>

                {/* Modal de reserva */}
                {selectedProduct && (
                    <ReservationModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onSuccess={handleReservationSuccess}
                    />
                )}


                <div className="mt-8 text-center">
                    <button
                            onClick={() => navigate(`/companies`)}
                            className="mt-auto w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Volver
                        </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}