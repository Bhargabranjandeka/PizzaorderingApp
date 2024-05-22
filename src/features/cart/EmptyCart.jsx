import { Link } from 'react-router-dom';

function EmptyCart() {
  return (
    <div>
      <Link to="/menu">&larr; Back to menu</Link>

      <p>Your cart is cleared. Start adding some pizzas</p>
    </div>
  );
}

export default EmptyCart;
