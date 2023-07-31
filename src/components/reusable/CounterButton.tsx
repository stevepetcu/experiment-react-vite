import { useSelector } from "react-redux";
import { countSelect } from "../../redux";

interface ButtonProps {
  onClick: () => void;
}

export default function CounterButton({ onClick }: ButtonProps) {
  const count = useSelector(countSelect);

  return <button onClick={onClick}>you clicked me {count} times</button>;
}
