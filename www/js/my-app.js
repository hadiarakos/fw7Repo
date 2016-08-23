// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


var isLogin;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");

});

var redirectToHomeifCookieIsdDeleted = function () {
    if (Cookies.get('status') == 200) {
        mainView.router.load({
            url: "index.html"
        })
    }
}

var checkConn = function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    myApp.notification('Connection type: ' + states[networkState]);
};

var crosscoverInit = function () {

    // http://git.blivesta.com/crosscover//
    $(".crosscover").crosscover({
        inClass: 'zoomInLeft',
        outClass: 'zoomOutLeft',
        interval: 5000,
        startIndex: 0,
        autoPlay: true,
        dotsNav: false,
        controller: false,
        controllerClass: 'crosscover-controller',
        prevClass: 'crosscover-prev',
        nextClass: 'crosscover-next',
        playerClass: 'crosscover-player',
        playerInnerHtml: '<span class="crosscover-icon-player"></span>',
        prevInnerHtml: '<span class="crosscover-icon-prev"></span>',
        nextInnerHtml: '<span class="crosscover-icon-next"></span>'
    });

};

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):

//Now we add our callback for initial page -> index.php ->home page tag
myApp.onPageInit('index', function (page) {
    console.log("Home page is loaded");
    //checkConn();

    crosscoverInit();

    isLogin = Cookies.get('status') == 200;

    console.log("Login status: " + isLogin);

    redirectToHomeifCookieIsdDeleted();

    // http://git.blivesta.com/crosscover//
    //crosscoverInit();

}).trigger(); //And trigger it right aw

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    var getRequest = page.query;


    /*
     *  todo: LOGIN PAGE
     * */

    if (page.name == 'login') {
        //$$(".navbar").hide();

        var username_input = $('#username');
        var password_input = $('#password');
        var submit = $('.submit');

        var login = function () {
            //myApp.hideNavbar(".navbar");


            submit.click(function () {

                var username_value = username_input.val();
                var password_value = password_input.val();


                if (username_value == '' && password_value == '') {
                    myApp.alert("Please provide your account credentials", "MindTV");


                } else {
                    if (username_value == '') {
                        myApp.alert("Please provide username", "MindTV");

                    } else if (password_value == '') {
                        myApp.alert("Password cannot be empy", "MindTV");

                    } else {

                        loginService.jsonResponse(username_value, password_value);


                        // validate userfiled inputs.
                    }
                }
            });
        };
        login();
    }

    /*
     *  todo: DASHBOARD PAGE
     * */

    if (page.name == 'dashboard') {
        console.log("dashboard");
        myApp.closePanel();

        redirectToHomeifCookieIsdDeleted();

        var owl = $("#owl-demo");

        owl.owlCarousel({
            items: 10, //10 items above 1000px browser width
            itemsDesktop: [1000, 5], //5 items between 1000px and 901px
            itemsDesktopSmall: [900, 3], // betweem 900px and 601px
            itemsTablet: [600, 2], //2 items between 600 and 0
            autoPlay: 5000,
            itemsMobile: [400, 3] // itemsMobile disabled - inherit from itemsTablet option
        });


        // logout...
        $('.logout').click(function () {
            console.log("Lohout clicked");
            Cookies.remove('username');
            Cookies.remove('email');
            Cookies.remove('status');

            mainView.router.loadPage({
                url: "#dashboard"
            })


        });

    }

    /*
     *  todo: CONTACTS PAGE
     * */

    if (page.name == 'contacts') {
        myApp.closePanel();
        console.log(page.name + " page is loaded.");

        redirectToHomeifCookieIsdDeleted();

        $$.getJSON('http://edate.mindtv.eu/libs/includes/api/android/android_contacts.php?user_id=688', function (data, success) {
            if (success == 200) {
                console.log("success json response");

                console.log("Type of: " + typeof(data));


                var numberOfElements = data.length;
                console.log("Number:" + numberOfElements);

                for (var i = 0; i < numberOfElements; i++) {
                    var customer_id = data[i].id;

                    var li_element = '<li class="swipeout"><a href="contact_details.html?id=' + customer_id + '" class="item-link"><div class="swipeout-content item-content"><div class="item-inner">' + data[i].fullname + '</div></div></a><div class="swipeout-actions-right"><a href="#" class="delete_customer_' + customer_id + ' bg-red">Delete</a></div></li>';
                    $$('.contacts').append(li_element);
                    //$$('.contacts').append('<li class="swipeout"><a href="contact_details.html?id='+data[i].id+'" class="item-link"><div class="item-content"><div class="item-inner"><div class="item-title">'+data[i].fullname+'</div></div></div></a></li>');


                    $$('.delete_customer_' + customer_id).on('click', function () {
                        var className = $$(this).attr('class');

                        var split = className.split("_");
                        var explode_spaces = split[2].split(" ");
                        var getCustomerId = explode_spaces[0];
                        myApp.alert('Delete customer with id ' + getCustomerId);
                    });


                }

            }
        });


    }

    /*
     *  todo: CHANNELS PAGE
     * */

    if (page.name == 'channels') {
        myApp.closePanel();

        redirectToHomeifCookieIsdDeleted();

        console.log(page.name + " page is loaded.");
        myApp.showPreloader('Fetching channels');


        $$.getJSON('http://cloudware.air5iptv.com/categories_channels.php?username=demo&password=c514c91e4ed341f263e458d44b3bb0a7', function (data, success) {
            if (success == 200) {
                myApp.hidePreloader();
                console.log("success json response");

                var categories_tag = data.response.tv_categories.tv_category;
                var channels_tag = data.response.tv_channel;

                var count_channels = channels_tag.length;
                var count_categories = categories_tag.length;

                for (var j = 0; j < count_channels; j++) {

                    var channel_object = {
                        id: channels_tag[j].id,
                        position: channels_tag[j].number,
                        caption: channels_tag[j].caption,
                        icon_url: channels_tag[j].icon_url,
                        streaming_url: channels_tag[j].streaming_url
                    };

                    var id = channel_object.id;
                    var caption = channel_object.caption;
                    var streaming_url = channel_object.streaming_url;
                    var icon_url = channel_object.icon_url;

                    var li_element = '<li class="swipeout"><a href="channel_details.html?id=' + id + '&vurl=' + streaming_url + '" class="item-link"><div class="swipeout-content item-content"><div class="item-inner">' + caption + '</div></div></a><div class="swipeout-actions-right"><a href="#" class="delete_channel_' + id + ' bg-red">Delete</a></div></li>';
                    $$('.channels').append(li_element);
                    //$$('.contacts').append('<li class="swipeout"><a href="contact_details.html?id='+data[i].id+'" class="item-link"><div class="item-content"><div class="item-inner"><div class="item-title">'+data[i].fullname+'</div></div></div></a></li>');


                    $$('.delete_channel' + id).on('click', function () {
                        var className = $$(this).attr('class');

                        var split = className.split("_");
                        var explode_spaces = split[2].split(" ");
                        var getId = explode_spaces[0];
                        myApp.alert('Delete channel with id ' + getId);
                    });


                }

            }
        });

        // initialize search function
        var mySearchbar = myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-inner'
        });

    }

    /*
     *  todo: CHANNEL DETAILS PAGE
     * */

    if (page.name == 'channel_details') {
        myApp.closePanel();
        redirectToHomeifCookieIsdDeleted();

        // Play a video with callbacks
        var channel_id = getRequest.id;
        var vurl = getRequest.vurl;

        var conf = {
            key: "07add0cd-89b5-475c-ba1a-8206ff10001f",
            playback: {
                autoplay: true,
                muted: false
            },
            source: {
                hls: vurl
            },
            style: {
                width: '100%',
                aspectratio: '16:9',
                controls: true
            },
            cast: {
                enable: true
            }

        };

        var player = bitdash("player");
        player.destroy();


        player = bitdash("player");
        player.setup(conf).then(function (value) {
            // Success
            console.log("Successfully created bitdash player instance");
        }, function (reason) {
            // Error!
            console.log("Error while creating bitdash player instance");
        });


        player.play();


        // window.plugins.streamingMedia.playVideo(videoUrl, options);


    }

    /*
     *  todo: CONTACTS DETAILS PAGE
     * */

    if (page.name == 'contact_details') {
        myApp.closePanel();

        redirectToHomeifCookieIsdDeleted();
        var contact_id = getRequest.id;
        console.log("Contact id: " + contact_id);
    }

    /*
     *  todo:  CHANNELS LIST NATIVE PLAYER PAGE
     * */

    if (page.name == 'channels-list-native-player') {

        myApp.closePanel();

        redirectToHomeifCookieIsdDeleted();

        myApp.showPreloader('Fetching channels');

        $$.getJSON('http://cloudware.air5iptv.com/categories_channels.php?username=demo&password=c514c91e4ed341f263e458d44b3bb0a7', function (data, success) {
            if (success == 200) {
                myApp.hidePreloader();
                console.log("success json response");

                var channels_tag_native = data.response.tv_channel;

                var count_channels_native = channels_tag_native.length;

                console.log("count_channels_native: " + count_channels_native);

                for (var i = 0; i < count_channels_native; i++) {

                    var jsonObj = {
                        id: channels_tag_native[i].id,
                        position: channels_tag_native[i].number,
                        caption: channels_tag_native[i].caption,
                        icon_url: channels_tag_native[i].icon_url,
                        streaming_url: channels_tag_native[i].streaming_url
                    };

                    var streaming = jsonObj.streaming_url;

                    var li_element = '<li class="swipeout"><div class="swipeout-content item-content"><div class="item-inner clickable" data-streaming-url="' + streaming + '">' + jsonObj.caption + '</div></div><div class="swipeout-actions-right"><a href="#" class="delete_channel_' + jsonObj.id + ' bg-red">Delete</a></div></li>';
                    $('.native_player_ul').append(li_element);


                }
                $('.clickable').on('click', function (e) {

                    var videoUrl = $$(this).data('streaming-url');

                    // Play a video with callbacks
                    var options = {
                        successCallback: function () {
                            console.log("Video was closed without error.");
                        },
                        errorCallback: function (errMsg) {
                            console.log("Error! " + errMsg);
                        },
                        orientation: 'landscape'
                    };

                    myApp.addNotification({
                        title: 'Channel',
                        message: videoUrl
                    });
                    window.plugins.streamingMedia.playVideo(videoUrl, options);


                });

            }


        });


        // initialize search function
        myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-inner'
        });

    }

    /*
     *  todo: ABOUT PAGE
     * */

    if (page.name === 'about') {
        myApp.closePanel();
        redirectToHomeifCookieIsdDeleted();
        console.log("about page is loaded.");

        // Following code will be executed for page with data-page attribute equal to "about"
        //myApp.alert('Here comes About page');
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
})