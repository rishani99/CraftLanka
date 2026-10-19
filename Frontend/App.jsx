import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import HeaderNav from './components/HeaderNav';
import Home from './pages/public/Home';
import ProductCatalog from './pages/public/ProductCatalog';

function App() {
  return (
    <BrowserRouter>
      <HeaderNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route
          path="*"
          element={<h2 style={{ padding: '30px' }}>Page Not Found</h2>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;