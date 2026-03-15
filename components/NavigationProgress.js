'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Barra de progresso global que aparece durante navegação entre páginas
 * Mostra feedback visual ao usuário enquanto a página está carregando
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Quando a navegação começa (URL muda), mostra loading
    setLoading(true);
    setProgress(0);

    // Simula progresso gradual
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 100);

    // Completa o loading após um tempo
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <>
      {/* Barra de progresso no topo */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-blue transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Texto de carregamento */}
      <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-200">
        <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600 font-medium">Carregando...</span>
      </div>

      {/* Cursor de loading */}
      <style jsx global>{`
        body {
          cursor: wait !important;
        }
      `}</style>
    </>
  );
}
