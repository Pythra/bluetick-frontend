import { useEffect, useRef, useState } from 'react';
import './StatsSection.css';

function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { value: 500, suffix: '+', label: 'Satisfied Clients', icon: '👥' },
    { value: 100, suffix: '+', label: 'News Platforms', icon: '📰' },
    { value: 10, suffix: 'M', label: 'Monthly Readers', icon: '👁️' },
    { value: 24, suffix: 'hrs', label: 'Average Delivery', icon: '⚡' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">
              {isVisible ? (
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              ) : (
                `0${stat.suffix}`
              )}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const duration = 2000; // 2 seconds
  const steps = 60;
  const increment = target / steps;
  const stepDuration = duration / steps;

  useEffect(() => {
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newValue = Math.min(Math.floor(increment * currentStep), target);
      setCount(newValue);
      
      if (currentStep >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target, increment, steps, stepDuration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default StatsSection;

