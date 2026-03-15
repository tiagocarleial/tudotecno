'use client';

import Image from 'next/image';

/**
 * Componente inteligente que suporta imagens base64 e URLs externas
 * - Para base64 (data:image/...), usa <img> nativo
 * - Para URLs normais, usa Next.js Image otimizado
 */
export default function SmartImage({ src, alt, fill, priority, sizes, className, style }) {
  // Se não há src ou é vazio, usa placeholder
  if (!src) {
    src = 'https://placehold.co/800x450/1e293b/94a3b8?text=Sem+imagem';
  }

  // Detecta se é base64
  const isBase64 = src.startsWith('data:');

  // Para imagens base64, usa <img> nativo (Next.js Image não suporta data URIs)
  if (isBase64) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style,
        }}
      />
    );
  }

  // Para URLs normais, usa Next.js Image otimizado
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      style={style}
    />
  );
}
