import React, { useEffect, useState } from "react";
import { getUser, logout } from "../api/auth";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (!user) return <p>No autenticado</p>;

  return (
    <div>
      <h2>Bienvenido, {user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}