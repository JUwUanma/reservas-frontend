import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

export default function ReservationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading: authLoading } = useContext(AuthContext);
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [canceling, setCanceling] = useState(false);

    // ✅ Usar useCallback para evitar crear una nueva función en cada render
    const fetchReservation = useCallback(async () => {
        try {
            const res = await axios.get(`/api/reservations/${id}`);
            setReservation(res.data.reservation);
        } catch (err) {
            console.error(err);
            alert('Error al cargar la reserva');
            navigate('/reservations');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (!authLoading && id) {
            fetchReservation();
        }
    }, [id, authLoading, fetchReservation]);

    // ✅ Validar si la reserva ya pasó su fecha/hora
    const haPasadoLaReserva = reservation?.fecha_hora && 
        new Date(reservation.fecha_hora) < new Date();

    const handleConfirm = async () => {
        if (!window.confirm('¿Confirmar esta reserva? Se reducirá el stock.')) return;

        setConfirming(true);
        try {
            const res = await axios.post(`/api/reservations/${id}/confirm`);
            if (res.data.success) {
                alert('✅ Reserva confirmada correctamente');
                fetchReservation();
            }
        } catch (err) {
            alert(`❌ Error: ${err.response?.data?.message || 'Error desconocido'}`);
        } finally {
            setConfirming(false);
        }
    };

    const handleCancel = async () => {
        // ✅ Validación frontend: No permitir cancelar reservas pasadas
        if (haPasadoLaReserva) {
            alert('❌ No puedes cancelar reservas que ya han pasado su fecha/hora');
            return;
        }

        if (!window.confirm('¿Cancelar esta reserva?')) return;

        setCanceling(true);
        try {
            const res = await axios.post(`/api/reservations/${id}/cancel`);
            if (res.data.success) {
                alert('✅ Reserva cancelada correctamente');
                fetchReservation();
            }
        } catch (err) {
            alert(`❌ Error: ${err.response?.data?.message || 'Error desconocido'}`);
        } finally {
            setCanceling(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando...</p>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="bg-gray-900 min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <p className="text-white text-xl">Reserva no encontrada</p>
                </main>
                <Footer />
            </div>
        );
    }

    const total = reservation.lineas?.reduce((sum, item) => sum + item.subtotal, 0) || 0;
    const isConfirmed = reservation.estado_id === 2;
    const isCanceled = reservation.estado_id === 3;
    const isPending = reservation.estado_id === 1;

    const getEstadoBadge = () => {
        if (isPending) {
            return (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                    Pendiente
                </span>
            );
        }
        if (isConfirmed) {
            return (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    Confirmada
                </span>
            );
        }
        if (isCanceled) {
            return (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                    Cancelada
                </span>
            );
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col text-gray-300">
            <Header />

            <main className="flex-grow bg-gray-900 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">
                            Reserva id-{reservation.id}
                        </h1>
                        {getEstadoBadge()}
                    </div>

                    {/* ✅ AVISO RESERVA PASADA */}
                    {haPasadoLaReserva && (
                        <div className="bg-orange-500/20 border-2 border-orange-500 text-orange-300 p-6 rounded-2xl mb-8 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Reserva ya pasada</h3>
                                    <p className="text-sm">
                                        Esta reserva ya ha transcurrido su fecha/hora programada 
                                        ({new Date(reservation.fecha_hora).toLocaleString('es-ES')}). 
                                        No se pueden modificar reservas pasadas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detalles principales con FECHA_HORA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 bg-slate-800/60 backdrop-blur-lg p-6 rounded-xl border border-slate-700">
                        <div>
                            <span className="text-gray-400 text-sm block mb-1">🕐 Fecha/Hora Reserva</span>
                            <p className={`font-bold text-lg ${haPasadoLaReserva ? 'text-orange-400' : 'text-white'}`}>
                                {reservation.fecha_hora 
                                    ? new Date(reservation.fecha_hora).toLocaleString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : <span className="text-gray-500">Sin hora asignada</span>
                                }
                            </p>
                        </div>
                        
                        <div>
                            <span className="text-gray-400 text-sm block mb-1">🏢 Empresa</span>
                            <p className="text-white font-bold text-lg">{reservation.empresa?.nombre}</p>
                        </div>
                        
                        <div>
                            <span className="text-gray-400 text-sm block mb-1">📅 Fecha Creación</span>
                            <p className="text-white font-bold text-lg">
                                {new Date(reservation.created_at).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>

                    {/* Tabla de items */}
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full bg-slate-800 rounded-lg overflow-hidden shadow-xl">
                            <thead className="bg-slate-700">
                                <tr>
                                    <th className="p-4 text-left text-blue-400 font-semibold">Producto</th>
                                    <th className="p-4 text-center text-blue-400 font-semibold">Cantidad</th>
                                    <th className="p-4 text-center text-blue-400 font-semibold">Precio Unit.</th>
                                    <th className="p-4 text-center text-blue-400 font-semibold">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservation.lineas?.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
                                    >
                                        <td className="p-4 font-medium text-gray-300">
                                            {item.producto?.nombre || 'N/A'}
                                        </td>
                                        <td className="p-4 text-center text-white font-bold">
                                            {item.cantidad}
                                        </td>
                                        <td className="p-4 text-center text-gray-400">
                                            {item.precio_unitario.toFixed(2)}€
                                        </td>
                                        <td className="p-4 text-right text-blue-400 font-bold">
                                            {item.subtotal.toFixed(2)}€
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end mb-8">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full md:w-96">
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white mb-2">
                                    Total: <span className="text-blue-400 text-3xl">{total.toFixed(2)}€</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-4 justify-end flex-wrap">
                        <button
                            onClick={() => navigate('/reservations')}
                            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                            ← Volver a Reservas
                        </button>

                        {isPending && (
                            <>
                                <button
                                    onClick={handleConfirm}
                                    disabled={confirming || haPasadoLaReserva}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {confirming ? 'Confirmando...' : '✅ Confirmar Reserva'}
                                </button>

                                {/* ✅ Botón cancelar CONDICIONAL */}
                                {!haPasadoLaReserva ? (
                                    <button
                                        onClick={handleCancel}
                                        disabled={canceling}
                                        className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {canceling ? 'Cancelando...' : '❌ Cancelar Reserva'}
                                    </button>
                                ) : (
                                    <div className="px-8 py-3 bg-gray-700 text-gray-400 rounded-xl font-semibold text-sm flex items-center gap-2 opacity-75">
                                        <span className="text-orange-400">⏰</span>
                                        Cancelación no disponible
                                    </div>
                                )}
                            </>
                        )}

                        {isConfirmed && !haPasadoLaReserva && (
                            <button
                                onClick={handleCancel}
                                disabled={canceling}
                                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {canceling ? 'Cancelando...' : '❌ Cancelar Reserva'}
                            </button>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}