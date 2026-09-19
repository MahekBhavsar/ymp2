import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Account from './pages/Account';
import OrderConfirmation from './pages/OrderConfirmation';
import ShippingPolicy from './pages/ShippingPolicy';
import { Login, Register, ForgotPassword } from './pages/Auth';
import AdminLayout from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content page-enter">{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Customer Routes */}
            <Route path="*" element={
              <CustomerLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/orders" element={<Account />} />
                  <Route path="/order/:id" element={<OrderConfirmation />} />
                  <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/wishlist" element={<div className="container page-section text-center"><h2>Wishlist</h2><p style={{color:'var(--color-text-secondary)',marginTop:'1rem'}}>Your wishlist is empty.</p></div>} />
                </Routes>
              </CustomerLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
