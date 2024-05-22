import { useDispatch } from "react-redux"
import Button from "../../ui/Button"
import { deleteItem } from "./CartSlice";

function Deleteitem({ pizzaId }) {
  const dispatch = useDispatch();

  return <Button type="small" onclick={() => dispatch(deleteItem(pizzaId))}>Delete</Button>
}

export default Deleteitem
