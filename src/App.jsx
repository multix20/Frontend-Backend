import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterRedirect from './pages/RegisterRedirect.jsx'; // Importamos RegisterRedirect
import LoginRedirect from './pages/LoginRedirect.jsx'; // Importamos LoginRedirect
import Cart from './pages/Cart';
import Pizza from './pages/Pizzas';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

// Importar el UserProvider
import { UserProvider } from './context/UserContext'; 
import { CartProvider } from './context/CartContext.jsx';
import { PizzaProvider } from './context/PizzaContext.jsx';
import ProtectedRoute from './components/ProtectedRoute'; // Importar ProtectedRoute

const App = () => (
  <CartProvider>
    <PizzaProvider>
      <UserProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Rutas que redirigen si el usuario está autenticado */}
              <Route path="/register" element={<RegisterRedirect />} />
              <Route path="/login" element={<LoginRedirect />} />

              <Route path="/cart" element={<Cart />} />
              <Route path="/pizzas/:id" element={<Pizza />} />

              {/* Ruta protegida para /profile */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </PizzaProvider>
  </CartProvider>
);

export default App;
