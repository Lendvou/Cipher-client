const select = document.getElementById('select')
const button = document.getElementById('button')
const input = document.getElementById('input')
const inputSecret = document.getElementById('input-secret')
const output = document.getElementById('output')
const buttonDecipher = document.getElementById('button-decipher')
const containerDecipher = document.getElementById('container-decipher')
let Bob
let Alice

button.onclick = cipher
input.onkeyup = (e) => {
	if (e.key === 'Enter') {
		cipher()
	}
}
buttonDecipher.onclick = () => {
	switch (select.value) {
		case 'aes':
			aesDecipher()
			break
		case 'elGamal':
			elGamalDecrypt()
			break
	}
}

function cipher() {
	console.log('input', input.value)
	switch (select.value) {
		case 'md5':
			md5()
			break
		case 'sha1':
			sha1()
			break
		case 'caesar':
			caesar()
			break
		case 'aes':
			aes()
			break
		case 'elGamal':
			elGamal()
			break
		default:
			return
	}
}

select.onchange = (e) => {
	input.value = ''
	output.innerText = ''
	inputSecret.value = ''
	console.log('select', e.target.value)

	inputSecret.classList.remove('active')
	containerDecipher.classList.remove('active')

	if (e.target.value === 'aes') {
		inputSecret.classList.add('active')
		containerDecipher.classList.add('active')
		return
	}

	if (e.target.value === 'elGamal') {
		containerDecipher.classList.add('active')
		return
	}
}

function md5() {
	output.innerText = CryptoJS.MD5(input.value)
}

function sha1() {
	output.innerText = CryptoJS.SHA1(input.value)
}

function caesar() {
	let str = input.value
	let amount = 3

	if (amount < 0) {
		return caesarShift(str, amount + 26)
	}

	var result = ''

	for (var i = 0; i < str.length; i++) {
		var c = str[i]

		if (c.match(/[a-z]/i)) {
			var code = str.charCodeAt(i)

			if (code >= 65 && code <= 90) {
				c = String.fromCharCode(((code - 65 + amount) % 26) + 65)
			} else if (code >= 97 && code <= 122) {
				c = String.fromCharCode(((code - 97 + amount) % 26) + 97)
			}
		}

		result += c
	}

	output.innerText = result
}

function aes() {
	console.log('aes', input.value, inputSecret.value)
	output.innerText = CryptoJS.AES.encrypt(input.value, inputSecret.value)
}

function aesDecipher() {
	const outputDecipher = document.getElementById('output-decipher')
	const inputDecipher = document.getElementById('input-decipher')

	const result = CryptoJS.AES.decrypt(
		inputDecipher.value,
		inputSecret.value
	).toString(CryptoJS.enc.Utf8)

	outputDecipher.innerText = result
}

const Alphabet = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ \nπ®ƒ©∆'.split(
	''
)

const Crypto = function (alpha, gen, C) {
	var p, B

	const toAlpha = function (x) {
		if (x === 0) {
			return '!!!!'
		}
		let p
		let l
		let y = []
		let n = 4
		while (n--) {
			p = Math.pow(alpha.length, n)
			l = Math.floor(x / p)
			y.push(alpha[l])
			x -= l * p
		}
		return y.join('')
	}
	const to10 = function (x) {
		var y, p, n
		y = 0
		p = 1
		x = x.split('')
		n = x.length
		while (n--) {
			y += alpha.indexOf(x[n]) * p
			p *= alpha.length
		}
		return y
	}
	const modInv = function (gen, mod) {
		var v, d, u, t, c, q
		v = 1
		d = gen
		t = 1
		c = mod % gen
		u = Math.floor(mod / gen)
		while (d > 1) {
			q = Math.floor(d / c)
			d = d % c
			v = v + q * u
			if (d) {
				q = Math.floor(c / d)
				c = c % d
				u = u + q * v
			}
		}
		return d ? v : mod - u
	}
	const modPow = function (base, exp, mod) {
		var c, x
		if (exp === 0) {
			return 1
		} else if (exp < 0) {
			exp = -exp
			base = modInv(base, mod)
		}
		c = 1
		while (exp > 0) {
			if (exp % 2 === 0) {
				base = (base * base) % mod
				exp /= 2
			} else {
				c = (c * base) % mod
				exp--
			}
		}
		return c
	}
	p = 91744613
	C = parseInt(C, 10)
	if (isNaN(C)) {
		C = Math.round(Math.sqrt(Math.random() * Math.random()) * (p - 2) + 2)
	}
	B = modPow(gen, C, p)
	const decrypt = function (a) {
		var d, x, y
		x = a[1]
		y = modPow(a[0], -C, p)
		d = (x * y) % p
		d = Math.round(d) % p
		return alpha[d - 2]
	}
	const encrypt = function (key, d) {
		var k, a
		k = Math.ceil(Math.sqrt(Math.random() * Math.random()) * 1e10)
		d = alpha.indexOf(d) + 2
		a = []
		a[0] = modPow(key[1], k, key[0])
		a[1] = (d * modPow(key[2], k, key[0])) % key[0]
		return a
	}
	const f = function (message, key) {
		var n, x, y, w
		y = []
		message = message.split('')
		n = message.length
		while (n--) {
			x = encrypt(key, message[n])
			y.push(toAlpha(x[0]))
			y.push(toAlpha(x[1]))
		}
		y = y.join('')
		return y
	}
	const g = function (message) {
		var n, m, d, x
		m = []
		n = message.length / 8
		while (n--) {
			x = message[8 * n + 4]
			x += message[8 * n + 5]
			x += message[8 * n + 6]
			x += message[8 * n + 7]
			m.unshift(x)
			x = message[8 * n]
			x += message[8 * n + 1]
			x += message[8 * n + 2]
			x += message[8 * n + 3]
			m.unshift(x)
		}
		x = []
		d = []
		n = m.length / 2
		while (n--) {
			x[0] = m[2 * n]
			x[1] = m[2 * n + 1]
			x[0] = to10(x[0])
			x[1] = to10(x[1])
			d.push(decrypt(x))
		}
		message = d.join('')
		return message
	}
	return {
		pubKey: [p, gen, B],
		priKey: C,
		decrypt: g,
		encrypt: f,
	}
}

// var Alice = Crypto(Alphabet, 69)

// var Bob = Crypto(Alphabet, 69)

// console.log('keys', Alice.pubKey, Bob.pubKey)

// var message =
// 	'Hello ahaha you are so dumb for attempting to do this nafig nikomu nenuzhniy shit!'
// console.log(message)
// // "Hello!"

// const encrypted = Alice.encrypt(message, Bob.pubKey)
// console.log(encrypted)
// // "Pl)7t&rfGueuL@|)H'P,*<K\.hxw+∆d*`?Io)lg~Adz-6xrR" or something like it.

// const decrypted = Bob.decrypt(encrypted)
// console.log(decrypted)
// // "Hello!"

const elGamal = () => {
	const first = Crypto(Alphabet, 69)
	const second = Crypto(Alphabet, 69)
	const message = input.value

	Alice = first
	Bob = second
	const result = first.encrypt(message, second.pubKey)
	output.innerHTML = `
		<p>${result}</p>
		<p>Public key: [${first.pubKey.join(' | ')}]</p>
	`
}

const elGamalDecrypt = () => {
	const outputDecipher = document.getElementById('output-decipher')
	const inputDecipher = document.getElementById('input-decipher')
	// const first

	const decrypted = Bob.decrypt(inputDecipher.value)
	console.log('decr', decrypted, inputDecipher)
	outputDecipher.innerText = decrypted
}
