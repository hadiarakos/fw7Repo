//global settings

var BASE_URL = "http://auragui.middleware.tv";

var myAccount = {
    "customer_id": null,
    "client_ip": null,
    "status": null,
    "block_tvod": null,
    "block_ppv": null,
    "languages_label": null,
    "languages_code": null,
    "user_name": null,
    "user_email": null,
    "user_mobile": null,
    "user_start_date": "",
    "user_end_date": "",
    "message": "",
    "company_icon": "",
    "lat": "",
    "long": "",
    "stb_version": "",
    "need_update": "",
    "customer_message": "",
    "stb_bg_image": "",
    "tvod_image": "",
    "livetv_image": "",
    "svod_image": "",

};


var loginService = {


    /*
     *   todo: accountCookies (Set login cookies to the app)
     * */
    accountCookies: function (account) {
        console.log("Cookies are sets");
        Cookies.set('status', account.status);
        Cookies.set('username', account.user_name);
        Cookies.set('email', account.email);
    },

    getMacAddress: function () {
        window.MacAddress.getMacAddress(
            function (macAddress) {
                alert(macAddress);
            }, function (fail) {
                alert(fail);
            }
        );
    },


/*
 * todo: Login mechanism
 * */
jsonResponse: function (username, password) {

    var loginUrl = BASE_URL + "/connect_device.php?username=" + username + "&password=" + $.md5(password);

    myApp.showPreloader('Checking ...');
    $$.getJSON(loginUrl, function (data, success) {
        if (success == 200) {
            myApp.hidePreloader();
            console.log("success json response");

            var account = data.response.account;

            if (account.status == 200) {
                myAccount.status = account.status;
                //myApp.alert(account.message, "Login error");
                isLogin = true;
                loginService.accountCookies(account);
                console.log("status: " + myAccount.status);

                mainView.router.load({
                    url: "dashboard.html"
                })
            } else {
                myApp.alert(account.message, "Login error");
            }

        } else {
            myApp.hidePreloader();

            myApp.addNotification({
                title: 'Login',
                message: "Cannot access middleware server"
            });
        }
    });
}

}
;
