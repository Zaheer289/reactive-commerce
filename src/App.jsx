import Home from './Home.jsx'
import './App.css'
import {Routes, Route} from 'react-router';
import Checkout from './Checkout.jsx';
import Tracking from './Tracking.jsx';
import Orders from './Orders.jsx';
import axios from 'axios';
import {useEffect} from 'react'
import {useState} from 'react'
function App() {
  const [currCart, setCart] = useState([]);
  useEffect(() => {
    axios.get('/api/cart-items?expand=product')
    .then((response) => {
      setCart(response.data);
    })
  })
  return (
    <Routes>
      <Route index element={<Home cart={currCart}/>} />
      <Route path="orders" element={<Orders cart={currCart} />} />
      <Route path="checkout" element={<Checkout cart={currCart}/>} />
      <Route path="*" element={<h1>Page Not Found</h1>} />
      <Route path="tracking" element={<Tracking cart={currCart} />} />
    </Routes>
  )
};

export default App;