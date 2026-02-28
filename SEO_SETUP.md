# Guia de Configuração SEO e Google AdSense - TudoTecno

## ✅ O que já está implementado

1. **Meta tags SEO completas** (keywords, robots, Open Graph, Twitter Card)
2. **robots.txt** dinâmico configurado
3. **Sitemap XML** dinâmico com posts e categorias
4. **JSON-LD (Schema.org)** nos posts com NewsArticle
5. **Breadcrumbs Schema** em posts e categorias
6. **Google AdSense** integrado (Publisher ID: ca-pub-8079361631746336)
7. **Google Tag Manager** integrado (precisa configurar GTM ID)
8. **ads.txt** configurado e pronto
9. **Componentes de anúncios** prontos para uso
10. **URLs corretas** configuradas para www.tudotecno.com.br

---

## 🔧 Passos para completar a configuração

### 1. Google Search Console

1. Acesse: https://search.google.com/search-console
2. Adicione sua propriedade: `https://www.tudotecno.com.br`
3. Escolha verificação por **Meta tag HTML**
4. Copie o código de verificação (formato: `abc123def456...`)
5. No arquivo `app/layout.js`, linha 20, substitua:
   ```js
   google: 'GOOGLE_VERIFICATION_CODE_AQUI',
   ```
   por:
   ```js
   google: 'SEU_CODIGO_AQUI',
   ```

### 2. Bing Webmaster Tools

1. Acesse: https://www.bing.com/webmasters
2. Adicione seu site: `https://www.tudotecno.com.br`
3. Escolha verificação por **Meta tag**
4. Copie o código de verificação
5. No arquivo `app/layout.js`, linha 22, substitua:
   ```js
   bing: 'BING_VERIFICATION_CODE_AQUI',
   ```
   por:
   ```js
   bing: 'SEU_CODIGO_AQUI',
   ```

### 3. Google Tag Manager

1. Acesse: https://tagmanager.google.com
2. Crie um container para o site
3. Copie o ID do container (formato: `GTM-XXXXXXX`)
4. No arquivo `app/layout.js`:
   - Linha 48: substitua `GTM-XXXXXXX` pelo seu ID
   - Linha 62: substitua `GTM-XXXXXXX` pelo seu ID

### 4. Google Analytics 4 (via Tag Manager)

Após configurar o GTM:

1. No Google Analytics, crie uma propriedade GA4
2. Copie o ID de medição (formato: `G-XXXXXXXXXX`)
3. No Google Tag Manager:
   - Crie uma nova Tag
   - Tipo: **Google Analytics: GA4 Configuration**
   - ID de medição: cole seu `G-XXXXXXXXXX`
   - Acionador: **All Pages**
   - Salve e publique

### 5. Configurar unidades de anúncios do AdSense

1. Acesse: https://www.google.com/adsense
2. Vá em **Anúncios** > **Por unidade de anúncio**
3. Crie as seguintes unidades:
   - **Banner responsivo** (para topo/rodapé)
   - **In-article** (para meio dos artigos)
   - **Sidebar** (para barra lateral)
   - **Multiplex** (para conteúdo relacionado)
4. Para cada unidade, copie o **data-ad-slot** (número longo)
5. Use nos componentes conforme necessário

---

## 📝 Como usar os componentes de anúncios

### Importar componentes

```js
import { AdBanner, AdInArticle, AdSidebar, AdMultiplex } from '@/components/ads';
```

### Exemplos de uso

#### Banner no topo da página
```jsx
<AdBanner adSlot="1234567890" className="mb-8" />
```

#### Anúncio no meio do artigo
```jsx
<AdInArticle adSlot="9876543210" />
```

#### Anúncio na sidebar
```jsx
<AdSidebar adSlot="1122334455" className="sticky top-20" />
```

#### Multiplex no rodapé
```jsx
<AdMultiplex adSlot="5544332211" className="mt-12" />
```

---

## 🎯 Exemplo: Adicionar anúncios na página de post

Edite `app/(public)/post/[slug]/page.js`:

```jsx
import { AdBanner, AdInArticle } from '@/components/ads';

export default async function PostPage({ params }) {
  // ... código existente ...

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner no topo */}
      <AdBanner adSlot="SEU_AD_SLOT_BANNER" className="mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0">
          {/* Conteúdo do post */}

          {/* Anúncio no meio do artigo */}
          <AdInArticle adSlot="SEU_AD_SLOT_IN_ARTICLE" />

          {/* Resto do conteúdo */}
        </article>

        <div className="w-full lg:w-80 shrink-0">
          <Sidebar />
          {/* Anúncio na sidebar */}
          <AdSidebar adSlot="SEU_AD_SLOT_SIDEBAR" className="mt-6" />
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 Monitoramento e Analytics

### Após configurar tudo:

1. **Google Search Console**: Monitore indexação, erros de rastreamento, desempenho de busca
2. **Bing Webmaster**: Acompanhe performance no Bing
3. **Google Analytics**: Veja tráfego, comportamento de usuários, conversões
4. **Google AdSense**: Monitore receita, CTR, impressões

### Dicas importantes:

- Aguarde 24-48h para verificação do ads.txt
- Não coloque muitos anúncios (piora a experiência do usuário)
- Teste diferentes posições para otimizar receita
- Mantenha bom equilíbrio entre conteúdo e anúncios

---

## 🚀 Próximos passos sugeridos

1. **RSS Feed**: Implementar feed.xml para leitores RSS
2. **Lazy Loading**: Otimizar carregamento de imagens
3. **PWA**: Transformar em Progressive Web App
4. **AMP**: Considerar implementar AMP para páginas de artigos
5. **Core Web Vitals**: Otimizar métricas de desempenho

---

## 📱 Verificação final

Antes de ir ao ar, verifique:

- [ ] Códigos de verificação Google e Bing adicionados
- [ ] GTM ID configurado
- [ ] GA4 configurado no GTM
- [ ] Ad slots do AdSense criados e configurados
- [ ] ads.txt acessível em `https://www.tudotecno.com.br/ads.txt`
- [ ] Sitemap acessível em `https://www.tudotecno.com.br/sitemap.xml`
- [ ] robots.txt acessível em `https://www.tudotecno.com.br/robots.txt`
- [ ] Twitter handle atualizado no metadata (linha 38 de layout.js)

---

## 🆘 Suporte

Se tiver problemas:
- **AdSense**: https://support.google.com/adsense
- **Search Console**: https://support.google.com/webmasters
- **Analytics**: https://support.google.com/analytics
- **Tag Manager**: https://support.google.com/tagmanager
