<?php
	function hash_password($_password,$_salt) {

		$_password = str_rot13($_password);
		$_password = $_password.$_salt;
		for($i = 0; $i < 100; $i++) {
			$_password = hash("sha512",$_password,false);
			$_password = hash("whirlpool",$_password,false);
		}
		$_password = base64_encode($_password);
		
		return $_password;
	}

	function getRandomBytes($bytes)
	{
		// Read only, binary safe mode:
		$fp = fopen('/dev/urandom', 'rb');

		// If we cannot open a handle, we should abort the script
		if ($fp === false) {
			die("File descriptor exhaustion!");
		}
		// Do not buffer (and waste entropy)
		stream_set_read_buffer($fp, 0);

		$entropy = fread($fp, $bytes);
		fclose($fp);
		return $entropy;
	}

	function randomString($length=32, $chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%&@~{|}!()*+,-.:;<=>?[]^_`') {
		$randomBytes = array_map('ord', str_split(getRandomBytes(max($length,32))));

		$alphabet = $chars;
		while(strlen($alphabet) <= 128) $alphabet .= $alphabet;
		while(strlen($alphabet) + strlen($chars) <= 256) $alphabet .= $chars;
		$alphabet_length = strlen($alphabet);

		$result = '';
		for ($i = 0; $i < $length; $i++) {
			$j = $i;
			$a = $randomBytes[$i];
			while($a >= $alphabet_length) {
				$j = ($j+1) % $length;
				$a = $randomBytes[$i] ^ $randomBytes[$j];
			}
			$result .= $alphabet[$a];
		}
		return $result;
	}
?>
