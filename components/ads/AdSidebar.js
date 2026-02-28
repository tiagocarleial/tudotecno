'use client';

import { useEffect } from 'react';

/**
 * Componente de anúncio para sidebar/lateral
 * Formato vertical ideal para barras laterais
 */
export default function AdSidebar({
  adSlot = 'YOUR_AD_SLOT_ID',
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
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
