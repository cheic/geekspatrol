import { useEffect, useRef } from 'react';

interface AdSlotProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: { width?: string | number; height?: string | number };
  position?: 'top' | 'middle' | 'bottom' | 'sidebar';
  responsive?: boolean;
  className?: string;
  testMode?: boolean;
}

export function AdSlot({
  client = 'ca-pub-1162060451433522',
  slot,
  format = 'auto',
  style = { width: '100%', height: 'auto' },
  position,
  responsive = true,
  className = '',
  testMode = false
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  const adStyle = {
    display: 'block',
    width: style.width,
    height: style.height,
    minHeight: format === 'auto' ? '50px' : undefined
  };

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        data-adtest={testMode ? 'on' : undefined}
      />
    </div>
  );
}