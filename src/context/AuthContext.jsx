import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const response = await axios.get("/api/user");
            setUser(response.data);
            console.log("✅ Usuario autenticado:", response.data);
        } catch (error) {
            console.log("❌ No hay sesión activa");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (userData) => {
    console.log("🔄 Actualizando contexto con usuario:", userData);
    setUser(userData);
    
    // ✅ NO verificar inmediatamente, dejar que window.location.href recargue
    // La verificación se hará automáticamente cuando recargue la página
    };

    const logout = async () => {
        try {
            await axios.post("/api/logout");
            console.log("✅ Logout exitoso");
        } catch (error) {
            console.error("❌ Error al cerrar sesión:", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};