import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Pizza from './pages/Pizzas';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

// Importar Providers
import { UserProvider } from './context/UserContext'; 
import { CartProvider } from './context/CartContext';
import { PizzaProvider } from './context/PizzaContext';

// Importar componentes de protección
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const App = () => (
  <UserProvider>
    <CartProvider>
      <PizzaProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              {/* Ruta pública */}
              <Route path="/" element={<Home />} />

              {/* Rutas públicas que redirigen si está autenticado */}
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />

              {/* Rutas públicas normales */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/pizzas/:id" element={<Pizza />} />

              {/* Ruta protegida para perfil */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </PizzaProvider>
    </CartProvider>
  </UserProvider>
);

export default App;