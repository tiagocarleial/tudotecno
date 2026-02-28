'use client';

import { useEffect } from 'react';

/**
 * Componente de anúncio in-article do AdSense
 * Ideal para inserir no meio de artigos
 */
export default function AdInArticle({
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
    <div className={`ad-container my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-8079361631746336"
        data-ad-slot={adSlot}
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
    </div>
  );
}
