const isAtomic = require('./is-atomic')
const regexSource = require('./regex-source')

const combine = returnsRegex((...args) => escapeInputForCombining(...args).join(''))
const guaranteeAtomic = regex => isAtomic(regex) ? regex : `(?:${regexSource(regex)})`
const escapeRegex = str => str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')

module.exports = {
	combine,
	either: makeJoiningFunction('(?:', '|', ')'),
	capture: makeJoiningFunction('(', '', ')'),

	flags: (flags, ...args) => new RegExp(combine(...args), flags),

	anyNumber: suffix('*'),
	oneOrMore: suffix('+'),
	optional: suffix('?'),
	exactly: (n, ...regexes) => suffix(`{${n}}`)(...regexes),
	atLeast: (n, ...regexes) => suffix(`{${n},}`)(...regexes),
	between: (n, m, ...regexes) => suffix(`{${n},${m}}`)(...regexes),

	anyNumberNonGreedy: suffix('*?'),
	oneOrMoreNonGreedy: suffix('+?'),
	optionalNonGreedy: suffix('??'),
	exactlyNonGreedy: (n, ...regexes) => suffix(`{${n}}?`)(...regexes),
	atLeastNonGreedy: (n, ...regexes) => suffix(`{${n},}?`)(...regexes),
	betweenNonGreedy: (n, m, ...regexes) => suffix(`{${n},${m}}?`)(...regexes),
}

function escapeInputAndReturnString(regex) {
	if (regex instanceof RegExp) {
		return regex.source
	}	else {
		return escapeRegex(regex)
	}
}

function removeNonCapturingGroupIfExists(regexString) {
	const match = /^\(\?:(.+)\)$/.exec(regexString)
	return match ? match[1] : regexString
}

function guaranteeNoTopLevelOrs(regexString) {
	return regexString.indexOf('|') >= 0 ? guaranteeAtomic(regexString) : regexString
}

function escapeInputForCombining(...args) {
	return args.map(escapeInputAndReturnString).map(guaranteeNoTopLevelOrs)
}

function returnsRegex(fn) {
	return (...args) => new RegExp(fn(...args))
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
	return regexes.map(regexSource).join('')
}
