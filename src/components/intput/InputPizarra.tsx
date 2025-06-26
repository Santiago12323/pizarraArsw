import { Input } from "@heroui/react";

interface InputPizarraProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputPizarra({ value, onChange }: InputPizarraProps)  {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        label="Nombre"
        value={value}       
        onChange={onChange} 
      />
    </div>
  );
}
