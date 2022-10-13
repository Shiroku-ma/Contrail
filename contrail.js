var justBefore;
var intelli = [ "{", "[", "(", "'", '"', "<"]

class Contrail {
	constructor() {
		this.cm = false;
		this.cp = 1;
		this.color_mode = false;
	}

	get codeMode() {
		return this.cm;
	}

	get colorMode() {
		return this.color_mode;
	}

	set cursorPos(pos) {
		this.cp = pos;
	}

	get cursorPos() {
		return this.cp;
	}

	switchColorMode() {
		this.color_mode = !this.color_mode;
	}

	switchCodeMode() {
		this.cm = !this.cm;
	}

}

const contrail = new Contrail();

function CountLine( str ) {
    num = str.match(/\r\n|\n/g);
    if (num!=null){
        line = num.length +1;
    } else {
        line = 1;
    }
	var linenum = document.getElementById('line-number');
	cnt = linenum.childElementCount;
	if (line < cnt) {
		for (i = 0; i < cnt - line; i++) {
			linenum.lastElementChild.remove()
		}
	} else if (line > cnt) {
		for (i = cnt; i < line; i++) {
			linenum.insertAdjacentHTML('beforeend', "<span class=line-item>" + (i + 1) + "</span>");
		}
	}
	highLight(str);
}

function onTextAreaKeyDown(event, object) {
    var keyCode = event.keyCode;
    var keyVal = event.key;

    var cursorPosition = object.selectionStart;
    var leftString = object.value.substr(0, cursorPosition);
    var rightString = object.value.substr(cursorPosition, object.value.length);

    if(keyCode === 9) {
        event.preventDefault();  // 元の挙動を止める
        // textareaの値をカーソル左の文字列 + タブスペース + カーソル右の文字列にする
        object.value = leftString + "\t" + rightString;
        // カーソル位置をタブスペースの後ろにする
        object.selectionEnd = cursorPosition + 1;
    }
	if (contrail.codeMode) {
    //自動補完
		if (keyVal === "{") { //括弧
			event.preventDefault();
			object.value = leftString + "{}" + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = "{"
		}
		else if (keyVal === "[") {
			event.preventDefault();
			object.value = leftString + "[]" + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = "["
		} else if (keyVal === '"') { //ダブルクォート
			event.preventDefault();
			object.value = leftString + '""' + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = '"'
		} else if (keyVal === "'") { //シングルクォート
			event.preventDefault(); 
			object.value = leftString + "''" + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = "'"
		} else if (keyVal === "(") { // 括弧
			event.preventDefault(); 
			object.value = leftString + "()" + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = "("
		} else if (keyVal === "<") {
			event.preventDefault();
			object.value = leftString + "<>" + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = "<";
		} else if (keyCode === 8 && intelli.includes(justBefore)) {
			object.value = leftString + rightString.slice(1);
			object.selectionEnd = cursorPosition;
			justBefore = "bs"
		} else if (keyCode === 13 && intelli.includes(justBefore)) {
			object.value = leftString + "\n" + rightString;
			object.selectionEnd = cursorPosition;
			justBefore = "bs"
		} else {
			justBefore = "ot"
		}
	}

	highLight(object.value)
}

function escapeHTML(string){
    return string.replace(/&/g, '&lt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#x27;");
}

function highLight( str ) {
	var text = escapeHTML(str);

	if (contrail.colorMode) {
		for (i = 0; i < str.length; i++) {
			if (str.substr(i, 1) === '"') {
				if (str.substr(i, 2) === '"<') {
					continue;
				}
				for (j = i + 1; j < str.length; j++) {
					if (str.substr(j, 1) === '"') {
						text = str.substr(0, i) + '<span class=red>"' + str.substr(i + 1, j - i - 1) + '"</span>' + str.substr(j + 1);
						break;
					}
				}
			}
		}
	}

	document.getElementById("code").innerHTML = text;
}

(function() {
	var editor = document.getElementById("editor"); //エディタ
	var linenum = document.getElementById('line-number'); //行番号

	editor.onkeydown = function(event) {onTextAreaKeyDown(event, this);}


	document.getElementById('cmd-line-num').style.backgroundColor = "rgb(90, 124, 187)";
	const child = document.getElementById('commands').children;

	for (i = 0; i < child.length; i++) {
		child[i].addEventListener('click', function() {
			if (window.getComputedStyle(this).backgroundColor === "rgb(90, 124, 187)") {
				this.style.backgroundColor = "";
			} else {
				this.style.backgroundColor = "rgb(90, 124, 187)";
			}
			editor.focus();
			editor.selectionStart = contrail.cursorPos;
		})
	}
	
	//行番号
	document.getElementById('cmd-line-num').addEventListener('click', function() {
		if (linenum.style.display == "none") {
			linenum.style.display = "flex";
		} else {
			linenum.style.display = "none";
		}
		linenum.scrollTop = editor.scrollTop;
	});

	//コードモード
	document.getElementById('cmd-code-mode').addEventListener('click', function() {
		contrail.switchCodeMode();
	});

	//カラーモード
	document.getElementById('cmd-color-mode').addEventListener('click', function() {
		contrail.switchColorMode();
		highLight(editor.value)
	});

	editor.addEventListener('blur', function() {
		contrail.cursorPos = this.selectionStart;
	})
})();
