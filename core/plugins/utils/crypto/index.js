import CryptoJS from './crypto-js';

export default {
	/**
	 * 加密函数
	 * @param  {[type]} data [形参，需要加密的值]
	 * @return {[type]}   [加密后的值]
	 */

	encode(value, key){
		if (key.length != 32) return; //如果key的长度不等于32则返回

		let key_base = key.substring(0, 16);
		let iv_base = key.substring(16, 32);

		let get = function (data) {
			let key_hash = CryptoJS.MD5(key_base);
				key_base = CryptoJS.enc.Utf8.parse(key_base);
				iv_base = CryptoJS.enc.Utf8.parse(iv_base);
				data = CryptoJS.AES.encrypt(data, key_base, {
						iv: iv_base,
						mode: CryptoJS.mode.CBC,
						padding: CryptoJS.pad.Pkcs7 // 后台用的是pad.Pkcs5,前台对应为Pkcs7
				});

				data = CryptoJS.enc.Base64.stringify(data.ciphertext);
				data = data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
				return data;
		}
		return get(value);
	},

	/**
	 * 解密函数
	 * @param  {[type]} data [形参，需要加密的值]
	 * @return {[type]}   [加密后的值]
	 */
	decode(data, key){
		if (key.length != 32) return;  //如果key的长度不等于32则返回
		let key_base = key.substring(0, 16);
		let iv_base = key.substring(16, 32);
		key_base = CryptoJS.enc.Utf8.parse(key_base);
		iv_base = CryptoJS.enc.Utf8.parse(iv_base);

		let rem = data.length % 4;
		let dd = "";
		for (let i = 0; i < (4 - rem); i++) {
				dd += '='
		}
		data = data.replace(/-/g, '+').replace(/_/g, '/');
		data = data+dd;

		data = CryptoJS.AES.decrypt(data, key_base, {
				iv: iv_base,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
		});

		// 经过CryptoJS解密后，依然是一个对象，将其变成明文就需要按照Utf8格式转为字符串
		data = data.toString(CryptoJS.enc.Utf8);
		return data;
	}

}


