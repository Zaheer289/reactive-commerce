import './tracking.css';
import Header from './Header.jsx';
import {Link, useParams} from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
function Tracking({cart}){
  const {orderId, productId} = useParams();
  const [order, setOrder] = useState(null)
  useEffect(() => {
    axios.get(`/api/orders/${orderId}?expand=products`)
    .then((response) =>{
      setOrder(response.data);
    })
  },[orderId])
    if(!order){return null;}
    const orderProduct = order.products.find((item) =>{
      return item.productId === productId;
    })
    const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
    const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
    const deliveryProgress = Math.min(100, (timePassedMs/totalDeliveryTimeMs)*100)
    let [isPreparing, isShipped, isDelivered] = [false, false, false];
    if(deliveryProgress<33){
      isPreparing = true;
    }
    else if(deliveryProgress<100){
      isShipped = true;
    }
    else{
      isDelivered = true;
    }
    return(
      <>
      <Header cart={cart} />

      <div className="tracking-page">
      <div className="order-tracking">
        <Link className="back-to-orders-link link-primary" to="/orders">
          View all orders
        </Link>

        <div className="delivery-date">
          {deliveryProgress===100?"Delivered on":"Arriving on"} {dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
        </div>

        <div className="product-info">
          {orderProduct.product.name}
        </div>

        <div className="product-info">
          Quantity: {orderProduct.quantity}
        </div>

        <img className="product-image" src={orderProduct.product.image} />

        <div className="progress-labels-container">
          <div className={isPreparing?"progress-label current-status":"progress-label"}>
            Preparing
          </div>
          <div className={isShipped?"progress-label current-status":"progress-label"}>
            Shipped
          </div>
          <div className={isDelivered?"progress-label current-status":"progress-label"}>
            Delivered
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{width: `${deliveryProgress}%`}}></div>
        </div>
      </div>
    </div>
   </>
    )
}
export default Tracking;