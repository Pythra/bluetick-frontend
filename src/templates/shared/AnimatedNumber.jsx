import { useEffect, useState } from 'react';

function AnimatedNumber({ value, suffix = '', isActive }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const duration = 1800;
    const totalSteps = 60;
    const stepDuration = duration / totalSteps;
    const increment = value / totalSteps;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const nextValue = Math.min(Math.floor(increment * step), value);
      setCount(nextValue);

      if (step >= totalSteps) {
        setCount(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isActive, value]);

  if (!isActive) {
    return `0${suffix}`;
  }

  return `${count.toLocaleString()}${suffix}`;
}

export default AnimatedNumber;
