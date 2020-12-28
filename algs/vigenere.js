const typeDefine = {
	cyr: {
		AlphaNum: 32,
		StartCodeU: 1040,
		FinishCodeU: 1071,
		StartCodeL: 1072,
		FinishCodeL: 1105,
	},
	lat: {
		AlphaNum: 26,
		StartCodeU: 65,
		FinishCodeU: 90,
		StartCodeL: 97,
		FinishCodeL: 122,
	},
}

const keepLetters = (s) => s.replace(/[^a-zA-Zа-яА-Яα-ωΑ-Ω]+/g, '')
const isLetter = (c) => c.match(/[a-zA-Zа-яА-Яα-ωΑ-Ω]+/)
const isUpperCase = (c) => c.match(/[A-ZА-ЯΑ-Ω]+/)

const workerChar = (char, key, type = 'e', lang) => {
	if (!isLetter(char) || !isLetter(key)) return char
	const uppercase = isUpperCase(char)
	char = char.toLowerCase().charCodeAt(0)
	key = key.toLowerCase().charCodeAt(0)
	const { AlphaNum, StartCodeU, StartCodeL } = typeDefine[lang]
	const a = StartCodeL
	const A = StartCodeU
	if (type === 'd') {
		let temp = a + (char - a - (key - a))
		if (temp < a) temp += AlphaNum
		temp = String.fromCharCode(temp)
		return uppercase ? temp.toUpperCase() : temp
	} else
		return String.fromCharCode(
			(uppercase ? A : a) + ((char - a + (key - a)) % AlphaNum)
		)
}

// Worker for Vigenere algorithm
const worker = (str, key, type, lang) => {
	if (typeof key !== 'string' || typeof str !== 'string') {
		throw Error('Text and Key must be string')
	}
	if (!Object.prototype.hasOwnProperty.call(typeDefine, lang)) {
		throw Error('Type must be "lat" or "cyr"')
	}
	if (str === null || key === null) {
		throw Error('Message and key should be not empty')
	}
	key = keepLetters(key)
	let result = ''
	let keyIndex = 0
	for (let i = 0; i < str.length; i++) {
		const char = str.charAt(i)
		if (isLetter(char)) {
			const keyEl = key.charAt(keyIndex++ % key.length)
			const temp = workerChar(char, keyEl, type, lang)
			result += temp
		} else {
			result += char
		}
	}
	return result
}

const vigenereEncrypt = (text = null, key = null) => {
	const currentLang =
		text.charCodeAt(0) > 95 && text.charCodeAt(0) < 123 ? 'lat' : 'cyr'
	return worker(text, key, 'e', currentLang)
}

const vigenereDecrypt = (cipher = null, key = null) => {
	const currentLang =
		cipher.charCodeAt(0) > 95 && cipher.charCodeAt(0) < 123 ? 'lat' : 'cyr'
	return worker(cipher, key, 'd', currentLang)
}

export default {
	encrypt: vigenereEncrypt,
	decrypt: vigenereDecrypt,
}
