import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { collection, getDocs, query, where, orderBy, onSnapshot, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-check.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-functions.js";
//import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";


var firebase_app;
var firebase_auth;

var fromlogin;
window.fromlogin = fromlogin;
var progress_modal;
window.progress_modal = progress_modal;
var userinfo = "none";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeoM1dFbLWSmCfWgb89f4g9i8uawS9BWw",
  authDomain: "mitsubishi-autolease-demo1.firebaseapp.com",
  projectId: "mitsubishi-autolease-demo1",
  storageBucket: "mitsubishi-autolease-demo1.appspot.com",
  messagingSenderId: "68261982458",
  appId: "1:68261982458:web:0c2a571a2e30db51ac9943"
};

// Initialize Firebase
firebase_app = initializeApp(firebaseConfig);
const functions = getFunctions(firebase_app);
functions.region = "asia-northeast1";
const analytics = getAnalytics(firebase_app);

// AppCheck
const appCheck = initializeAppCheck(firebase_app, {
  provider: new ReCaptchaEnterpriseProvider("6Ld26S4qAAAAAHgvzC1HDjcFfXZfnROI4ZhDORfu"),
  isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
});

// get firestore
const firebase_firestore = getFirestore(firebase_app);


var cardata = [];
window.cardata = cardata;
var carList = [];
var keepList = [];
var unsubscribe_cardata;
var currentName;
var currentIndex;
window.currentIndex = currentIndex;



window.searchCardata= () => {
    window.progress_modal.show();
    setTimeout(function() {
        window.progress_modal.hide();
        const q = query(collection(firebase_firestore, "cardata"), orderBy("maker"), orderBy("name"));
        unsubscribe_cardata = onSnapshot(q, (querySnapshot) => {
            cardata = [];
            carList = [];
            querySnapshot.forEach((doc) => {
                cardata.push(doc.data());
            });
            carList.push(["メーカー","車名","グレード","外観","車両本体価格(税抜)","排気量(cc)","ミッション","乗車定員(人)","WLTCモード燃費(km/L)","衝突軽減ブレーキ","誤発進抑制装置(前方)","誤発進抑制装置(後方)","オートハイビーム","サイドエアバック&カーテンエアバック","コーナーセンサー（前方）","コーナーセンサー（後方）","車線逸脱防止","標識認識","追従機能","先行車発信告知","俯瞰映像（上から見た映像）","自動駐車機能","電動格納式ドアミラー","パワーウインドウ（前席）","パワーウインドウ（後席）","リヤワイパー","キーレスエントリー","プライバシーガラス（リヤ）","オーディオ","USBソケット","全長(mm)","全幅(mm)","全高(mm)","室内長(mm)","室内幅(mm)","室内高(mm)","備考","カタログPDF"]);
            var cols = 1;
            for(var i=0;i<cardata.length-1;i++) {
                if(currentName != cardata[i].name) {
                    currentName = cardata[i].name;
                    var cdata = [cardata[i].maker,
                        cardata[i].name + "<span style='color:blue' onclick='openCols(" + cols + ")'> >></span>",
                        "\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","\u0020","section"];
                    carList.push(cdata);
                    cols++;
                }

                //カタログリンク生成
                var catalogLink = "";
                if(cardata[i].catalogURL == undefined || cardata[i].catalogURL == "") {
                    catalogLink = "";
                } else {
                    for(var c=0; c<cardata[i].catalogURL.length; c++) {
                        var catalogName = cardata[i].catalogName[c];
                        if(c>0) {
                            catalogLink = catalogLink + "<br><a href='" + cardata[i].catalogURL[c] + "' target='_blank'>" + catalogName + "</a>";
                        } else {
                            catalogLink = "<a href='" + cardata[i].catalogURL[c] + "' target='_blank'>" + catalogName + "</a>";
                        }
                    }
                }

                var cdata = [
                    cardata[i].maker,
                    "<span style='color:blue' onclick='closeCols(" + cols + ")'><< </span>" + cardata[i].name,
                    "<span style='color:blue' onclick='openDetail("+i+")'>" + cardata[i].grade + "</span>",
                    "<img src=" + cardata[i].photo + " height=50px/>",
                    cardata[i].price,
                    cardata[i].cc,
                    cardata[i].mission,
                    cardata[i].seats,
                    cardata[i].WLTC,
                    cardata[i].AEBS,
                    cardata[i].PMP_F,
                    cardata[i].PMP_R,
                    cardata[i].AHS,
                    cardata[i].side_air_bag,
                    cardata[i].corner_sensor_f,
                    cardata[i].corner_sensor_r,
                    cardata[i].LDPS,
                    cardata[i].TSR,
                    cardata[i].ACC,
                    cardata[i].TMN,
                    cardata[i].AVM,
                    cardata[i].ACPS,
                    cardata[i].ERDM,
                    cardata[i].power_window_f,
                    cardata[i].power_window_r,
                    cardata[i].rear_wiper,
                    cardata[i].KLE,
                    cardata[i].privacy_glass,
                    cardata[i].audio,
                    cardata[i].USB,
                    cardata[i].length,
                    cardata[i].width,
                    cardata[i].height,
                    cardata[i].floor_length,
                    cardata[i].floor_width,
                    cardata[i].floor_height,
                    cardata[i].comment,
                    catalogLink,
                    "data"
                ];
                carList.push(cdata);
                cols++;
            }
            window.cardata = cardata;

            var html = "<table border=1>"
            html = html + "<tr><th class='cardatatitle' style='top:0;z-index:11'>　</th>";
            for(var k=1; k<carList.length; k++) {
                if(carList[k][38] == "section") {
                    html = html + "<th class='cardatakeep' id='keep" + k + "'></th>";
                } else {
                    html = html + "<th class='cardatakeep hidden-data' id='keep" + k + "'><input type='button' value='keep' style='color:red' onclick='keepdata("+k+")'/></th>";
                }
            }
            html = html + "</tr>";

            for(var j=0; j<38; j++) {
                var lockclass = "";
                if(j==0) {
                    lockclass = " lockmaker";
                } else if(j==1) {
                    lockclass = " lockname";
                }

                html = html + "<tr>";
                for(var k=0; k<carList.length; k++) {
                    var tag;
                    if(k==0) {

                if(j==0) {
                        tag = "<td class='cardatatitle_maker'>";
                } else if(j==1) {
                        tag = "<td class='cardatatitle_name'>";
                } else {
                        tag = "<td class='cardatatitle"+lockclass+"'>";
                }

                    } else if(carList[k][38] == "data") {
                        tag = "<td class='cardata hidden-data slideinLeft"+lockclass+"' id='x"+ k + "y" + j +"'>";
                    } else {
                        tag = "<td class='carsection"+lockclass+"' id='x"+ k + "y" + j +"'>";
                    }
                    html = html + tag + carList[k][j] + "</td>";
                }
                html = html + "</tr>";
            }
            html = html + "</table>";
            document.getElementById("carcontent").innerHTML = html;
            document.body.classList.toggle("show-nav");
            window.sendLog("info", "query caradata where=*", "searchCardata");
        });
    }, 1000);

}

