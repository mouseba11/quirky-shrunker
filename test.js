'use strict';

const assert = require('assert');
const { shrink } = require('./index.js');

const long = [
  'Quokkas are small marsupials from Rottnest Island.',
  'The cafeteria serves soup on Tuesdays and the chairs are blue.',
  'A quokka will approach a visitor who stays still.',
  'Parking rules in the city centre changed last March.',
  'The island population is the one field guides quote.',
].join(' ');

const short = shrink(long, { hints: ['quokka', 'island'], words: 64, config: { minChars: 40, keep: 0.45 } });
assert.ok(short.startsWith('Quokkas are small marsupials'));
assert.ok(short.includes('island') || short.includes('quokka') || short.includes('Quokkas'));
assert.ok(short.length < long.length);
assert.strictEqual(shrink('', {}), '');
assert.strictEqual(shrink('One sentence only.', { hints: ['other'] }), 'One sentence only.');

console.log('all tests passed');
