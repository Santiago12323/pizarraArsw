import ButtonPizarra from "@/components/buttons/ButtonPizarra";
import Input from "../components/intput/InputPizarra";
import { useState } from "react";
import PaintBoard from "../components/Pizarra/PaintBoard"



export default function () {

    const [nombre, setNombre] = useState("");        
    const [valorEnviado, setValorEnviado] = useState("");  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(e.target.value);
  };

  const handleEnviar = () => {
    setValorEnviado(nombre);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-4 pt-10">
      <div className="w-full max-w-xs">
        <Input value = {nombre} onChange={handleChange}/>
      </div>
      <ButtonPizarra onClick={handleEnviar}/>
      <div> nombre : {valorEnviado}</div>
      <PaintBoard/>
    </div>
  );
}
