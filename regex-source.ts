export default (regex: RegExp | string): string => regex instanceof RegExp ? regex.source : regex
