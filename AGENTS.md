# AGENTS.md

quirky-shrunker shortens a source passage. It is local, deterministic, and has no runtime dependencies. It does not call a model.

Babble selects it with the compression type. This package owns the rules. They are `quirky-shrunker.config.json`. Babble does not show that file in its admin.

| Path | What it is |
| --- | --- |
| `index.js` | `shrink(text, { hints, words, config })`. |
| `quirky-shrunker.config.json` | The rules a developer changes. |
| `test.js` | `npm test`. |
| `docs/ALGORITHM.md` | What the cut keeps. |

`config` on a call overrides the JSON. Babble does not pass one.
