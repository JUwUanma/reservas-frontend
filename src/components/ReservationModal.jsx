import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function ReservationModal({ product, onClose, onSuccess }) {
    const [cantidad, setCantidad] = useState(1);
    const [fechaReserva, setFechaReserva] = useState(new Date().toISOString().split('T')[0]); // ✅ Hoy por defecto
    const [horaReserva, setHoraReserva] = useState('');
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [error, setError] = useState('');

    // ✅ Cargar slots disponibles del producto
    useEffect(() => {
        let isMounted = true;
        
        const loadSlots = async () => {
            try {
                setLoadingSlots(true);
                const response = await axios.get(`/api/products/${product.id}/slots`);
                
                if (isMounted && response.data.success) {
                    setSlots(response.data.slots || []);
                    if (response.data.hasTimeRestriction && response.data.slots?.length > 0) {
                        // ✅ Seleccionar primera hora válida (no pasada)
                        const primeraHoraValida = response.data.slots.find(slot => 
                            esHoraValidaParaHoy(slot)
                        );
                        setHoraReserva(primeraHoraValida || response.data.slots[0]);
                    }
                }
            } catch (err) {
                console.error('Error cargando slots:', err);
                if (isMounted) setSlots([]);
            } finally {
                if (isMounted) setLoadingSlots(false);
            }
        };

        if (product) {
            loadSlots();
        }

        return () => {
            isMounted = false;
        };
    }, [product?.id]);

    // ✅ Función para validar si una hora es válida para HOY
    const esHoraValidaParaHoy = (hora) => {
        const ahora = new Date();
        const [horaActual, minutoActual] = [
            ahora.getHours().toString().padStart(2, '0'),
            ahora.getMinutes().toString().padStart(2, '0')
        ];
        const horaActualStr = `${horaActual}:${minutoActual}`;

        return hora >= horaActualStr;
    };

    // ✅ Función para filtrar slots válidos según fecha
    const getSlotsValidos = () => {
        if (fechaReserva !== new Date().toISOString().split('T')[0]) {
            // Si no es hoy, todas las horas son válidas
            return slots;
        }
        // Si es hoy, filtrar horas pasadas
        return slots.filter(slot => esHoraValidaParaHoy(slot));
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        if (value <= product.stock) {
            setCantidad(value);
            setError('');
        } else {
            setError(`Stock máximo disponible: ${product.stock}`);
        }
    };

    const handleIncrement = () => {
        if (cantidad < product.stock) {
            setCantidad(cantidad + 1);
            setError('');
        } else {
            setError(`Stock máximo disponible: ${product.stock}`);
        }
    };

    const handleDecrement = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
            setError('');
        }
    };

    const handleFechaChange = (e) => {
        const nuevaFecha = e.target.value;
        setFechaReserva(nuevaFecha);
        
        // ✅ Si cambian a una fecha futura, permitir todas las horas
        if (nuevaFecha !== new Date().toISOString().split('T')[0]) {
            setHoraReserva(slots[0] || '');
        } else {
            // Si es hoy, seleccionar primera hora válida
            const primeraValida = getSlotsValidos()[0];
            setHoraReserva(primeraValida || '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // ✅ Validar fecha y hora si hay slots
        if (slots.length > 0 && (!fechaReserva || !horaReserva)) {
            setError('Debes seleccionar fecha y hora de reserva');
            setLoading(false);
            return;
        }

        if (slots.length === 0 && !fechaReserva) {
            setError('Debes seleccionar una fecha de reserva');
            setLoading(false);
            return;
        }

        // ✅ Validar que la hora no sea pasada para HOY
        if (fechaReserva === new Date().toISOString().split('T')[0] && !esHoraValidaParaHoy(horaReserva)) {
            setError('No puedes reservar para horas pasadas del día actual');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/reservations', {
                empresa_id: product.empresa_id,
                items: [{
                    producto_id: product.id,
                    cantidad: cantidad,
                    fecha_reserva: fechaReserva,
                    hora_reserva: horaReserva || null,
                }],
            });

            if (response.data.success) {
                alert(`✅ ${cantidad} unidad(es) reservada(s) correctamente para ${fechaReserva} ${horaReserva}`);
                onSuccess(response.data.reservation_id);
                onClose();
            }
        } catch (err) {
            console.error('Error completo:', err);
            let errorMessage = 'Error al crear la reserva';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                errorMessage = Object.values(err.response.data.errors)
                    .flat()
                    .join(', ');
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Calcular fecha máxima (30 días)
    const fechaMaxima = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 30);
    const fechaMaxStr = fechaMaxima.toISOString().split('T')[0];

    const slotsValidos = getSlotsValidos();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">
                    Reservar {product.nombre}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Info del producto */}
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-gray-400">
                            💲 Precio: <span className="text-white font-semibold">{product.precio}€</span>
                        </p>
                        <p className="text-gray-400 mt-2">
                            📦 Stock disponible: <span className="text-white font-semibold">{product.stock}</span>
                        </p>
                    </div>

                    {/* Selector de cantidad */}
                    <div className="space-y-2">
                        <label className="block text-gray-300 font-semibold">
                            Cantidad
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleDecrement}
                                disabled={cantidad <= 1}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-bold w-12 h-12 flex items-center justify-center"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={cantidad}
                                onChange={handleQuantityChange}
                                className="w-20 px-3 py-2 bg-slate-700 text-white text-center border border-slate-600 rounded-lg focus:border-blue-400 outline-none text-lg font-bold"
                            />
                            <button
                                type="button"
                                onClick={handleIncrement}
                                disabled={cantidad >= product.stock}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-bold w-12 h-12 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Subtotal: <span className="text-blue-400 font-semibold">
                                {(product.precio * cantidad).toFixed(2)}€
                            </span>
                        </p>
                    </div>

                    {/* ✅ Selector FECHA + HORA con validación de horas pasadas */}
                    {loadingSlots ? (
                        <div className="text-center py-4">
                            <p className="text-gray-400 text-sm">Cargando horarios disponibles...</p>
                        </div>
                    ) : slots.length > 0 ? (
                        <div className="space-y-4">
                            {/* Selector FECHA */}
                            <div>
                                <label className="block text-gray-300 font-semibold mb-2">
                                    📅 Fecha de reserva *
                                </label>
                                <input
                                    type="date"
                                    value={fechaReserva}
                                    min={new Date().toISOString().split('T')[0]}
                                    max={fechaMaxStr}
                                    onChange={handleFechaChange}
                                    required
                                    className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-blue-400 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Máximo 30 días desde hoy
                                </p>
                            </div>

                            {/* Selector HORA */}
                            <div>
                                <label className="block text-gray-300 font-semibold mb-2">
                                    🕐 Hora de reserva *
                                </label>
                                <select
                                    value={horaReserva}
                                    onChange={(e) => setHoraReserva(e.target.value)}
                                    required
                                    disabled={slotsValidos.length === 0}
                                    className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-blue-400 outline-none disabled:bg-slate-900 disabled:cursor-not-allowed"
                                >
                                    <option value="">Selecciona una hora</option>
                                    {slotsValidos.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                                {fechaReserva === new Date().toISOString().split('T')[0] && slotsValidos.length < slots.length && (
                                    <p className="text-xs text-orange-400 mt-1">
                                        ⚠️ Solo horas disponibles para hoy
                                    </p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">
                                    Horario disponible: {product.hora_ini} - {product.hora_fin}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-gray-300 font-semibold mb-2">
                                📅 Fecha de reserva *
                            </label>
                            <input
                                type="date"
                                value={fechaReserva}
                                min={new Date().toISOString().split('T')[0]}
                                max={fechaMaxStr}
                                onChange={handleFechaChange}
                                required
                                className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-blue-400 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Máximo 30 días desde hoy
                            </p>
                            <p className="text-gray-400 text-sm text-center py-2 mt-2">
                                ⏰ Sin restricción horaria
                            </p>
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (slots.length > 0 && (!fechaReserva || !horaReserva)) || (slots.length === 0 && !fechaReserva)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Reservando...' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}