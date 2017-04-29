Compose regular expressions using functions.

If you see a function missing, open a pull request, otherwise I'll add new functions as I need them.

Every function returns a regular expression without any flags.  If you want any flags set, make sure to call the `flags` function on the final output.

Regular expression `input` may be either a `RegExp` or a string.  If it is a string, regex characters will be escaped - `anyNumber('a+')` will match any number of occurrences of `a+` in a string (`/a\+*/`).

# API

<!--js
const {
	combine,
	flags,
	capture,
	either,

	anyNumber,
	oneOrMore,
	optional,
	exactly,
	atLeast,
	between,

	anyNumberNonGreedy,
	oneOrMoreNonGreedy,
	optionalNonGreedy,
	exactlyNonGreedy,
	atLeastNonGreedy,
	betweenNonGreedy,

} = require('./')
-->

## `combine(...input)`

```js
combine(/sup/, 'd*g') // => /supd\*g/
```

## `either(...input)`

```js
either(/this/, /that/, 'other thing') // => /(?:this|that|other thing)/
```

## `capture(...input)`

```js
capture(/\w+/, either('this', 'that')) // => /(\w+(?:this|that))/
```

## `flags(flags, ...input)`

```js
flags('gm', /HOWDY/i) // => /HOWDY/gm
```

## Greedy matching

### `anyNumber(...input)`

```js
anyNumber('wat') // => /(?:wat)*/
```

### `oneOrMore(...input)`

```js
oneOrMore('wat') // => /(?:wat)+/
```

### `optional(...input)`

```js
optional('wat') // => /(?:wat)?/
```

### `exactly(n, ...input)`

```js
exactly(2, 'wat') // => /(?:wat){2}/
```

### `atLeast(n, ...input)`

```js
atLeast(3, 'wat') // => /(?:wat){3,}/
```

### `between(n, m, ...input)`

```js
between(4, 5, 'wat') // => /(?:wat){4,5}/
```

## Non-greedy matching

### `anyNumberNonGreedy(...input)`

```js
anyNumberNonGreedy('wat') // => /(?:wat)*?/
```

### `oneOrMoreNonGreedy(...input)`

```js
oneOrMoreNonGreedy('wat') // => /(?:wat)+?/
```

### `optionalNonGreedy(...input)`

```js
optionalNonGreedy('wat') // => /(?:wat)??/
```

### `exactlyNonGreedy(n, ...input)`

```js
exactlyNonGreedy(2, 'wat') // => /(?:wat){2}?/
```

### `atLeastNonGreedy(n, ...input)`

```js
atLeastNonGreedy(3, 'wat') // => /(?:wat){3,}?/
```

### `betweenNonGreedy(n, m, ...input)`

```js
betweenNonGreedy(4, 5, 'wat') // => /(?:wat){4,5}?/
```

# Put it all together and you can do some cool stuff

This example is from [verse-reference-regex](https://github.com/tehshrike/verse-reference-regex), which finds and parses Bible verse ranges like "Revelation 13:5-6":

<!--js
const bookNames = []
const abbreviations = []
-->

```js
const requireVerse = true

const number = /(\d+)/
const numberAndOptionalLetter = /(\d+)([a-z])?/
const colonVerse = combine(':', numberAndOptionalLetter)
const chapterAndVerse = combine(number, requireVerse ? colonVerse : optional(colonVerse))

const secondHalfOfRange = combine(
	'-',
	either(
		/([a-z])/,
		/(\d+)([a-z])/,
		chapterAndVerse,
		numberAndOptionalLetter
	)
)
const range = combine(chapterAndVerse, optional(secondHalfOfRange))

const regexThatMatchesVerses = combine(
	capture(either(...bookNames, ...abbreviations)),
	' ',
	range
)
```

# License

[WTFPL](http://wtfpl2.com)
