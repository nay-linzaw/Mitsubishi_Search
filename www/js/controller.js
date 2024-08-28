// controller.js
// This is a JavaScript file


// コントローラセクション
ons.bootstrap()
  .controller("AppController", function($scope) {

    // メニューページの ログイン ボタン押下時
    $scope.login = function() {
        progress_modal.show();
        firebaseLogin();

    }

    // メニューページ起動時
    $scope.loginInit = function() {
        // 処理中ページ取得しておく
        progress_modal = document.getElementById("progress.html");
    }

    $scope.searchInit = function() {
        if(fromlogin) {
            document.body.classList.toggle("show-nav");
            fromlogin = false;
        }
    }

    $scope.openMenu = function() {
        document.body.classList.toggle("show-nav");
    }

    $scope.changeKeepview = function() {
        navi.pushPage("keep.html");
    }

    $scope.changeSearchview = function() {
        navi.popPage();
    }

    $scope.keepInit = function() {
        setKeepList();
    }

    $scope.detailInit = function() {
        $scope.detail = cardata[window.currentIndex];
    }

    $scope.logOut = function() {
        window.sendLog("info", "user logout.", "$scope.logout");
        navi.popPage();
    }


  });

