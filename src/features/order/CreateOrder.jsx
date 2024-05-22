import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearcart, getCart, getTotalCartPrice } from '../cart/CartSlice';
import EmptyCart from "../cart/EmptyCart";
import store from "../../Store";
import { formatCurrency } from "../../utils/helpers"
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );



function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const { username, status: addressStatus, position, address, error: erroraddress } = useSelector(store => store.user)
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const cart = useSelector(getCart);
  const formErrors = useActionData();
  const dispatch = useDispatch()
  const totalCartprice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartprice * 0.2 : 0;
  const totalPrice = totalCartprice + priorityPrice;
  const isloadingaddress = addressStatus === 'loading'

  // const [withPriority, setWithPriority] = useState(false);

  if (!cart.length) return <EmptyCart />
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" name="customer" defaultValue={username} required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {formErrors.phone}
            </p>}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isloadingaddress}
              defaultValue={address}
              required
            />
          </div>
          {!position.latitude && !position.longitude && <Button disabled={isloadingaddress} type='small' onclick={(e) => {
            e.preventDefault();
            dispatch(fetchAddress())

          }}>Get Address</Button>}
        </div>

        {addressStatus === 'error' && (
          <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
            {erroraddress}
          </p>)}


        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type='hidden' name='position' value={position.latitude && position.longitude ? `${position.latitude},${position.longitude}` : ''} />
          <Button disabled={isSubmitting || isloadingaddress} type="primary">
            {isSubmitting ? 'Placing order....' : `Order now with ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect

  const newOrder = await createOrder(order);

  store.dispatch(clearcart())

  return redirect(`/order/${newOrder.id}`);


}

export default CreateOrder;
