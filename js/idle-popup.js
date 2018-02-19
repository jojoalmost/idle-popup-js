var idleTime = 0;
var timeOut = 1000 * 60;
var popStatus = false;
var bottom = false;
const scrollProcentage = 90;
const closedTimeOut = 3000;
var cookies = false;
var liveChatShow = false;


$(document).ready(function () {
    cookiesCheck();
});

function cookiesCheck() {
    if (document.cookie.indexOf("visited") >= 0) {
        console.dir('already visited');
        cookies = true;
    }
    else {
        console.dir('1st visit');
        dateValidation();
        cookies = false;
        sleepPopup();
    }
}

function dateValidation() {
    dateNow = new Date();
    document.cookie = "visited; date_created=" + dateNow;

}

function sleepPopup() {

    var idleInterval = setInterval(timerIncrement, timeOut);

    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).scroll(function () {
        idleTime = 0;
    })
    $(this).keypress(function (e) {
        idleTime = 0;
    });

    $(".sleepy-modal>img").click(function () {
        $(".sleepy-overlay").fadeOut('slow');
        idleTime = 0;

        $('.new-livechat-container').show();
    });

    $('.sleepy-modal').click(function (event) {
        event.stopPropagation();
    });

    scrollPopup();
}

function scrollPopup() {
    $(this).scroll(function () {
        var pageHeight = $(document).height();
        var scrollTop = $(window).scrollTop();
        var height = $(window).height();
        const pagePercentage = (pageHeight * scrollProcentage) / 100;
        console.log(scrollTop + height,pagePercentage);
        if (scrollTop + height == pageHeight) {
            bottom = true;
            console.log('bottom');
        }
        if (bottom && pagePercentage >= scrollTop+height && !popStatus) {
            popStatus = true;
            console.log('show');
            $(".sleepy-overlay").fadeIn('slow');
        }

    });
}

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 1 && !popStatus) {
        $('.sleepy-overlay').fadeIn('slow');
        idleTime = 0;
        popStatus = true;
    }
}
