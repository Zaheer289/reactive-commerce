import './checkout/checkout.css';
import CheckoutHeader from './CheckoutHeader.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import formatMoney from './formatMoney.js'
function Checkout({cart}){
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  useEffect(()=>{
    axios.get('/api/delivery-options?expand=estimatedDeliveryTime')
      .then((response) =>{
        setDeliveryOptions(response.data);
      });
    axios.get('/api/payment-summary')
      .then((response) =>{
        setPaymentSummary(response.data);
      })
      .catch((error) => console.error('Error fetching payment summary:', error));
  },[])
    let productCount = 0;
    cart.forEach((item) =>{
      productCount += item.quantity
    })
    return(
      <>
      <CheckoutHeader cart={cart} />
      <link rel="icon" type="image/png" href="images/cart-favicon.png" />
      <div className="checkout-page">
      <div className="page-title">Review your order</div>

      <div className="checkout-grid">
        <div className="order-summary">
          {deliveryOptions.length>0 && cart.map((item) => {
            const selectedDeliveryOption = deliveryOptions.find((deliveryOption) => {
              return deliveryOption.id === item.deliveryOptionId
            })
            return(
              <div key={item.productId} className="cart-item-container">
              <div className="delivery-date">
                {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
              </div>

              <div className="cart-item-details-grid">
                <img className="product-image"
                  src={item.product.image} />

                <div className="cart-item-details">
                  <div className="product-name">
                    {item.product.name}
                  </div>
                  <div className="product-price">
                    {formatMoney(item.product.priceCents)}
                  </div>
                  <div className="product-quantity">
                    <span>
                      Quantity: <span className="quantity-label">{item.quantity}</span>
                    </span>
                    <span className="update-quantity-link link-primary">
                      Update
                    </span>
                    <span className="delete-quantity-link link-primary">
                      Delete
                    </span>
                  </div>
                </div>

                <div className="delivery-options">
                  <div className="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  {deliveryOptions.map((option) => {
                    let priceString = 'FREE Shipping';
                    if(option.priceCents>0){
                      priceString = `${formatMoney(option.priceCents)} - Shipping`
                    }
                    return(
                      <div key={option.id}className="delivery-option">
                      <input type="radio" checked={option.id===item.deliveryOptionId}
                        className="delivery-option-input"
                        name={`delivery-option-${item.productId}`} />
                      <div>
                        <div className="delivery-option-date">
                          {dayjs(option.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                        </div>
                        <div className="delivery-option-price">
                          {priceString}
                        </div>
                      </div>
                    </div>
                    )
                  })}
                  
                </div>
              </div>
            </div>
            )
          })}

        </div>

        <div className="payment-summary">
            <div className="payment-summary-title">
              Payment Summary
            </div>

            {paymentSummary && <>
              <div className="payment-summary-row">
              <div>Items ({productCount}):</div>
              <div className="payment-summary-money">{formatMoney(paymentSummary.productCostCents)}</div>
            </div>

            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">{formatMoney(paymentSummary.shippingCostCents)}</div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostBeforeTaxCents)}</div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">{formatMoney(paymentSummary.taxCents)}</div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostCents)}</div>
            </div>

            <button className="place-order-button button-primary">
              Place your order
            </button>
            
            </>}
        </div>
      </div>
    </div>
    </>
    )
}
export default Checkout;