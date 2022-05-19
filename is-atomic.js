const regexSource = require(`./regex-source.js`)

const closingCharacters = {
	'(': `)`,
	'[': `]`,
}

module.exports = function isAtomic(regex) {
	const string = regexSource(regex)

	return /^\w$/.test(string) || enclosedByTopLevelCharacters(string)
}

function enclosedByTopLevelCharacters(string) {
	const openingCharacter = string[0]
	const closingCharacter = closingCharacters[openingCharacter]


	const closedByAppropriateCharacter = closingCharacter !== undefined
		&& string[string.length - 1] === closingCharacter


	if (!closedByAppropriateCharacter) {
		return false
	}

	return !isClosedBeforeEndOfString(0, string, openingCharacter, closingCharacter)
}


function isClosedBeforeEndOfString(depth, string, openingCharacter, closingCharacter) {
	if (string.length === 1 && string[0] === closingCharacter && depth === 1) {
		return false
	}
	const [ nextCharacter, ...restOfCharacters ] = string
	const newDepth = calculateNewDepth(depth, openingCharacter, closingCharacter, nextCharacter)

	if (newDepth === 0) {
		return true
	}

	return isClosedBeforeEndOfString(newDepth, restOfCharacters, openingCharacter, closingCharacter)
}

function calculateNewDepth(previousDepth, openingCharacter, closingCharacter, character) {
	if (character === openingCharacter) {
		return previousDepth + 1
	} else if (character === closingCharacter) {
		return previousDepth - 1
	} else {
		return previousDepth
	}
}
