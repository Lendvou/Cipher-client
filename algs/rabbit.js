function encrypt(text, key) {
	return CryptoJS.Rabbit.encrypt(text, key)
}
function decrypt(encryptedText, key) {
	return CryptoJS.Rabbit.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8)
}

export default {
	encrypt,
	decrypt,
}
