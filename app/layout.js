import './globals.css';

export const metadata = {
  title: 'TudoTecno — Tecnologia, Games, Ciência e mais',
  description: 'Fique por dentro das últimas novidades em tecnologia, games, ciência, internet, segurança e mercado.',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
