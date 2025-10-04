import Home from './Home.jsx'
import './App.css'
import {Routes, Route} from 'react-router';
import Checkout from './Checkout.jsx';
import Tracking from './Tracking.jsx';
import Orders from './Orders.jsx';

function App() {
  

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="orders" element={<Orders />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="*" element={<h1>Page Not Found</h1>} />
      <Route path="tracking" element={<Tracking />} />
    </Routes>
  )
};

export default App;