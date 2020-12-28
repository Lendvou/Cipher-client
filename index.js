import vigenere from './algs/vigenere.js'
import caesar from './algs/caesar.js'
import transposition from './algs/transposition.js'
import tripledes from './algs/tripledes.js'

const select = document.getElementById('select')
const button = document.getElementById('button')
const input = document.getElementById('input')
const inputSecret = document.getElementById('input-secret')
const output = document.getElementById('output')
const buttonDecipher = document.getElementById('button-decipher')
const containerDecipher = document.getElementById('container-decipher')
const outputDecipher = document.getElementById('output-decipher')
const inputDecipher = document.getElementById('input-decipher')

button.onclick = () => {
	if (!input.value) return

	cipher()
}
input.onkeyup = inputSecret.onkeyup = (e) => {
	if (!input.value) return

	if (e.key === 'Enter') {
		cipher()
	}
}
buttonDecipher.onclick = () => {
	if (!input.value) return

	const items = {
		aes: aesDecrypt,
		vigenere: vigenereDecrypt,
		caesar: caesarDecrypt,
		tripledes: tripledesDecrypt,
		transposition: transpositionDecrypt,
	}

	const currentAlg = items[select.value]
	currentAlg()
}

function cipher() {
	const items = {
		md5: md5,
		vigenere: vigenereEncrypt,
		sha1: sha1,
		caesar: caesarEncrypt,
		aes: aes,
		tripledes: tripledesEncrypt,
		sha256: sha256,
		transposition: transpositionEncrypt,
	}

	const currentAlg = items[select.value]
	currentAlg()
}

select.onchange = (e) => {
	input.value = ''
	inputSecret.value = ''
	inputDecipher.value = ''
	output.innerText = ''
	outputDecipher.innerText = ''

	if (['md5', 'sha1', 'sha256'].includes(e.target.value)) {
		inputSecret.classList.remove('active')
		containerDecipher.classList.remove('active')
	} else {
		inputSecret.classList.add('active')
		containerDecipher.classList.add('active')
	}

	if (e.target.value === 'caesar') {
		inputSecret.placeholder = 'Shift'
		inputSecret.type = 'number'
	} else {
		inputSecret.placeholder = 'Secret'
		inputSecret.type = 'text'
	}
}

function transpositionEncrypt() {
	const text = input.value
	const secret = inputSecret.value

	output.innerText = transposition.encrypt(secret, text)
}
function transpositionDecrypt() {
	const text = inputDecipher.value
	const secret = inputSecret.value

	outputDecipher.innerText = transposition.decrypt(secret, text)
}

function md5() {
	output.innerText = CryptoJS.MD5(input.value)
}

function sha1() {
	output.innerText = CryptoJS.SHA1(input.value)
}

function sha256() {
	output.innerText = CryptoJS.SHA256(input.value)
}

function caesarEncrypt() {
	const text = input.value
	const shift = +inputSecret.value
	output.innerText = caesar.encrypt(text, isNaN(shift) ? 3 : shift)
}
function caesarDecrypt() {
	const text = inputDecipher.value
	const shift = +inputSecret.value
	outputDecipher.innerText = caesar.decrypt(text, isNaN(shift) ? 3 : shift)
}

function aes() {
	output.innerText = CryptoJS.AES.encrypt(input.value, inputSecret.value)
}
function aesDecrypt() {
	const outputDecipher = document.getElementById('output-decipher')
	const inputDecipher = document.getElementById('input-decipher')

	const result = CryptoJS.AES.decrypt(
		inputDecipher.value,
		inputSecret.value
	).toString(CryptoJS.enc.Utf8)

	outputDecipher.innerText = result
}

function vigenereEncrypt() {
	const text = input.value
	const secret = inputSecret.value

	output.innerText = vigenere.encrypt(text, secret)
}
function vigenereDecrypt() {
	const encryptedText = inputDecipher.value
	const secret = inputSecret.value

	outputDecipher.innerText = vigenere.decrypt(encryptedText, secret)
}

function tripledesEncrypt() {
	const text = input.value
	const key = inputSecret.value

	output.innerText = tripledes.encrypt(text, key)
}
function tripledesDecrypt() {
	const text = inputDecipher.value
	const key = inputSecret.value

	outputDecipher.innerText = tripledes.decrypt(text, key)
}
