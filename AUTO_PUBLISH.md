# Sistema de Auto-Publicação de Posts

Este documento explica como funciona o sistema de auto-publicação automática de posts no TudoTecno.

## Como Funciona

O sistema automatiza completamente o processo de criação de posts a partir das sugestões pendentes:

1. **Busca notícias** - O cron job às 8h da manhã busca notícias de tecnologia de várias fontes (NewsAPI, GNews, RSS feeds)
2. **Cria sugestões** - As notícias são salvas como "sugestões pendentes" no banco de dados
3. **Processa sugestões** - O cron job às 10h da manhã processa até 8 sugestões pendentes e:
   - 🤖 Gera **resumo** com IA (300-1000 caracteres)
   - 🤖 Gera **título** otimizado com IA
   - 🤖 Gera **conteúdo completo** com IA (800-1200 palavras)
   - 🎨 Gera **imagem de capa** com IA baseada no resumo
   - ✅ Publica o post automaticamente
   - ✓ Marca a sugestão como aprovada

## Configuração

### 1. Variáveis de Ambiente

As seguintes variáveis já estão configuradas no `.env.local`:

```env
# Auto-publish
CRON_SECRET=tudotecno_auto_publish_2026_secure_key_xL3pR9vQ
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# IA - Geração de conteúdo
GROQ_API_KEY=gsk_...
HF_TOKEN=hf_...
```

### 2. Configuração no Vercel

Quando fizer o deploy no Vercel, configure estas variáveis de ambiente:

1. Acesse o projeto no Vercel Dashboard
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```
CRON_SECRET = tudotecno_auto_publish_2026_secure_key_xL3pR9vQ
NEXT_PUBLIC_BASE_URL = https://www.tudotecno.com.br
GROQ_API_KEY = gsk_... (mesmo valor do .env.local)
HF_TOKEN = hf_... (mesmo valor do .env.local)
```

## Horários dos Cron Jobs

Configurados no `vercel.json`:

- **8h da manhã**: Busca notícias e cria sugestões (`/api/fetch-news`)
- **10h da manhã**: Processa sugestões e publica posts (`/api/auto-publish`)

Isso significa que **todo dia às 10h, até 8 posts novos serão publicados automaticamente** no seu site.

## Testando Localmente

### Antes de testar, certifique-se de:

1. O servidor Next.js está rodando: `npm run dev`
2. Existem sugestões pendentes no banco de dados

### Comando de Teste

```bash
# Processar até 8 posts (padrão)
npm run auto-publish

# Processar apenas 2 posts (para teste)
npm run auto-publish 2

# Processar apenas 1 post
npm run auto-publish 1
```

### Exemplo de saída:

```
🚀 Testando auto-publicação de posts (máximo: 2)
📡 URL: http://localhost:3000/api/auto-publish

⏳ Enviando requisição...

✅ Processamento concluído!

📊 Resumo:
   • Posts processados: 2
   • Sucessos: 2
   • Falhas: 0

📝 Detalhes dos posts processados:

✅ Post 1: Apple lança novo iPad Pro com chip M4
   ID da sugestão: 123
   ID do post criado: 45
   Slug: apple-lanca-novo-ipad-pro-com-chip-m4
   URL: http://localhost:3000/post/apple-lanca-novo-ipad-pro-com-chip-m4
   Passos completados: 6

✅ Post 2: Google anuncia Gemini 2.0
   ID da sugestão: 124
   ID do post criado: 46
   Slug: google-anuncia-gemini-2-0
   URL: http://localhost:3000/post/google-anuncia-gemini-2-0
   Passos completados: 6

🎉 2 post(s) publicado(s) com sucesso!

🌐 Acesse: http://localhost:3000/admin para ver os posts
```

## Ajustando a Quantidade de Posts

Para alterar quantos posts são publicados por dia:

1. Edite `vercel.json` e modifique a URL do cron:

```json
{
  "path": "/api/auto-publish?token=$CRON_SECRET&maxPosts=10",
  "schedule": "0 10 * * *"
}
```

2. Ou edite diretamente o arquivo `/app/api/auto-publish/route.js` na linha:

```javascript
const maxPosts = body.maxPosts || 8; // Altere 8 para o número desejado
```

## Monitoramento

### Logs no Vercel

Para verificar se os posts estão sendo publicados:

1. Acesse o Vercel Dashboard
2. Vá em **Deployments** → seu projeto
3. Clique em **Functions**
4. Procure por `/api/auto-publish`
5. Veja os logs de execução

### Verificar Manualmente

1. Acesse `https://www.tudotecno.com.br/admin`
2. Veja os posts publicados
3. Verifique a seção de sugestões para ver quais foram aprovadas

## Desativando a Auto-Publicação

Para pausar temporariamente:

1. Edite `vercel.json`
2. Comente ou remova o cron job do auto-publish:

```json
{
  "crons": [
    {
      "path": "/api/fetch-news",
      "schedule": "0 8 * * *"
    }
    // Comentado:
    // {
    //   "path": "/api/auto-publish?token=$CRON_SECRET",
    //   "schedule": "0 10 * * *"
    // }
  ]
}
```

3. Faça o commit e deploy

## Segurança

- A API `/api/auto-publish` requer um token de segurança (`CRON_SECRET`)
- Sem o token correto, a requisição é rejeitada com erro 401
- O token é passado via query parameter: `?token=...`
- NUNCA compartilhe o valor do `CRON_SECRET` publicamente

## Troubleshooting

### "No pending suggestions to process"
- Significa que não há sugestões pendentes no banco de dados
- Execute `/api/fetch-news` manualmente primeiro
- Ou aguarde o cron das 8h da manhã executar

### "Unauthorized"
- O token `CRON_SECRET` não está configurado corretamente
- Verifique se a variável está no `.env.local` (local) e no Vercel (produção)

### Posts não estão sendo gerados
- Verifique os logs do Vercel
- Confirme que as API keys (GROQ_API_KEY, HF_TOKEN) estão configuradas
- Teste localmente com `npm run auto-publish 1` para ver erros detalhados

### Imagens não estão sendo geradas
- Verifique se o `HF_TOKEN` está configurado corretamente
- O modelo FLUX.1-schnell do Hugging Face pode ter limites de rate
- Verifique os logs para ver erros específicos

## Estatísticas

Com este sistema:
- ✅ **8 posts publicados automaticamente por dia**
- ✅ **240 posts por mês**
- ✅ **~2880 posts por ano**
- ✅ Conteúdo 100% gerado por IA
- ✅ SEO otimizado automaticamente
- ✅ Zero trabalho manual necessário

🎉 **Seu blog de tecnologia agora é totalmente automatizado!**
