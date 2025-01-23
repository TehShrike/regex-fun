import { strict as assert } from 'node:assert'

import isAtomic from './is-atomic.js'

const assertAtomic = regex => assert.equal(isAtomic(regex), true, `${regex.source} should be atomic`)
const assertNotAtomic = regex => assert.equal(isAtomic(regex), false, `${regex.source} should not be atomic`)

const test = (description, fn) => {
	fn()
	console.log(`"${description}" passed`)
}

test(`atomic regexes`, () => {
	assertAtomic(/(wat)/)
	assertAtomic(/[wat]/)
	assertAtomic(/(oh(what)now)/)
	assertAtomic(/([wat])/)
	assertAtomic(/[(wat)]/)

	assertAtomic(/a/)
})

test(`non-atomic regex`, () => {
	assertNotAtomic(/(wat)*/)
	assertNotAtomic(/[wat][oh]/)
	assertNotAtomic(/now(oh(what))/)
	assertNotAtomic(/(ok)([wat])/)

	assertNotAtomic(/aa/)
})

