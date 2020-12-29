function stripDuplicates(str) {
	var seen = {},
		len = str.length,
		i = 0,
		clean = ''
	for (; i < len; i++) {
		var chr = str[i]
		if (!seen[chr]) {
			clean += chr
			seen[chr] = true
		}
	}
	return clean
}

//var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var alphabet1 =
	'@%-./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzабвгдежзийклмнопрстуфхцчшщъыьэюяАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'

function createCipherKey(keyword, alphabet = alphabet1) {
	keyword = stripDuplicates(keyword)

	var monoalphabet = alphabet,
		len = keyword.length,
		i = 0,
		x = 0,
		rows = [],
		cipher = ''

	for (; i < len; i++) {
		monoalphabet = monoalphabet.replace(new RegExp(keyword[i], 'g'), '')
	}

	monoalphabet = keyword + monoalphabet

	for (; x < len; x++) {
		var key = keyword[x],
			k = x,
			mlen = monoalphabet.length,
			row = ''

		for (; k < mlen; k += len) {
			row += monoalphabet[k]
		}
		rows.push(row)
	}

	cipher = rows
		.sort(function (a, b) {
			return a[0] > b[0] ? 1 : 0
		})
		.join('')

	return cipher
}

const Transposition = {
	encrypt: (keyword, phrase, alphabet = alphabet1) => {
		phrase = phrase
		var cipherKey = createCipherKey(keyword, alphabet)

		return Array.prototype.map
			.call(phrase, function (i) {
				return i === ' ' ? ' ' : cipherKey[alphabet.indexOf(i)]
			})
			.join('')
	},
	decrypt: (key, phrase, alphabet = alphabet1) => {
		phrase = phrase
		var cipher = createCipherKey(key, alphabet)

		return Array.prototype.map
			.call(phrase, function (i) {
				return i === ' ' ? ' ' : alphabet[cipher.indexOf(i)]
			})
			.join('')
	},
}
