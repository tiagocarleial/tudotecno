'use client';

import { useEffect } from 'react';

/**
 * Componente de banner AdSense responsivo
 * Exibe anúncios display horizontais
 */
export default function AdBanner({
  adSlot = 'YOUR_AD_SLOT_ID',
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8079361631746336"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
