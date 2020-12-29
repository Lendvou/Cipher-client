const Tripledes = {
	encrypt: (text, key) => {
		return CryptoJS.TripleDES.encrypt(text, key)
	},
	decrypt: (encryptedText, key) => {
		return CryptoJS.TripleDES.decrypt(encryptedText, key).toString(
			CryptoJS.enc.Utf8
		)
	},
}
