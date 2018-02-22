var idleTime = 0;
var timeOut = 1000 * 60; // in second
var popStatus = false;
var bottom = false;
var submit = false;
const scrollProcentage = 90; //showing pop up procentage
const closedTimeOut = 1000 * 30;
const closedHour = 17; //24 hour format
const openHour = 8;

$(document).ready(function () {
    cookiesCheck();
    $("#exit-popup, #step-2").click(function () {
        if (!submit) {
            setCookie('visit', 'visited', 1);
            console.log('exit without submit expired 1 day');
        }
        $(".sleepy-overlay").fadeOut('slow');
        $(".sleepy-overlay").remove();
        $('.new-livechat-container').show();
    })

});

function cookiesCheck() {
    if (getCookie('visit') !== "") {
        console.dir('already visited');
    }
    else {
        console.dir('1st visit');
        dateValidation();
        sleepPopup();
    }
}

function dateValidation() {
    const now = new Date();
    setCookie('visit', 'visited', 5);
    console.log('visited expired 5 day');
    if (now.getHours() >= closedHour || now.getHours() <= openHour) {
        timeOut = closedTimeOut;
    }
}


function sleepPopup() {
    console.log(timeOut);
    var idleInterval = setInterval(timerIncrement, timeOut);

    /* $(this).mousemove(function (e) {
     idleTime = 0;
     });

     $(this).scroll(function () {
     idleTime = 0;
     });

     $(this).keypress(function (e) {
     idleTime = 0;
     });*/

    $('#pop-submit').click(function () {
        var data = [];
        data = $(this).closest('form').serializeArray();
        data.push({name: 'action', value: 'pop_up'});
        $.ajax({
            type: 'POST',
            url: 'https://activecampaign.beon.co.id/livechat/v1/',
            data: data,
            success: function (res) {
                console.dir(res);
                if (res.status === 0) {
                    var messages = $.map(res.message, function (v) {
                        return v;
                    }).join(', ');

                    $("#popup-email").tooltip({
                        animation: "fade",
                        delay: "200",
                        trigger: "manual",
                        placement: "top",
                        title: messages
                    });
                    $("#popup-email").tooltip('show');
                } else {
                    setCookie('visit', 'visited', 10);
                    // console.log('form submit expired 10 day');
                    $('#step-1').hide();
                    $('#step-1').remove();
                    $('#pop-up-2').show();
                    submit = true;
                    idleTime = 0
                }
            }
        })
    })


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
        if (scrollTop + height == pageHeight) {
            bottom = true;
            console.log('bottom');
        }
        if (bottom && pagePercentage >= scrollTop + height && !popStatus) {
            popStatus = true;
            console.log('show');
            $(".sleepy-overlay").fadeIn('slow');
            $('.new-livechat-container').hide();
        }

    });
}

function timerIncrement() {
    // idleTime = idleTime + 1;
    // console.log('idleFlag ' + idleTime);
    // if (idleTime > 1 && !popStatus) {
    $('.sleepy-overlay').fadeIn('slow');
    $('.new-livechat-container').hide();
    idleTime = 0;
    popStatus = true;
    // }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}