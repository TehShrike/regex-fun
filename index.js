import isAtomic from './is-atomic.js'
import regexSource from './regex-source.js'

export const combine = returnsRegex((...args) => escapeInputForCombining(...args).join(``))

const guaranteeAtomic = regex => isAtomic(regex) ? regex : `(?:${regexSource(regex)})`
const escapeRegex = str => str.replace(/[.?*+^$[\]\\(){}|-]/g, `\\$&`)
const ifRegex = (input, ifCase, elseIfCase) => input instanceof RegExp ? ifCase(input) : elseIfCase(input)
const escapeInputAndReturnString = regex => ifRegex(regex, regex => regex.source, escapeRegex)

function removeNonCapturingGroupIfExists(regexString) {
	const match = /^\(\?:(.+)\)$/.exec(regexString)
	return match ? match[1] : regexString
}

function guaranteeNoTopLevelOrs(regexString) {
	return regexString.indexOf(`|`) >= 0 ? guaranteeAtomic(regexString) : regexString
}

function escapeInputForCombining(...args) {
	return args.map(escapeInputAndReturnString).map(guaranteeNoTopLevelOrs)
}

function returnsRegex(fn) {
	return (...args) => ifRegex(fn(...args), regex => regex, input => new RegExp(input))
}

function makeJoiningFunction(openingCharacter, joinCharacter, closingCharacter) {
	return returnsRegex((...args) => {
		const naiveBody = escapeInputForCombining(...args).join(joinCharacter)
		const body = isAtomic(naiveBody) ? removeNonCapturingGroupIfExists(naiveBody) : naiveBody

		return concat(openingCharacter, body, closingCharacter)
	})
}

function suffix(appendCharacter) {
	return returnsRegex((...args) => concat(guaranteeAtomic(combine(...args)), appendCharacter))
}

function concat(...regexes) {
	return regexes.map(regexSource).join(``)
}

export const flags = (flags, ...args) => new RegExp(combine(...args).source, flags)
export const either = makeJoiningFunction(`(?:`, `|`, `)`)
export const capture = makeJoiningFunction(`(`, ``, `)`)
export const anyNumber = suffix(`*`)
export const oneOrMore = suffix(`+`)
export const optional = suffix(`?`)
export const exactly = (n, ...regexes) => suffix(`{${n}}`)(...regexes)
export const atLeast = (n, ...regexes) => suffix(`{${n},}`)(...regexes)
export const between = (n, m, ...regexes) => suffix(`{${n},${m}}`)(...regexes)
export const anyNumberNonGreedy = suffix(`*?`)
export const oneOrMoreNonGreedy = suffix(`+?`)
export const optionalNonGreedy = suffix(`??`)
export const exactlyNonGreedy = (n, ...regexes) => suffix(`{${n}}?`)(...regexes)
export const atLeastNonGreedy = (n, ...regexes) => suffix(`{${n},}?`)(...regexes)
export const betweenNonGreedy = (n, m, ...regexes) => suffix(`{${n},${m}}?`)(...regexes)
