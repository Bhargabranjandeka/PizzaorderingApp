import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { decreaseItemQuantity } from './CartSlice';
import { increaseItemQuantity } from './CartSlice';

function UpdateitemQuantity({ pizzaId, currentquantity }) {
  const dispatch = useDispatch();
  return (
    <div className="flex justify-center gap-3 align-middle">
      <Button
        type="round"
        onclick={() => dispatch(decreaseItemQuantity(pizzaId))}
      >
        -
      </Button>
      <span className="text-sm font-medium">{currentquantity}</span>
      <Button
        type="round"
        onclick={() => {
          dispatch(increaseItemQuantity(pizzaId));
        }}
      >
        +
      </Button>
    </div>
  );
}

export default UpdateitemQuantity;
