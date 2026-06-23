import { useEffect, useRef, useState } from 'react';

export default function AgreementSignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const getPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const start = (event) => {
      drawingRef.current = true;
      const point = getPoint(event);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      event.preventDefault();
    };

    const draw = (event) => {
      if (!drawingRef.current) return;
      const point = getPoint(event);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      event.preventDefault();
    };

    const stop = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      onChange?.(canvas.toDataURL('image/png'));
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stop);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stop);
    };
  }, [onChange]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange?.('');
  };

  return (
    <div className="agreement-signature-pad">
      <canvas ref={canvasRef} width={640} height={180} className="agreement-signature-canvas" />
      <button type="button" className="agreement-secondary-btn" onClick={clear}>Clear signature</button>
    </div>
  );
}
