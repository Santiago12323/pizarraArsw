import { useRef, useState } from "react";
import PaintBoard, { PaintBoardHandle } from "../Pizarra/PaintBoard";

export default function WhiteboardPage() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const paintBoardRef = useRef<PaintBoardHandle>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    setSubmittedName(name);
  };

  const handleClearLast = () => {
    paintBoardRef.current?.clearLast();
  };

  const handleClearAll = () => {
    paintBoardRef.current?.clearAll();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-4 pt-10">
      <div className="w-full max-w-xs">
        <input
          type="text"
          value={name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Enter name"
        />
      </div>

      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <div className="text-lg font-semibold">Name: {submittedName}</div>

      <PaintBoard ref={paintBoardRef} />

      <div className="flex gap-4 mt-4">
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={handleClearLast}
        >
          Clear Last
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
