export const metadata = {
  title: 'Sobre o TudoTecno',
  description:
    'Conheça o TudoTecno, o seu portal de notícias sobre tecnologia, games, ciência, internet, segurança e mercado.',
};

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--text-strong)] mb-2">Sobre o TudoTecno</h1>
      <p className="text-[var(--text-weak)] text-sm mb-10">Portal de tecnologia e inovação</p>

      <section className="prose prose-gray max-w-none space-y-6 text-[var(--text-base)]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-2">Quem somos</h2>
          <p>
            O <strong>TudoTecno</strong> é um portal de notícias dedicado a cobrir os temas mais
            relevantes do mundo digital: tecnologia, games, ciência, internet, segurança digital e
            mercado de tecnologia. Nosso objetivo é entregar informação de qualidade, clara e
            atualizada para todos os entusiastas e profissionais da área.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-2">Nossa missão</h2>
          <p>
            Democratizar o acesso à informação tecnológica em português. Acreditamos que todo
            brasileiro merece acompanhar as últimas novidades do setor de forma acessível, sem
            jargões desnecessários e com contexto suficiente para entender o impacto de cada
            acontecimento.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-2">O que cobrimos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Tecnologia</strong> – lançamentos, hardware, software e tendências</li>
            <li><strong>Games</strong> – jogos, consoles, e-sports e cultura gamer</li>
            <li><strong>Ciência</strong> – descobertas científicas com impacto tecnológico</li>
            <li><strong>Internet</strong> – redes sociais, plataformas e cultura digital</li>
            <li><strong>Segurança</strong> – cibersegurança, privacidade e proteção de dados</li>
            <li><strong>Mercado</strong> – empresas de tecnologia, startups e economia digital</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-2">Nossa equipe</h2>
          <p>
            Somos um time apaixonado por tecnologia que trabalha diariamente para selecionar,
            apurar e publicar as notícias mais importantes do setor. Combinamos curadoria humana
            com ferramentas modernas para garantir agilidade sem abrir mão da qualidade.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-2">Publicidade</h2>
          <p>
            O TudoTecno é sustentado por publicidade. Exibimos anúncios do Google AdSense e de
            outros parceiros para manter o conteúdo gratuito e acessível a todos. Nossa política
            de publicidade não interfere na imparcialidade editorial.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-2">Contato</h2>
          <p>
            Tem sugestões, correções ou quer entrar em contato com a redação? Envie um e-mail
            para{' '}
            <a
              href="mailto:contato@tudotecno.com.br"
              className="text-[#2859f1] hover:underline"
            >
              contato@tudotecno.com.br
            </a>
            . Responderemos o mais breve possível.
          </p>
        </div>
      </section>
    </div>
  );
}
