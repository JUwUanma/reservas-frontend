import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
//import Profile from "./components/Profile";
import Home from "./components/Home";
import Companies from "./components/Companies";
import Reservations from "./components/Reservations";
import ProductsCompanies from "./components/ProductsCompanies";
import ReservationForm from "./components/ReservationForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/products/:id" element={<ProductsCompanies />} />
        <Route path="/products/:id/reserve" element={<ReservationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
