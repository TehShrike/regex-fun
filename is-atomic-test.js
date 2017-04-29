const tape = require('tape')
const isAtomic = require('./is-atomic')

const test = (description, fn) => tape(description, t => {
	fn({
		assertAtomic: regex => t.equal(isAtomic(regex), true, `${regex.source} should be atomic`),
		assertNotAtomic: regex => t.equal(isAtomic(regex), false, `${regex.source} should not be atomic`),
	})
	t.end()
})

test(`atomic regexes`, ({ assertAtomic }) => {
	assertAtomic(/(wat)/)
	assertAtomic(/[wat]/)
	assertAtomic(/(oh(what)now)/)
	assertAtomic(/([wat])/)
	assertAtomic(/[(wat)]/)

	assertAtomic(/a/)
})

test(`non-atomic regex`, ({ assertNotAtomic }) => {
	assertNotAtomic(/(wat)*/)
	assertNotAtomic(/[wat][oh]/)
	assertNotAtomic(/now(oh(what))/)
	assertNotAtomic(/(ok)([wat])/)

	assertNotAtomic(/aa/)
})

