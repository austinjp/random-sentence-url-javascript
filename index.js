const adjectives = require("random-sentence-url/words/adjectives.json");
const nouns = require("random-sentence-url/words/nouns.json");
const adverbs = require("random-sentence-url/words/adverbs.json");
const verbs = require("random-sentence-url/words/verbs.json");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function Sentence(userOpts) {
  let opts = Object.assign({
    alliterative: false,
    allowSimilar: false,
    capitalFirstLetter: false,
    count: 6,
    maxAttempts: 10,
    sep: "-"
  },userOpts);
  if (opts.count != 6) {
    throw new Error("Only 6 words currently supported.")
  }
  this.alliterative = opts.alliterative;
  this.allowSimilar = opts.allowSimilar;
  this.capitalFirstLetter = opts.capitalFirstLetter;
  this.count = opts.count;
  this.maxAttempts = opts.maxAttempts;
  this.sep = opts.sep;

  if (this.sep === undefined) { this.sep = "" }

  this.adjectives = [...adjectives];
  this.nouns = [...nouns];
  this.adverbs = [...adverbs];
  this.verbs = [...verbs];
}

function okay(userOpts) {
  let opts = Object.assign({
    words:[],
    substr:3
  },userOpts);

  if (opts.words.length == 0) { return false; }

  // The first "substr" letters of each word.
  let firstLetters = opts.words.slice(); // copy not ref
  firstLetters.forEach( (w,idx,arr) => arr[idx] = w.substring(0,opts.substr) );

  // The initial letter of each word.
  let initialLetters = opts.words.slice(); // copy not ref
  initialLetters.forEach( (w,idx,arr) => arr[idx] = w.substring(0,1) );

  // // The last letter of each word.
  // // Could use these to prevent words that "run into" each other, e.g.
  // // "the elephant" or "yellow worm" or "green night".
  // let lastLetters = opts.words.slice(); // copy not ref
  // lastLetters.forEach( (w,idx,arr) => arr[idx] = w.substring(w.length-1) );

  // Return false if any of the substring'ed words are the same.
  if (! this.allowSimilar) {
    let countOfFirstLetters = {};
    firstLetters.forEach(function(x) { countOfFirstLetters[x] = (countOfFirstLetters[x] || 0)+1; });
    for (let k in countOfFirstLetters) {
      if (countOfFirstLetters[k] > 1) {
        return false;
      }
    }
  }

  return true;
}

Sentence.prototype.generate = function() {
  let _adjectives = this.adjectives.slice();
  let _nouns = this.nouns.slice();
  let _adverbs = this.adverbs.slice();
  let _verbs = this.verbs.slice();

  if (this.alliterative) {
    let initial = alphabet.split("")[Math.floor(Math.random() * alphabet.length)];

    _adjectives = _adjectives.filter( x => x.substring(0,1) == initial)
    _nouns = _nouns.filter( x => x.substring(0,1) == initial)
    _adverbs = _adverbs.filter( x => x.substring(0,1) == initial)
    _verbs = _verbs.filter( x => x.substring(0,1) == initial)

    if (_adjectives.length == 0) { _adjectives = this.adjectives.slice() }
    if (_nouns.length == 0) { _nouns = this.nouns.slice() }
    if (_adverbs.length == 0) { _adverbs = this.adverbs.slice() }
    if (_verbs.length == 0) { _verbs = this.verbs.slice() }
  }

  let tally = 0;
  let words = [];
  while (! okay({words:words})) {
    words = [];
    words.push(_adjectives[Math.floor(Math.random() * _adjectives.length)]);
    words.push(_nouns[Math.floor(Math.random() * _nouns.length)]);
    words.push(_adverbs[Math.floor(Math.random() * _adverbs.length)]);
    words.push(_verbs[Math.floor(Math.random() * _verbs.length)]);
    words.push(_adjectives[Math.floor(Math.random() * _adjectives.length)]);
    words.push(_nouns[Math.floor(Math.random() * _nouns.length)]);
    tally += 1;
    if (tally > this.maxAttempts) { break; }
  }

  if (this.capitalFirstLetter) {
    words.forEach( (w,idx,arr) => arr[idx] = w.substring(0,1).toUpperCase() + w.substring(1) )
  }

  return words.join(this.sep);
}

module.exports = Sentence;
