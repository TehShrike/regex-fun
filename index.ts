import isAtomic from './is-atomic.ts'
import regexSource from './regex-source.ts'

type RegexInput = RegExp | string

export const combine = returnsRegex((...args: RegexInput[]) => escapeInputForCombining(...args).join(``))

const guaranteeAtomic = (regex: RegexInput): string => isAtomic(regex) ? regexSource(regex) : `(?:${regexSource(regex)})`
const escapeRegex = (str: string): string => str.replace(/[.?*+^$[\]\\(){}|-]/g, `\\$&`)
const ifRegex = <T>(input: RegexInput, ifCase: (r: RegExp) => T, elseIfCase: (s: string) => T): T => input instanceof RegExp ? ifCase(input) : elseIfCase(input)
const escapeInputAndReturnString = (regex: RegexInput): string => ifRegex(regex, regex => regex.source, escapeRegex)

function removeNonCapturingGroupIfExists(regexString: string): string {
	const match = /^\(\?:(.+)\)$/.exec(regexString)
	return match ? match[1] : regexString
}

function guaranteeNoTopLevelOrs(regexString: string): string {
	return regexString.indexOf(`|`) >= 0 ? guaranteeAtomic(regexString) : regexString
}

function escapeInputForCombining(...args: RegexInput[]): string[] {
	return args.map(escapeInputAndReturnString).map(guaranteeNoTopLevelOrs)
}

function returnsRegex(fn: (...args: RegexInput[]) => RegexInput): (...args: RegexInput[]) => RegExp {
	return (...args: RegexInput[]) => ifRegex(fn(...args), regex => regex, input => new RegExp(input))
}

function makeJoiningFunction(openingCharacter: string, joinCharacter: string, closingCharacter: string): (...args: RegexInput[]) => RegExp {
	return returnsRegex((...args: RegexInput[]) => {
		const naiveBody = escapeInputForCombining(...args).join(joinCharacter)
		const body = isAtomic(naiveBody) ? removeNonCapturingGroupIfExists(naiveBody) : naiveBody

		return concat(openingCharacter, body, closingCharacter)
	})
}

function suffix(appendCharacter: string): (...args: RegexInput[]) => RegExp {
	return returnsRegex((...args: RegexInput[]) => concat(guaranteeAtomic(combine(...args)), appendCharacter))
}

function concat(...regexes: RegexInput[]): string {
	return regexes.map(regexSource).join(``)
}

export const flags = (flags: string, ...args: RegexInput[]): RegExp => new RegExp(combine(...args).source, flags)
export const either = makeJoiningFunction(`(?:`, `|`, `)`)
export const capture = makeJoiningFunction(`(`, ``, `)`)
export const anyNumber = suffix(`*`)
export const oneOrMore = suffix(`+`)
export const optional = suffix(`?`)
export const exactly = (n: number, ...regexes: RegexInput[]): RegExp => suffix(`{${n}}`)(...regexes)
export const atLeast = (n: number, ...regexes: RegexInput[]): RegExp => suffix(`{${n},}`)(...regexes)
export const between = (n: number, m: number, ...regexes: RegexInput[]): RegExp => suffix(`{${n},${m}}`)(...regexes)
export const anyNumberNonGreedy = suffix(`*?`)
export const oneOrMoreNonGreedy = suffix(`+?`)
export const optionalNonGreedy = suffix(`??`)
export const exactlyNonGreedy = (n: number, ...regexes: RegexInput[]): RegExp => suffix(`{${n}}?`)(...regexes)
export const atLeastNonGreedy = (n: number, ...regexes: RegexInput[]): RegExp => suffix(`{${n},}?`)(...regexes)
export const betweenNonGreedy = (n: number, m: number, ...regexes: RegexInput[]): RegExp => suffix(`{${n},${m}}?`)(...regexes)