window.keepdata= (k) => {
    for(var i=0; i<38; i++) {
        document.getElementById("x"+String(k)+"y"+String(i)).style.backgroundColor = "#9acd32";
    }
    keepList.push(Array.from(carList[k]));
    var tmpname = keepList[keepList.length-1][1];
    keepList[keepList.length-1][1] = tmpname.split("</span>")[1];
}

window.resetkeeplist= () => {
    keepList = [];
    keepList.push(["メーカー","車名","グレード","外観","車両本体価格(税抜)","排気量(cc)","ミッション","乗車定員(人)","WLTCモード燃費(km/L)","衝突軽減ブレーキ","誤発進抑制装置(前方)","誤発進抑制装置(後方)","オートハイビーム","サイドエアバック&カーテンエアバック","コーナーセンサー（前方）","コーナーセンサー（後方）","車線逸脱防止","標識認識","追従機能","先行車発信告知","俯瞰映像（上から見た映像）","自動駐車機能","電動格納式ドアミラー","パワーウインドウ（前席）","パワーウインドウ（後席）","リヤワイパー","キーレスエントリー","プライバシーガラス（リヤ）","オーディオ","USBソケット","全長(mm)","全幅(mm)","全高(mm)","室内長(mm)","室内幅(mm)","室内高(mm)","備考", "カタログPDF"]);
}

