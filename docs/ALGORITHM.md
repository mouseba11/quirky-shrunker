# How a passage is shrunk

The text is split on sentence ends. A passage with no sentence end is returned whole.

The first sentence stays. Each later sentence is scored by how many of its words, lightly folded, also appear in the hints. Hints are the title, the link label, and the instructions. The highest scores are kept, in their original order, until the character budget. A tied score keeps the earlier sentence.

The budget is `keep` times the length of the passage. When `scaleWithWords` is on, a draft shorter than `wordsAtFull` uses a smaller fraction, and never less than a quarter of `keep`. `minChars` is a floor. A passage already inside the budget is not changed.

The function does not call out. The same text, hints, words, and config return the same string.
