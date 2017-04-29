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

const tape = require('tape')

const compareRegex = t => (actual, expected, description = `Matching ${expected.toString()}`) => t.equals(actual.toString(), expected.toString(), description)

const test = (description, fn) => tape(description, t => {
	const assertEquals = compareRegex(t)
	fn(assertEquals)
	t.end()
})

test(`combine`, assertEquals => {
	assertEquals(combine(/a/, /b/, /c/), /abc/)
	assertEquals(combine(/ab/, /c/), /abc/)
})

test(`suffix`, assertEquals => {
	assertEquals(anyNumber(/wat/), /(?:wat)*/)
	assertEquals(anyNumber('wat*'), /(?:wat\*)*/)
	assertEquals(anyNumber('wat*', /yarp/), /(?:wat\*yarp)*/)

	assertEquals(oneOrMore(/wat/), /(?:wat)+/)
	assertEquals(oneOrMore('wat*'), /(?:wat\*)+/)
	assertEquals(oneOrMore('wat*', /yarp/), /(?:wat\*yarp)+/)

	assertEquals(optional(/wat/), /(?:wat)?/)
	assertEquals(optional('wat*'), /(?:wat\*)?/)
	assertEquals(optional('wat*', /yarp/), /(?:wat\*yarp)?/)

	assertEquals(exactly(3, /wat/), /(?:wat){3}/)
	assertEquals(exactly(2, 'wat*'), /(?:wat\*){2}/)
	assertEquals(exactly(2, 'wat*', /yarp/), /(?:wat\*yarp){2}/)

	assertEquals(atLeast(3, /wat/), /(?:wat){3,}/)
	assertEquals(atLeast(2, 'wat*'), /(?:wat\*){2,}/)
	assertEquals(atLeast(2, 'wat*', /yarp/), /(?:wat\*yarp){2,}/)

	assertEquals(between(2, 3, /wat/), /(?:wat){2,3}/)
	assertEquals(between(3, 4, 'wat*'), /(?:wat\*){3,4}/)
	assertEquals(between(3, 4, 'wat*', /yarp/), /(?:wat\*yarp){3,4}/)

	assertEquals(anyNumberNonGreedy(/wat/), /(?:wat)*?/)
	assertEquals(anyNumberNonGreedy('wat*'), /(?:wat\*)*?/)
	assertEquals(anyNumberNonGreedy('wat*', /yarp/), /(?:wat\*yarp)*?/)

	assertEquals(oneOrMoreNonGreedy(/wat/), /(?:wat)+?/)
	assertEquals(oneOrMoreNonGreedy('wat*'), /(?:wat\*)+?/)
	assertEquals(oneOrMoreNonGreedy('wat*', /yarp/), /(?:wat\*yarp)+?/)

	assertEquals(optionalNonGreedy(/wat/), /(?:wat)??/)
	assertEquals(optionalNonGreedy('wat*'), /(?:wat\*)??/)
	assertEquals(optionalNonGreedy('wat*', /yarp/), /(?:wat\*yarp)??/)

	assertEquals(exactlyNonGreedy(3, /wat/), /(?:wat){3}?/)
	assertEquals(exactlyNonGreedy(2, 'wat*'), /(?:wat\*){2}?/)
	assertEquals(exactlyNonGreedy(2, 'wat*', /yarp/), /(?:wat\*yarp){2}?/)

	assertEquals(atLeastNonGreedy(3, /wat/), /(?:wat){3,}?/)
	assertEquals(atLeastNonGreedy(2, 'wat*'), /(?:wat\*){2,}?/)
	assertEquals(atLeastNonGreedy(2, 'wat*', /yarp/), /(?:wat\*yarp){2,}?/)

	assertEquals(betweenNonGreedy(2, 3, /wat/), /(?:wat){2,3}?/)
	assertEquals(betweenNonGreedy(3, 4, 'wat*'), /(?:wat\*){3,4}?/)
	assertEquals(betweenNonGreedy(3, 4, 'wat*', /yarp/), /(?:wat\*yarp){3,4}?/)
})

test(`flags`, assertEquals => {
	assertEquals(flags('g', 'butts'), /butts/g)
	assertEquals(flags('g', 'yarp', /butts/), /yarpbutts/g)
})

test(`capture`, assertEquals => {
	assertEquals(capture(/whatever/), /(whatever)/)
	assertEquals(capture(/(wh)/, /[at]/, /ever/), /((wh)[at]ever)/)
})

test(`either`, assertEquals => {
	assertEquals(either('*', /a*/, 'a'), /(?:\*|a*|a)/)
})

test(`some composition`, assertEquals => {
	assertEquals(optional(combine(/a/, /bc/)), /(?:abc)?/)
	assertEquals(optional(either(/a/, /bc/)), /(?:a|bc)?/)

	assertEquals(capture(either(/a/, /bc/)), /(a|bc)/)

	assertEquals(either('sup+', either(/a/, /bc/)), /(?:sup\+|(?:a|bc))/)

	assertEquals(capture(either(/butts/, /lol|buttocks/)), /(butts|(?:lol|buttocks))/)
})
