// functions.js
// This is a JavaScript file


//******************************************************************************************************/
//
// showDialog()
//   汎用なのでどこからでも呼ばれる
//   メッセージセット、Dialog画面呼び出し
//
//******************************************************************************************************/
var showInfodialog = function(msg) {
    ons.notification.alert({
        title: "",
        messageHTML: msg,
        buttonLabel: "OK",
        animation: "fade",
        callback: function() {
            voice.pause();
        }
    })
};


//function selectRow(index, value) {
//    alert(index+"\n"+value);
//    select_rows.push(index);
//}

var getcheckdata = function(elms) {
    for(var v="", i=elms.length; i--;) {
    	if(elms[i].checked) {
	    	var v = elms[i].value;
		    break;
	    }
    }
    return v;
}

