console.log('crypto', CryptoJS)

const select = document.getElementById('select')
const button = document.getElementById('button')
const input = document.getElementById('input')
const inputSecret = document.getElementById('input-secret')
const output = document.getElementById('output')
const buttonDecipher = document.getElementById('button-decipher')
const containerDecipher = document.getElementById('container-decipher')

button.onclick = cipher
input.onkeyup = (e) => {
	if (e.key === 'Enter') {
		cipher()
	}
}
buttonDecipher.onclick = blockDecipher

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
		case 'block':
			block()
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
	if (e.target.value === 'block') {
		inputSecret.classList.add('active')
		containerDecipher.classList.add('active')
	} else {
		inputSecret.classList.remove('active')
		containerDecipher.classList.remove('active')
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

function block() {
	console.log('block', input.value, inputSecret.value)
	output.innerText = CryptoJS.AES.encrypt(input.value, inputSecret.value)
}

function blockDecipher() {
	const outputDecipher = document.getElementById('output-decipher')
	const inputDecipher = document.getElementById('input-decipher')

	const result = CryptoJS.AES.decrypt(
		inputDecipher.value,
		inputSecret.value
	).toString(CryptoJS.enc.Utf8)

	outputDecipher.innerText = result
}
