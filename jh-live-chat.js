/**
 * Created by jojo on 15-Feb-18.
 */

var master_id = "593e6065a350112cd51af095", site_id = "282", $ = jQuery, request = {},
    messageText = ["Mungkinkah tutorial ini yang kamu butuhkan :", "Atau tutorial yang ini sob :", "Sepertinya tutorial ini yang kamu butuhkan :"],
    messageFail = ["Maaf pencarian tidak ditemukan :(<br>agar aku dapat memberikan solusi yang tepat, langsung tuliskan bantuan yang kamu butuhkan disini"],
    messageFind = "<b>Cari : </b>", sessionID = "";
request.ajaxRequest = function (t, e) {
    var a = $.ajax(t);
    a.done(function (t) {
        e(1, t)
    }), a.fail(function (t, a) {
        e(0, a)
    })
}, request.get = function (t, e) {
    var a = {url: t, method: "GET", dataType: "json"};
    request.ajaxRequest(a, e)
}, request.post = function (t, e, a) {
    var i = {url: t, method: "POST", data: e, dataType: "json", timeout: 6e4};
    request.ajaxRequest(i, a)
};
var KB = {};
KB.timestamp = function () {
    return Math.floor(Date.now())
}, KB.makeid = function () {
    for (var t = "", e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", a = 0; a < 5; a++)t += e.charAt(Math.floor(Math.random() * e.length));
    return t
}, KB.search = function (t, e) {
    request.post("https://tutorial.jagoanhosting.com/wp-json/revokb/search?kid=" + KB.makeid() + "&time=" + KB.timestamp(), t, e)
}, KB.fetchPopular = function (t, e) {
    request.post("https://tutorial.jagoanhosting.com/wp-json/revokb/fetch-popular?kid=" + KB.makeid() + "&time=" + KB.timestamp(), t, e)
}, KB.fetchRecent = function (t, e) {
    request.post("https://tutorial.jagoanhosting.com/wp-json/revokb/fetch-recent", t, e)
}, KB.updateKeyword = function (t, e) {
    request.post("https://tutorial.jagoanhosting.com/wp-json/revokb/update-keyword?kid=" + KB.makeid() + "&time=" + KB.timestamp(), t, e)
};
var Page = {};
Page.fetchPopular = function (t) {
    KB.fetchPopular({limit: 5, master_id: master_id, site_id: site_id, sessionID: sessionID}, function (e, a) {
        if (a.status = a.data.length > 0) {
            var i = t.find("#support-box .message-box"), s = messageText[0];
            i.append('<div class="message clearfix"><div class="message-body pull-left"><p><b>' + s + '</b></p><ul class="item-list"></ul></div></div>');
            var n = i.find(".item-list").last();
            a.data.forEach(function (t, e) {
                t.url && (t.url = t.url.replace("tutorial.jagoanhosting.com", "www.jagoanhosting.com/tutorial"), n.append("<li class='item'><a target='_blank' href='https://" + t.url + "/?utm_source=lp-jagoanhosting&utm_medium=search-kb-livechat&utm_campaign=tutorial-kb-jagoanhosting'><i class='fa fa-file-o'></i>" + t.title + "</a></li>"))
            })
        }
    })
}, Page.fetchRecent = function (t) {
    KB.fetchRecent({limit: 5, master_id: master_id, site_id: site_id, sessionID: sessionID}, function (e, a) {
        if (a.status = a.data.length > 0) {
            var i = t.find("#support-box .recent-box");
            i.empty().append("<ul class='item-list'></ul>"), a.data.forEach(function (t, e) {
                t.url && (t.url = t.url.replace("tutorial.jagoanhosting.com", "www.jagoanhosting.com/tutorial"), i.find("ul").append("<li><a target='_blank' href='https://" + t.url + "'>" + t.title + "</a></li>"))
            })
        }
    })
}, Page.triggerOpenChat = function () {
    $(".new-livechat-container").removeClass("on"), document.getElementById("chatText").innerHTML = "Silakan Tunggu...";
    var t = document.createElement("script");
    t.src = "https://jagoanhosting.com/wp-content/plugins/beon/js_load_livechat.js", document.body.appendChild(t);
    var e = setInterval(function () {
        try {
            console.log("open chat"), parent.LC_API.open_chat_window(), clearTimeout(e)
        } catch (t) {
            console.log("open chat error")
        }
    }, 1e3), a = setInterval(function () {
        clearTimeout(a), $(".new-livechat-container").hide()
    }, 2e3);
    Analytic.sendEvent("C", "klik informasi product/livechat")
};
var Analytic = {
    getClientID: function (t) {
        "function" == typeof ga ? ga(function (e) {
            var a = e.get("clientId");
            t(a)
        }) : t("")
    }, sendEvent: function (t, e) {
        $.ajax({
            type: "POST",
            url: "https://member.jagoanhosting.com/kb-reporting/live_chat_kb.php",
            data: {session: sessionID, action: t, description: e}
        }).done(function (t) {
        })
    }
};
$(function () {
    var t = $(".new-livechat-container"), z = t.find("#support-box .message-box"), e = t.find("#form-custom-search");
    t.find(".head").on("click", function () {
        t.toggleClass("on"), t.find(".btn-head").toggle(), t.hasClass("on") && Analytic.sendEvent("A", "buka popup")
    }), e.on("submit", function (a) {
        a.preventDefault();
        var i = t.find("#support-box .message-box"), s = messageText[0], n = $(this).find('input[name="search"]'),
            o = n.val().replace(/[^a-zA-Z0-9] /g, "");
        if (!o.replace(/[^a-zA-Z0-9]/g, ""))return !1;
        i.append('<div class="message find clearfix"><div class="message-body pull-right">' + messageFind + n.val() + "</div></div>");
        var l = {search: o, master_id: master_id, site_id: site_id, sessionID: sessionID};
        n.val("").attr("disabled", "disabled"), e.find(".btn-submit").empty().append('<i class="fa fa-spinner fa-spin"></i>'), i.append('<div class="message type clearfix"><div class="message-body pull-left"><i>Andro is typing...</i></div></div>'), i.scrollTop(function () {
            return this.scrollHeight
        }), KB.search(l, function (t, a) {
            if (i.find(".message.type").remove(), 1 == a.status && a.data.length > 0) {
                i.append('<div class="message clearfix"><div class="message-body pull-left"><p><b>' + s + '</b></p><ul class="item-list"></ul></div></div>');
                var l = 0, r = "", c = i.find(".item-list").last();
                a.data.forEach(function (t, e) {
                    l >= 5 && (r = "hide"), t.url = t.url.replace("tutorial.jagoanhosting.com", "www.jagoanhosting.com/tutorial"), c.append("<li class='item " + r + "'><a target='_blank' class='tutorial' data-id='" + t.post_id + "' data-keyword='" + o + "' href='https://" + t.url + "/?utm_source=lp-jagoanhosting&utm_medium=search-kb-livechat&utm_campaign=tutorial-kb-jagoanhosting'><i class='fa fa-file-o'></i>" + t.title + "</a></li>"), l++
                }), l > 5 && c.append('<div class="readmore"><hr/><span><b>Mau tutorial lainnya? </b><a href="javascript:void(0);" class="btn btn-xs btn-default btn-beon-blue">Ya</a></span></div>')
            } else s = messageFail[Math.floor(Math.random() * messageFail.length)], i.append('<div class="message failed clearfix"><div class="message-body pull-left">' + s + "</div></div>"), Analytic.sendEvent("K", o);
            e.find(".btn-submit").empty().append('<i class="fa fa-search"></i>'), z.stop().animate({scrollTop: z[0].scrollHeight}, 800), n.removeAttr("disabled").focus()
        }), Analytic.sendEvent("D", "klik cari"), Analytic.sendEvent("J", o)
    }), t.on("click", ".choose-support", function () {
        $("#welcome-box").toggleClass("active"), $("#support-box").toggleClass("active"), Analytic.sendEvent("B", "klik layanan support")
    }), t.on("click", ".back-to-menu", function () {
        $("#welcome-box").toggleClass("active"), $("#support-box").toggleClass("active"), Analytic.sendEvent("I", "klik back")
    }), t.on("click", ".scroll-bottom", function () {
        var e = t.find("#support-box .message-box");
        e.stop().animate({scrollTop: e[0].scrollHeight}, 800)
    }), t.find("#support-box .message-box").bind("scroll", function (e) {
        var a = $(e.currentTarget);
        a[0].scrollHeight - a.scrollTop() == a.outerHeight() ? t.find("#support-box").find(".scroll-bottom").hasClass("disable") || t.find("#support-box").find(".scroll-bottom").addClass("disable") : t.find("#support-box").find(".scroll-bottom").removeClass("disable")
    }), t.on("click", ".readmore a", function () {
        var e = t.find("#support-box .message-box");
        e.append('<div class="message find clearfix"><div class="message-body pull-right">Ya</div></div>');
        var a = $(this).closest(".message").clone(), i = 0;
        a.find(".item").each(function (t, e) {
            if (i >= 5)return !1;
            a.find(".item").first().remove(), i++
        }), i = 0, a.find(".hide").each(function (t, e) {
            if (i >= 5)return !1;
            a.find(".hide").first().removeClass("hide"), i++
        }), i < 5 && a.find(".readmore").remove(), e.append(a), $(this).closest(".readmore").remove(), Analytic.sendEvent("E", "klik ya / read more")
    }), t.on("click", ".tutorial", function (t) {
        var e = {
            kb_id: $(this).data("id"),
            keyword: $(this).data("keyword"),
            master_id: master_id,
            site_id: site_id,
            sessionID: sessionID
        };
        $.ajax({
            type: "POST",
            url: "https://tutorial.jagoanhosting.com/wp-json/revokb/update-keyword?kid=" + KB.makeid() + "&time=" + KB.timestamp(),
            data: e
        }).done(function (t) {
        }), Analytic.sendEvent("F", "klik tutorial tertentu " + $(this).data("id") + " - " + $(this).data("keyword"))
    }), Analytic.getClientID(function (e) {
        sessionID = e, Page.fetchPopular(t)
    })
});
