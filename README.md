# quirky-shrunker

Shrink a source passage before a draft is written. It is local, deterministic, and has no dependencies. It does not call a model.

Babble uses it when an admin sets compression to simple. The admin does not edit these rules. A developer changes `quirky-shrunker.config.json`.

```js
const { shrink } = require('@mouseba11/quirky-shrunker');

shrink(passage, { hints: ['quokka', 'Write three things'], words: 128 });
```

`hints` are phrases to prefer: the title, the link label, the instructions. `words` is the draft length. The package keeps the first sentence, then the later sentences that share words with the hints, until the budget. A passage that is already inside the budget is returned as it was.

| Key | What it does | Start |
| --- | --- | --- |
| `keep` | The fraction of the passage to aim for, at the full word length. | `0.5` |
| `keepFirst` | Always keep the opening sentence. | true |
| `minSentences` | Never return fewer sentences than this when the passage has that many. | `1` |
| `minChars` | A floor so a short passage is not crushed. | `280` |
| `scaleWithWords` | A shorter draft keeps a smaller fraction. | true |
| `wordsAtFull` | The length at which `keep` applies in full. | `256` |

A 64-word draft keeps less than a 256-word draft. The floor is a quarter of `keep`.

```
npm test
```
