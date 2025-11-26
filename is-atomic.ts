import regexSource from './regex-source.ts'

const closingCharacters: Record<string, string> = {
	'(': `)`,
	'[': `]`,
}

export default function isAtomic(regex: RegExp | string): boolean {
	const string = regexSource(regex)

	return /^\w$/.test(string) || enclosedByTopLevelCharacters(string)
}

function enclosedByTopLevelCharacters(string: string): boolean {
	const openingCharacter = string[0]
	const closingCharacter = closingCharacters[openingCharacter]


	const closedByAppropriateCharacter = closingCharacter !== undefined
		&& string[string.length - 1] === closingCharacter


	if (!closedByAppropriateCharacter) {
		return false
	}

	return !isClosedBeforeEndOfString(string, openingCharacter, closingCharacter)
}


function isClosedBeforeEndOfString(string: string, openingCharacter: string, closingCharacter: string): boolean {
	let depth = 0

	for (let characterIndex = 0; characterIndex < string.length - 1; ++characterIndex) {
		depth = calculateNewDepth(depth, openingCharacter, closingCharacter, string[characterIndex])
		if (depth === 0) {
			return true
		}
	}

	return false
}

function calculateNewDepth(previousDepth: number, openingCharacter: string, closingCharacter: string, character: string): number {
	if (character === openingCharacter) {
		return previousDepth + 1
	} else if (character === closingCharacter) {
		return previousDepth - 1
	} else {
		return previousDepth
	}
}
