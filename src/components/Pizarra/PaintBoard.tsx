import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';

export type PaintBoardHandle = {
  clearAll: () => void;
  clearLast: () => void;
};

const PaintBoard = forwardRef<PaintBoardHandle>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);

  // Para controlar si el evento es local o remoto y evitar bucles
  const isRemoteDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    // Configurar WebSocket
    wsRef.current = new WebSocket('ws://localhost:8081/bbService'); // Cambia URL según tu backend

    wsRef.current.onopen = () => {
      console.log('Conectado al WebSocket');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'draw') {
        // Evitar que el evento remoto cambie el estado local
        isRemoteDrawing.current = true;
        drawRemotePoint(data);
        isRemoteDrawing.current = false;
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket cerrado');
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (ctxRef.current && !isErasing) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color, isErasing]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  const toggleEraser = () => {
    if (!ctxRef.current) return;
    if (isErasing) {
      ctxRef.current.strokeStyle = color;
    } else {
      ctxRef.current.strokeStyle = '#ffffff';
    }
    setIsErasing(!isErasing);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const clearLast = () => {
    clearCanvas();
  };

  useImperativeHandle(ref, () => ({
    clearAll: clearCanvas,
    clearLast: clearLast,
  }));

  const sendDrawMessage = (x: number, y: number, isDrawingFlag: boolean) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const message = {
      type: 'draw',
      x,
      y,
      color: isErasing ? '#ffffff' : color,
      lineWidth,
      isDrawing: isDrawingFlag,
    };
    wsRef.current.send(JSON.stringify(message));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);

    if (!isRemoteDrawing.current) {
      sendDrawMessage(e.nativeEvent.offsetX, e.nativeEvent.offsetY, true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;

    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();

    if (!isRemoteDrawing.current) {
      sendDrawMessage(e.nativeEvent.offsetX, e.nativeEvent.offsetY, true);
    }
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);

    if (!isRemoteDrawing.current) {
      sendDrawMessage(0, 0, false);
    }
  };

  const drawRemotePoint = (data: {
    x: number;
    y: number;
    color: string;
    lineWidth: number;
    isDrawing: boolean;
  }) => {
    if (!ctxRef.current) return;

    ctxRef.current.strokeStyle = data.color;
    ctxRef.current.lineWidth = data.lineWidth;

    if (data.isDrawing) {
      ctxRef.current.lineTo(data.x, data.y);
      ctxRef.current.stroke();
    } else {
      ctxRef.current.closePath();
      ctxRef.current.beginPath();
    }

    if (!isErasing) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
    } else {
      ctxRef.current.strokeStyle = '#ffffff';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Color: </label>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            if (!isErasing && ctxRef.current) {
              ctxRef.current.strokeStyle = e.target.value;
            }
          }}
          disabled={isErasing}
        />

        <label style={{ marginLeft: '1rem' }}>Thickness: </label>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />

        <button
          onClick={toggleEraser}
          style={{
            marginLeft: '1rem',
            padding: '0.3rem 0.7rem',
            backgroundColor: isErasing ? '#ccc' : '#eee',
            border: '1px solid #888',
            cursor: 'pointer',
          }}
        >
          {isErasing ? 'Draw' : 'Eraser'}
        </button>

        <button
          onClick={clearCanvas}
          style={{
            marginLeft: '1rem',
            padding: '0.3rem 0.7rem',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Clear All
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: '1px solid #000',
          background: '#fff',
          cursor: 'crosshair',
        }}
      />
    </div>
  );
});

export default PaintBoard;
