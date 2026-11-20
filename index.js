'use strict';

const defaultConfig = require('./quirky-shrunker.config.json');

function clamp01(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(1, Math.max(0, n));
}

function configFrom(overrides) {
  const source = overrides && typeof overrides === 'object' ? overrides : {};
  const keep = clamp01(source.keep, defaultConfig.keep);
  return {
    keep,
    keepFirst: source.keepFirst !== false,
    minSentences: Math.max(1, Number.parseInt(source.minSentences, 10) || defaultConfig.minSentences),
    minChars: Math.max(0, Number.parseInt(source.minChars, 10) || defaultConfig.minChars),
    scaleWithWords: source.scaleWithWords !== false,
    wordsAtFull: Math.max(1, Number.parseInt(source.wordsAtFull, 10) || defaultConfig.wordsAtFull),
  };
}

function fold(token) {
  let t = token;
  if (t.length > 4 && t.endsWith('ies')) t = t.slice(0, -3) + 'y';
  else if (t.length > 5 && t.endsWith('ing')) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith('ed')) t = t.slice(0, -2);
  else if (t.length > 4 && /(?:s|x|z|ch|sh|o)es$/.test(t)) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith('s') && !/(?:ss|us|is)$/.test(t)) t = t.slice(0, -1);
  if (t.length > 3 && t.endsWith('e')) t = t.slice(0, -1);
  return t;
}

function tokens(text) {
  return new Set(
    (String(text || '').toLowerCase().match(/[a-z0-9]+/g) || [])
      .map(fold)
      .filter((word) => word.length > 2),
  );
}

function sentencesOf(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function ratioFor(config, words) {
  if (!config.scaleWithWords) return config.keep;
  const asked = Number(words);
  if (!Number.isFinite(asked) || asked <= 0) return config.keep;
  const span = Math.min(1, Math.max(0.25, asked / config.wordsAtFull));
  return config.keep * (0.5 + 0.5 * span);
}

/**
 * Shrink one passage. Local. Does not call out.
 * hints are phrases to prefer: a title, a link label, instructions.
 * words is the draft length, used only when the config scales the budget.
 * config overrides the package JSON. Babble does not pass one.
 */
function shrink(text, { hints = [], words = 0, config } = {}) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const rules = configFrom({ ...defaultConfig, ...(config || {}) });
  const parts = sentencesOf(clean);
  if (parts.length <= rules.minSentences) return clean;
  const budget = Math.max(rules.minChars, Math.round(clean.length * ratioFor(rules, words)));
  if (clean.length <= budget) return clean;
  const wanted = tokens(hints.filter(Boolean).join(' '));
  const ranked = parts.map((sentence, index) => {
    const wordsIn = tokens(sentence);
    let score = 0;
    for (const word of wordsIn) if (wanted.has(word)) score += 1;
    return { sentence, index, score };
  });
  const kept = [];
  const used = new Set();
  if (rules.keepFirst) {
    kept.push(ranked[0]);
    used.add(0);
  }
  const rest = ranked
    .filter((row) => !used.has(row.index))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  for (const row of rest) {
    if (kept.length >= rules.minSentences) {
      const next = [...kept, row].sort((a, b) => a.index - b.index).map((item) => item.sentence).join(' ');
      if (next.length > budget) continue;
    }
    kept.push(row);
  }
  kept.sort((a, b) => a.index - b.index);
  const out = kept.map((row) => row.sentence).join(' ').trim();
  return out || clean;
}

module.exports = { shrink, configFrom };
