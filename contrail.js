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
	document.getElementById('code').innerText = str;
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
		} else if (keyCode === 8) { //backspace
			if (intelli.includes(justBefore)) {
				object.value = leftString + rightString.slice(1);
				object.selectionEnd = cursorPosition;
				justBefore = "bs"
			} else {
				if (leftString.substr(-1) == "\n") {
					const array = leftString.split("\n");
					const index = array.length - 2; "連続タブ文字がある位置";
					if (array[index].match(/^\t+$/) != null) {
						event.preventDefault();
						const tabCount = array[index].match(/\t/g || []).length
						console.log(tabCount)
						array.splice(index, 1)
						leftString_new = array.join("\n");
						object.value = leftString_new + rightString;
						object.selectionEnd = cursorPosition - tabCount - 1;
					}
				}
			}
		} else if (keyCode === 13) { //ender
			event.preventDefault();
			//行の初めにあるタブの数
			//valueをカーソル位置までを切り取り、それを改行で区切った配列の末尾を取得することで行の初めからカーソル手前までを取得し、その中のタブ文字の数を取得する。
			tabCount = object.value.substr(0, object.selectionStart).split("\n").pop().split("\t").length
			
			if (intelli.includes(justBefore)) {
				object.value = leftString + `\n${"\t".repeat(tabCount)}\n${"\t".repeat(tabCount - 1)}` + rightString;
			} else {
				object.value = leftString + `\n${"\t".repeat(tabCount - 1)}` + rightString;
				tabCount -= 1;//下の計算の和を1減らす目的
			}

			justBefore = "bs"
			CountLine(object.value)
			object.selectionStart = cursorPosition + tabCount + 1;
			object.selectionEnd = cursorPosition + tabCount + 1;
		} else {
			justBefore = "ot"
		}
	}

	document.getElementById('code').innerText = object.value;
}

function escapeHTML(string){
    return string.replace(/&/g, '&lt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#x27;");
}

(function() {
	var editor = document.getElementById("editor"); //エディタ
	var linenum = document.getElementById('line-number'); //行番号

	editor.onkeydown = function(event) {onTextAreaKeyDown(event, this);}


	document.getElementById('cmd-line-num').style.backgroundColor = "rgb(255, 255, 255)";
	document.getElementById('cmd-line-num').style.fill = "rgb(0, 0, 0)";
	const child = document.getElementById('commands').children;

	for (i = 0; i < child.length; i++) {
		child[i].addEventListener('click', function() {
			if (window.getComputedStyle(this).backgroundColor === "rgb(255, 255, 255)") {
				this.style.backgroundColor = "";
				this.style.fill = "rgb(180, 180, 180)"
			} else {
				this.style.backgroundColor = "rgb(255, 255, 255)";
				this.style.fill = "rgb(0, 0, 0)"
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

	//クリップ
	var isClip = false;
	document.getElementById('cmd-front-clip').addEventListener('click', function() {
		window.myAPI.clip_onclick(!isClip);
		isClip = !isClip;
	});

	var translucentMode = false;
	//半透明モード
	document.getElementById('cmd-glass-mode').addEventListener('click', function() {
		if (translucentMode) {
			window.myAPI.translucent_window(1);
		} else {
			window.myAPI.translucent_window(0.6);
		}
		translucentMode = !translucentMode
	});

	editor.addEventListener('blur', function() {
		contrail.cursorPos = this.selectionStart;
	})
})();
