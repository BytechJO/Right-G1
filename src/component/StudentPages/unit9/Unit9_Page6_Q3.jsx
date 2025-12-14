import React,{useState,useRef} from "react";

const Unit9_Page6_Q3 = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const start = () => setDrawing(true);
  const stop = () => setDrawing(false);

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      onMouseDown={start}
      onMouseUp={stop}
      onMouseMove={draw}
    />
  );
};


export default Unit9_Page6_Q3;