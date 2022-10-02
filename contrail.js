var codeMode = false;
var justBefore;

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
	if (codeMode) {
    // かぎかっこの場合の自動補完
		if (keyVal === "{") {
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
		} else if (keyVal === '"') {
			event.preventDefault();
			object.value = leftString + '""' + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = '"'
		} else if (keyVal === "'") {
			event.preventDefault(); 
			object.value = leftString + "''" + rightString;
			object.selectionEnd = cursorPosition + 1;
			justBefore = "'"
		} else if (
			keyCode === 8 && (justBefore === "{" || justBefore === "[" || justBefore === "'" || justBefore === '"')) {
			object.value = leftString + rightString.slice(1);
			object.selectionEnd = cursorPosition;
			justBefore = "bs"
		} else {
			justBefore = "ot"
		}
	}
}


(function() {
	var editor = document.getElementById("editor"); //エディタ
	var linenum = document.getElementById('line-number') //行番号

	editor.onkeydown = function(event) {onTextAreaKeyDown(event, this);}
	
	document.getElementById('cmd-line-num').addEventListener('click', function() {
		if (linenum.style.display == "none") {
			linenum.style.display = "flex";
		} else {
			linenum.style.display = "none";
		}
	});

	document.getElementById('cmd-code-mode').addEventListener('click', function() {
		codeMode = !codeMode
	});
})();
