function formatMoney(amount){
    return `$${(amount/100).toFixed(2)}`;
}
export default formatMoney;