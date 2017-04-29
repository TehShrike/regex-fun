const isAtomic = require('./is-atomic')
const regexSource = require('./regex-source')

module.exports = {
	combine: returnsRegex((...args) => escapeInputForCombining(...args).join('')),
	either: makeJoiningFunction('(?:', '|', ')'),
	capture: makeJoiningFunction('(', '', ')'),

	flags: (regex, flags) => new RegExp(regex, flags),

	anyNumber: suffix('*'),
	oneOrMore: suffix('+'),
	optional: suffix('?'),
	exactly: (n, regex) => suffix(`{${n}}`)(regex),
	atLeast: (n, regex) => suffix(`{${n},}`)(regex),
	between: (n, m, regex) => suffix(`{${n},${m}}`)(regex),

	anyNumberNonGreedy: suffix('*?'),
	oneOrMoreNonGreedy: suffix('+?'),
	optionalNonGreedy: suffix('??'),
	exactlyNonGreedy: (n, regex) => suffix(`{${n}}?`)(regex),
	atLeastNonGreedy: (n, regex) => suffix(`{${n},}?`)(regex),
	betweenNonGreedy: (n, m, regex) => suffix(`{${n},${m}}?`)(regex),
}

const guaranteeAtomic = regex => isAtomic(regex) ? regex : `(?:${regexSource(regex)})`
const escapeRegex = str => str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')

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

		return openingCharacter + body + closingCharacter
	})
}

function suffix(appendCharacter) {
	return returnsRegex(regex => guaranteeAtomic(escapeInputAndReturnString(regex)) + appendCharacter)
}
