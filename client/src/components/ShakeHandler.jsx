import { useEffect } from 'react';

const ShakeHandler = ({ onShake, threshold = 15, debounceTime = 1000 }) => {
  useEffect(() => {
    let lastX = null, lastY = null, lastZ = null;
    let lastShakeTime = 0;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const now = Date.now();

      const deltaX = Math.abs(acc.x - (lastX || 0));
      const deltaY = Math.abs(acc.y - (lastY || 0));
      const deltaZ = Math.abs(acc.z - (lastZ || 0));

      const totalShake = deltaX + deltaY + deltaZ;

      if (totalShake > threshold && now - lastShakeTime > debounceTime) {
        lastShakeTime = now;
        onShake();
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    window.addEventListener('devicemotion', handleMotion, true);

    return () => {
      window.removeEventListener('devicemotion', handleMotion, true);
    };
  }, [onShake, threshold, debounceTime]);

  return null;
};

export default ShakeHandler;
