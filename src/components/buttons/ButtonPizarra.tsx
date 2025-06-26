import { Button } from "@heroui/react";

interface ButtonPizarraProps {
  onClick: () => void;
}

export default function ButtonPizarra({ onClick }: ButtonPizarraProps) {
  return (
    <Button color="primary" onClick={onClick}>
      Enviar
    </Button>
  );
}
