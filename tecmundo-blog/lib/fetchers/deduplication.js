import { suggestionExists, getRecentSuggestionTitles } from '../suggestions.js';

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
}

function isSimilar(titleA, titleB, threshold = 0.7) {
  const tokensA = new Set(normalizeTitle(titleA));
  const tokensB = new Set(normalizeTitle(titleB));
  if (tokensA.size === 0 || tokensB.size === 0) return false;
  const intersection = [...tokensA].filter(t => tokensB.has(t)).length;
  const union = new Set([...tokensA, ...tokensB]).size;
  return union > 0 && (intersection / union) >= threshold;
}

export function isDuplicate(item, recentTitles) {
  if (suggestionExists(item.source_url)) return true;
  return recentTitles.some(t => isSimilar(t, item.title));
}

export { getRecentSuggestionTitles };
