function encrypt(text, key) {
	return CryptoJS.TripleDES.encrypt(text, key)
}
function decrypt(encryptedText, key) {
	return CryptoJS.TripleDES.decrypt(encryptedText, key).toString(
		CryptoJS.enc.Utf8
	)
}

export default {
	encrypt,
	decrypt,
}