window.setKeepList = () => {
        var html = "<table border=1>"
        html = html + "<tr><th class='cardatatitle' style='top:0;z-index:11'>　</th>";
        for(var k=1; k<keepList.length; k++) {
               html = html + "<th class='cardatakeep'><input type='button' value='×' style='color:red' onclick='unkeepdata("+k+")'/></th>";
            }
            html = html + "</tr>";

            for(var j=0; j<38; j++) {
                var lockclass = "";
                if(j==0) {
                    lockclass = " lockmaker";
                } else if(j==1) {
                    lockclass = " lockname";
                }

                html = html + "<tr>";
                for(var k=0; k<keepList.length; k++) {
                   var tag;
                   if(k==0) {

                if(j==0) {
                        tag = "<td class='cardatatitle_maker'>";
                } else if(j==1) {
                        tag = "<td class='cardatatitle_name'>";
                } else {
                        tag = "<td class='cardatatitle"+lockclass+"'>";
                }

                   } else {
                       tag = "<td class='cardata"+lockclass+"' id='x"+ k + "y" + j +"'>";
                   }
                   html = html + tag + keepList[k][j] + "</td>";
                }
                html = html + "</tr>";
            }
            html = html + "</table>";
            document.getElementById("keepcontent").innerHTML = html;
}

window.unkeepdata= (k) => {
    keepList.splice(k,1);
    setKeepList();
}

window.openCols= (cols) => {
    // sectionを消す
    document.getElementById("keep"+String(cols)).classList.toggle("hidden-data");
    for(var j=0; j<38; j++) {
        document.getElementById("x"+String(cols)+"y"+String(j)).classList.toggle("hidden-data");
    }

    // 右側のdataを表示する
    for(var k=cols+1; k<carList.length; k++) {
        if(carList[k][38] == "section") {
            break;
        } else {
            document.getElementById("keep"+String(k)).classList.toggle("hidden-data");
            for(var j=0; j<38; j++) {
                document.getElementById("x"+String(k)+"y"+String(j)).classList.toggle("hidden-data");
            }
        }
    }    
}

window.closeCols= (cols) => {
    // 手前のsectionを見つける
    var sectioncols = 0;
    for(var k=cols; k>0; k--) {
        if(carList[k][38] == "section") {
            sectioncols = k;
            break;
        }
    }

    // sectionを表示する
    document.getElementById("keep"+String(sectioncols)).classList.toggle("hidden-data");
    for(var j=0; j<38; j++) {
        document.getElementById("x"+String(sectioncols)+"y"+String(j)).classList.toggle("hidden-data");
    }

    // ⇒右側のdataをclose
    for(var k=sectioncols+1; k<carList.length; k++) {
        if(carList[k][38] == "section") {
            break;
        } else {
            document.getElementById("keep"+String(k)).classList.toggle("hidden-data");
            for(var j=0; j<38; j++) {
                document.getElementById("x"+String(k)+"y"+String(j)).classList.toggle("hidden-data");
            }
        }
    }    
}

window.firebaseLogin= () => {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

        if(username.trim() == "" || password.trim() == "" || !username.includes("@") || !username.includes(".") ) {
            window.progress_modal.hide();
            ons.notification.alert("Username もしくは Passsword の形式が正しくありません。");
            return;
        }

        firebase_auth = getAuth(firebase_app);

        signInWithEmailAndPassword(firebase_auth, username, password)
            .then((userCredential) => {
                // Signed in
                userinfo = userCredential.user;
                window.fromlogin = true;
                resetkeeplist();
                window.progress_modal.hide();
//                ons.notification.alert("Login Successfull.<br>"+"welcome "+userinfo.email);
                window.sendLog("info", "user login.", "firebaseLogin");
                navi.pushPage("search.html",{animation:"lift"});
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                window.progress_modal.hide();
                ons.notification.alert("Username もしくは Passsword が間違っています。"+"<br>errorCode: "+errorCode+"<br>reason: "+errorMessage);
            });
}

window.openDetail = function(index) {
    window.currentIndex = index;
    navi.pushPage("detail.html", {animation:"lift"});
}

window.sendLog = function(severity, msg, position) {
    const putLog = httpsCallable(functions, "writeLog");
    const deviceinfo = {
        "screenWidth": window.screen.width,
        "screenHeight": window.screen.height,
        "lang": window.navigator.language,
        "userAgent": window.navigator.userAgent,
        "isMobile": window.navigator.userAgentData.mobile,
        "platform": window.navigator.userAgentData.platform,
        "browserName": window.navigator.userAgentData.brands,
    }
    const payload = {
        "userid": userinfo.email,
        "position": position,
        "url": location.href,
        "type": "application_log",
        "deviceinfo": deviceinfo,
    }
    putLog({
        "name": "application_log: " + msg + "("+userinfo.email+")",
        "severity": severity,
        "payload": payload
    })
}