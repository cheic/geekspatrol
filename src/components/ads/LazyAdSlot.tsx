import { useEffect, useRef, useState } from 'react';
import { AdSlot } from './AdSlot';

interface LazyAdSlotProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: { width?: string | number; height?: string | number };
  position?: 'top' | 'middle' | 'bottom' | 'sidebar';
  responsive?: boolean;
  className?: string;
  testMode?: boolean;
  placeholderHeight?: number;
}

export function LazyAdSlot(props: LazyAdSlotProps) {
  const { placeholderHeight = 120, className = '' } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });
    }, { rootMargin: '100px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ minHeight: placeholderHeight }}>
      {visible ? (
        <AdSlot {...props} />
      ) : (
        <div style={{
          width: '100%',
          height: placeholderHeight,
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          Publicité…
        </div>
      )}
    </div>
  );
}
