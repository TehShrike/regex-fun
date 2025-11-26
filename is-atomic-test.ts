import { strict as assert } from 'node:assert'

import isAtomic from './is-atomic.ts'

const assertAtomic = (regex: RegExp): void => {
	assert.equal(isAtomic(regex), true, `${regex.source} should be atomic`)
}
const assertNotAtomic = (regex: RegExp): void => {
	assert.equal(isAtomic(regex), false, `${regex.source} should not be atomic`)
}

const test = (description: string, fn: () => void): void => {
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
