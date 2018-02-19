var idleTime = 0;
var timeOut = 1000;
var popStatus = false;
var bottom = false;
const scrollProcentage = 70;

const closedTimeOut = 3000;

$(document).ready(function () {
    $('.new-livechat-container').hide();
    // window.onbeforeunload = function(){
    //     return "Do you want leave this site?";
    // }

    if (document.cookie.indexOf("visited") >= 0) {
        console.dir('already visited');
    }
    else {
        dateNow = new Date();
        document.cookie = "visited; date_created=" + dateNow;
        console.dir('1st visit');

        var hoursNow = dateNow.getHours();
        var hoursMins = dateNow.getMinutes();


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

        $(".sleepy-modal>img , .container ").click(function () {
            $(".sleepy-overlay").fadeOut('slow');
            idleTime = 0;
        });

        $('.sleepy-modal').click(function (event) {
            event.stopPropagation();
        });

        $(this).scroll(function () {
            var pageHeight = $(document).height();
            var scrollTop = $(window).scrollTop();
            var height = $(window).height();
            const pagePercentage = Math.round((($(document).height() * scrollProcentage) / 100));

            // console.log('page height = ' + pageHeight);
            // console.log('scroll top = ' + scrollTop);
            // console.log('window height = ' + height);
            // console.log('persen = ' + pagePercentage);

            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                bottom = true;
                console.log('bottom');
            }

            if (bottom && pagePercentage >= scrollTop && !popStatus) {
                popStatus = true;
                console.log('show');
                $(".sleepy-overlay").fadeIn('slow');
            }

        });
    }
});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 1 && !popStatus) {
        $('.sleepy-overlay').fadeIn('slow');
        idleTime = 0;
        popStatus = true;
    }
}
