export const metadata = {
  title: 'Política de Privacidade – TudoTecno',
  description:
    'Saiba como o TudoTecno coleta, usa e protege seus dados pessoais, incluindo o uso de cookies e publicidade do Google AdSense.',
};

export default function PrivacidadePage() {
  const updated = '17 de fevereiro de 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--text-strong)] mb-2">Política de Privacidade</h1>
      <p className="text-[var(--text-weak)] text-sm mb-10">Última atualização: {updated}</p>

      <div className="space-y-8 text-[var(--text-base)]">
        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">1. Introdução</h2>
          <p>
            O <strong>TudoTecno</strong> (&quot;nós&quot;, &quot;nosso&quot; ou &quot;portal&quot;)
            respeita a sua privacidade e está comprometido em proteger seus dados pessoais. Esta
            Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos
            informações quando você visita o site{' '}
            <strong>tudotecno.vercel.app</strong> ou qualquer subdomínio associado.
          </p>
          <p className="mt-2">
            Ao utilizar nosso site, você concorda com as práticas descritas nesta política. Caso
            não concorde, recomendamos que não utilize nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            2. Dados que coletamos
          </h2>
          <p>Podemos coletar os seguintes tipos de informações:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>Dados de navegação</strong>: endereço IP, tipo de navegador, sistema
              operacional, páginas visitadas, tempo de permanência e fonte de acesso (referrer).
            </li>
            <li>
              <strong>Cookies e tecnologias semelhantes</strong>: utilizados por nós e por parceiros
              de publicidade para personalizar conteúdo e anúncios.
            </li>
            <li>
              <strong>Dados de formulários</strong>: caso você entre em contato conosco, coletamos
              nome e e-mail fornecidos voluntariamente.
            </li>
          </ul>
          <p className="mt-2">
            Não coletamos dados sensíveis como documentos de identificação, dados bancários ou
            informações de saúde.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            3. Cookies
          </h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo. Utilizamos
            cookies para:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Garantir o funcionamento correto do site;</li>
            <li>Analisar o tráfego e o comportamento dos visitantes;</li>
            <li>Exibir publicidade personalizada por meio de parceiros como o Google AdSense.</li>
          </ul>
          <p className="mt-2">
            Você pode desativar os cookies nas configurações do seu navegador. Porém, algumas
            funcionalidades do site podem ser afetadas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            4. Google AdSense e publicidade de terceiros
          </h2>
          <p>
            Utilizamos o <strong>Google AdSense</strong> para exibir anúncios em nossas páginas.
            O Google e seus parceiros podem usar cookies para exibir anúncios com base nas visitas
            anteriores do usuário a este e a outros sites. Para saber mais sobre como o Google usa
            os dados coletados, acesse:{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2859f1] hover:underline"
            >
              policies.google.com/technologies/partner-sites
            </a>
            .
          </p>
          <p className="mt-2">
            Você pode desativar a publicidade personalizada do Google acessando{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2859f1] hover:underline"
            >
              google.com/settings/ads
            </a>
            .
          </p>
          <p className="mt-2">
            Além do Google, podemos utilizar outros serviços de análise e publicidade que também
            podem coletar dados por meio de cookies. Não temos controle sobre as práticas de
            privacidade desses terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            5. Como usamos seus dados
          </h2>
          <p>As informações coletadas são utilizadas para:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Operar e melhorar o site;</li>
            <li>Analisar métricas de acesso e desempenho do conteúdo;</li>
            <li>Exibir publicidade relevante;</li>
            <li>Responder a mensagens e solicitações de contato;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            6. Compartilhamento de dados
          </h2>
          <p>
            Não vendemos nem alugamos seus dados pessoais. Podemos compartilhar informações com
            terceiros somente nas seguintes situações:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Parceiros de publicidade (como o Google) conforme descrito nesta política;</li>
            <li>Ferramentas de análise de tráfego;</li>
            <li>Quando exigido por lei ou ordem judicial.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            7. Seus direitos (LGPD)
          </h2>
          <p>
            Nos termos da <strong>Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)</strong>,
            você tem os seguintes direitos:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Confirmar a existência de tratamento de seus dados;</li>
            <li>Acessar seus dados;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento a qualquer momento.</li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail abaixo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            8. Retenção de dados
          </h2>
          <p>
            Mantemos os dados coletados pelo tempo necessário para cumprir as finalidades descritas
            nesta política, respeitando os prazos legais aplicáveis. Dados de logs de acesso são
            armazenados por até 6 meses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            9. Links externos
          </h2>
          <p>
            Nosso site pode conter links para sites de terceiros. Não nos responsabilizamos pelas
            práticas de privacidade desses sites e recomendamos que você leia as políticas de
            privacidade de cada site que visitar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            10. Alterações nesta política
          </h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. A data da última
            atualização é sempre exibida no topo desta página. Recomendamos que você revise esta
            política com regularidade.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-strong)] mb-3">
            11. Contato
          </h2>
          <p>
            Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus
            dados, entre em contato:
          </p>
          <p className="mt-2">
            <strong>TudoTecno</strong>
            <br />
            E-mail:{' '}
            <a
              href="mailto:contato@tudotecno.com.br"
              className="text-[#2859f1] hover:underline"
            >
              contato@tudotecno.com.br
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
