/*! Swipebox v1.4.4 | Constantin Saguin csag.co | MIT License | github.com/brutaldesign/swipebox */
!(function (e, t, i, s) {
    (i.swipebox = function (o, n) {
        var a,
            r,
            l = {
                useCSS: !0,
                useSVG: !0,
                initialIndexOnArray: 0,
                removeBarsOnMobile: !0,
                hideCloseButtonOnMobile: !1,
                hideBarsDelay: 3e3,
                videoMaxWidth: 1140,
                vimeoColor: "cccccc",
                beforeOpen: null,
                afterOpen: null,
                afterClose: null,
                afterMedia: null,
                nextSlide: null,
                prevSlide: null,
                loopAtEnd: !1,
                autoplayVideos: !1,
                queryStringData: {},
                toggleClassOnLoad: "",
                selector: null,
            },
            d = this,
            p = [],
            c = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i),
            b = null !== c || t.createTouch !== s || "ontouchstart" in e || "onmsgesturechange" in e || navigator.msMaxTouchPoints,
            u = !!t.createElementNS && !!t.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
            h = e.innerWidth ? e.innerWidth : i(e).width(),
            g = e.innerHeight ? e.innerHeight : i(e).height(),
            f = 0;
        (d.settings = {}),
            (i.swipebox.close = function () {
                a.closeSlide();
            }),
            (i.swipebox.extend = function () {
                return a;
            }),
            (d.init = function () {
                (d.settings = i.extend({}, l, n)),
                    i.isArray(o)
                        ? ((p = o), (a.target = i(e)), a.init(d.settings.initialIndexOnArray))
                        : i(o).on("click", d.settings.selector, function (e) {
                              if ("slide current" === e.target.parentNode.className) return !1;
                              var t, s, n;
                              a.destroy(),
                                  (r = null === d.settings.selector ? i(o) : i(o).find(d.settings.selector)),
                                  (p = []),
                                  n || ((s = "data-rel"), (n = i(this).attr(s))),
                                  n || ((s = "rel"), (n = i(this).attr(s))),
                                  n && "" !== n && "nofollow" !== n && (r = r.filter("[" + s + '="' + n + '"]')),
                                  r.each(function () {
                                      var e = null,
                                          t = null;
                                      i(this).attr("title") && (e = i(this).attr("title")), i(this).attr("href") && (t = i(this).attr("href")), p.push({ href: t, title: e });
                                  }),
                                  (t = r.index(i(this))),
                                  e.preventDefault(),
                                  e.stopPropagation(),
                                  (a.target = i(e.target)),
                                  a.init(t);
                          });
            }),
            (a = {
                init: function (e) {
                    d.settings.beforeOpen && d.settings.beforeOpen(),
                        this.target.trigger("swipebox-start"),
                        (i.swipebox.isOpen = !0),
                        this.build(),
                        this.openSlide(e),
                        this.openMedia(e),
                        this.preloadMedia(e + 1),
                        this.preloadMedia(e - 1),
                        d.settings.afterOpen && d.settings.afterOpen(e);
                },
                build: function () {
                    var e,
                        t = this;
                    i("body").append(
                        '<div id="swipebox-overlay">\t\t\t\t\t<div id="swipebox-container">\t\t\t\t\t\t<div id="swipebox-slider"></div>\t\t\t\t\t\t<div id="swipebox-top-bar">\t\t\t\t\t\t\t<div id="swipebox-title"></div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div id="swipebox-bottom-bar">\t\t\t\t\t\t\t<div id="swipebox-arrows">\t\t\t\t\t\t\t\t<a id="swipebox-prev"></a>\t\t\t\t\t\t\t\t<a id="swipebox-next"></a>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<a id="swipebox-close"></a>\t\t\t\t\t</div>\t\t\t</div>'
                    ),
                        u && !0 === d.settings.useSVG && ((e = (e = i("#swipebox-close").css("background-image")).replace("png", "svg")), i("#swipebox-prev, #swipebox-next, #swipebox-close").css({ "background-image": e })),
                        c && d.settings.removeBarsOnMobile && i("#swipebox-bottom-bar, #swipebox-top-bar").remove(),
                        i.each(p, function () {
                            i("#swipebox-slider").append('<div class="slide"></div>');
                        }),
                        t.setDim(),
                        t.actions(),
                        b && t.gesture(),
                        t.keyboard(),
                        t.animBars(),
                        t.resize();
                },
                setDim: function () {
                    var t, s, o;
                    "onorientationchange" in e
                        ? e.addEventListener(
                              "orientationchange",
                              function () {
                                  0 === e.orientation ? ((t = h), (s = g)) : (90 !== e.orientation && -90 !== e.orientation) || ((t = g), (s = h));
                              },
                              !1
                          )
                        : ((t = e.innerWidth ? e.innerWidth : i(e).width()), (s = e.innerHeight ? e.innerHeight : i(e).height())),
                        (o = { width: t, height: s }),
                        i("#swipebox-overlay").css(o);
                },
                resize: function () {
                    var t = this;
                    i(e)
                        .resize(function () {
                            t.setDim();
                        })
                        .resize();
                },
                supportTransition: function () {
                    var e,
                        i = "transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");
                    for (e = 0; e < i.length; e++) if (t.createElement("div").style[i[e]] !== s) return i[e];
                    return !1;
                },
                doCssTrans: function () {
                    if (d.settings.useCSS && this.supportTransition()) return !0;
                },
                gesture: function () {
                    var e,
                        t,
                        s,
                        o,
                        n,
                        a,
                        r = this,
                        l = !1,
                        d = !1,
                        c = {},
                        b = {},
                        u = i("#swipebox-top-bar, #swipebox-bottom-bar"),
                        g = i("#swipebox-slider");
                    u.addClass("visible-bars"),
                        r.setTimeout(),
                        i("body")
                            .bind("touchstart", function (r) {
                                return (
                                    i(this).addClass("touching"),
                                    (e = i("#swipebox-slider .slide").index(i("#swipebox-slider .slide.current"))),
                                    (b = r.originalEvent.targetTouches[0]),
                                    (c.pageX = r.originalEvent.targetTouches[0].pageX),
                                    (c.pageY = r.originalEvent.targetTouches[0].pageY),
                                    i("#swipebox-slider").css({ "-webkit-transform": "translate3d(" + f + "%, 0, 0)", transform: "translate3d(" + f + "%, 0, 0)" }),
                                    i(".touching").bind("touchmove", function (r) {
                                        if ((r.preventDefault(), r.stopPropagation(), (b = r.originalEvent.targetTouches[0]), !d && ((n = s), (s = b.pageY - c.pageY), Math.abs(s) >= 50 || l))) {
                                            var u = 0.75 - Math.abs(s) / g.height();
                                            g.css({ top: s + "px" }), g.css({ opacity: u }), (l = !0);
                                        }
                                        (o = t),
                                            (t = b.pageX - c.pageX),
                                            (a = (100 * t) / h),
                                            !d && !l && Math.abs(t) >= 10 && (i("#swipebox-slider").css({ "-webkit-transition": "", transition: "" }), (d = !0)),
                                            d &&
                                                (0 < t
                                                    ? 0 === e
                                                        ? i("#swipebox-overlay").addClass("leftSpringTouch")
                                                        : (i("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),
                                                          i("#swipebox-slider").css({ "-webkit-transform": "translate3d(" + (f + a) + "%, 0, 0)", transform: "translate3d(" + (f + a) + "%, 0, 0)" }))
                                                    : 0 > t &&
                                                      (p.length === e + 1
                                                          ? i("#swipebox-overlay").addClass("rightSpringTouch")
                                                          : (i("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),
                                                            i("#swipebox-slider").css({ "-webkit-transform": "translate3d(" + (f + a) + "%, 0, 0)", transform: "translate3d(" + (f + a) + "%, 0, 0)" }))));
                                    }),
                                    !1
                                );
                            })
                            .bind("touchend", function (e) {
                                if (
                                    (e.preventDefault(),
                                    e.stopPropagation(),
                                    i("#swipebox-slider").css({ "-webkit-transition": "-webkit-transform 0.4s ease", transition: "transform 0.4s ease" }),
                                    (s = b.pageY - c.pageY),
                                    (t = b.pageX - c.pageX),
                                    (a = (100 * t) / h),
                                    l)
                                )
                                    if (((l = !1), Math.abs(s) >= 100 && Math.abs(s) > Math.abs(n))) {
                                        var p = s > 0 ? g.height() : -g.height();
                                        g.animate({ top: p + "px", opacity: 0 }, 300, function () {
                                            r.closeSlide();
                                        });
                                    } else g.animate({ top: 0, opacity: 1 }, 300);
                                else d ? ((d = !1), t >= 10 && t >= o ? r.getPrev() : t <= -10 && t <= o && r.getNext()) : u.hasClass("visible-bars") ? (r.clearTimeout(), r.hideBars()) : (r.showBars(), r.setTimeout());
                                i("#swipebox-slider").css({ "-webkit-transform": "translate3d(" + f + "%, 0, 0)", transform: "translate3d(" + f + "%, 0, 0)" }),
                                    i("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),
                                    i(".touching").off("touchmove").removeClass("touching");
                            });
                },
                setTimeout: function () {
                    if (d.settings.hideBarsDelay > 0) {
                        var t = this;
                        t.clearTimeout(),
                            (t.timeout = e.setTimeout(function () {
                                t.hideBars();
                            }, d.settings.hideBarsDelay));
                    }
                },
                clearTimeout: function () {
                    e.clearTimeout(this.timeout), (this.timeout = null);
                },
                showBars: function () {
                    var e = i("#swipebox-top-bar, #swipebox-bottom-bar");
                    this.doCssTrans()
                        ? e.addClass("visible-bars")
                        : (i("#swipebox-top-bar").animate({ top: 0 }, 500),
                          i("#swipebox-bottom-bar").animate({ bottom: 0 }, 500),
                          setTimeout(function () {
                              e.addClass("visible-bars");
                          }, 1e3));
                },
                hideBars: function () {
                    var e = i("#swipebox-top-bar, #swipebox-bottom-bar");
                    this.doCssTrans()
                        ? e.removeClass("visible-bars")
                        : (i("#swipebox-top-bar").animate({ top: "-50px" }, 500),
                          i("#swipebox-bottom-bar").animate({ bottom: "-50px" }, 500),
                          setTimeout(function () {
                              e.removeClass("visible-bars");
                          }, 1e3));
                },
                animBars: function () {
                    var e = this,
                        t = i("#swipebox-top-bar, #swipebox-bottom-bar");
                    t.addClass("visible-bars"),
                        e.setTimeout(),
                        i("#swipebox-slider").click(function () {
                            t.hasClass("visible-bars") || (e.showBars(), e.setTimeout());
                        }),
                        i("#swipebox-bottom-bar").hover(
                            function () {
                                e.showBars(), t.addClass("visible-bars"), e.clearTimeout();
                            },
                            function () {
                                d.settings.hideBarsDelay > 0 && (t.removeClass("visible-bars"), e.setTimeout());
                            }
                        );
                },
                keyboard: function () {
                    var t = this;
                    i(e).bind("keyup", function (e) {
                        e.preventDefault(), e.stopPropagation(), 37 === e.keyCode ? t.getPrev() : 39 === e.keyCode ? t.getNext() : 27 === e.keyCode && t.closeSlide();
                    });
                },
                actions: function () {
                    var e = this,
                        t = "touchend click";
                    p.length < 2
                        ? (i("#swipebox-bottom-bar").hide(), s === p[1] && i("#swipebox-top-bar").hide())
                        : (i("#swipebox-prev").bind(t, function (t) {
                              t.preventDefault(), t.stopPropagation(), e.getPrev(), e.setTimeout();
                          }),
                          i("#swipebox-next").bind(t, function (t) {
                              t.preventDefault(), t.stopPropagation(), e.getNext(), e.setTimeout();
                          })),
                        i("#swipebox-close").bind(t, function () {
                            e.closeSlide();
                        });
                },
                setSlide: function (e, t) {
                    t = t || !1;
                    var s = i("#swipebox-slider");
                    (f = 100 * -e),
                        this.doCssTrans() ? s.css({ "-webkit-transform": "translate3d(" + 100 * -e + "%, 0, 0)", transform: "translate3d(" + 100 * -e + "%, 0, 0)" }) : s.animate({ left: 100 * -e + "%" }),
                        i("#swipebox-slider .slide").removeClass("current"),
                        i("#swipebox-slider .slide").eq(e).addClass("current"),
                        this.setTitle(e),
                        t && s.fadeIn(),
                        i("#swipebox-prev, #swipebox-next").removeClass("disabled"),
                        0 === e ? i("#swipebox-prev").addClass("disabled") : e === p.length - 1 && !0 !== d.settings.loopAtEnd && i("#swipebox-next").addClass("disabled");
                },
                openSlide: function (t) {
                    i("html").addClass("swipebox-html"),
                        b ? (i("html").addClass("swipebox-touch"), d.settings.hideCloseButtonOnMobile && i("html").addClass("swipebox-no-close-button")) : i("html").addClass("swipebox-no-touch"),
                        i(e).trigger("resize"),
                        this.setSlide(t, !0);
                },
                preloadMedia: function (e) {
                    var t = this,
                        i = null;
                    p[e] !== s && (i = p[e].href),
                        t.isVideo(i)
                            ? t.openMedia(e)
                            : setTimeout(function () {
                                  t.openMedia(e);
                              }, 1e3);
                },
                openMedia: function (e) {
                    var t, o;
                    if ((p[e] !== s && (t = p[e].href), e < 0 || e >= p.length)) return !1;
                    (o = i("#swipebox-slider .slide").eq(e)),
                        this.isVideo(t)
                            ? (o.html(this.getVideo(t)), d.settings.afterMedia && d.settings.afterMedia(e))
                            : (o.addClass("slide-loading"),
                              this.loadMedia(t, function () {
                                  o.removeClass("slide-loading"), o.html(this), d.settings.afterMedia && d.settings.afterMedia(e);
                              }));
                },
                setTitle: function (e) {
                    var t = null;
                    i("#swipebox-title").empty(), p[e] !== s && (t = p[e].title), t ? (i("#swipebox-top-bar").show(), i("#swipebox-title").append(t)) : i("#swipebox-top-bar").hide();
                },
                isVideo: function (e) {
                    if (e) {
                        if (e.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || e.match(/vimeo\.com\/([0-9]*)/) || e.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) return !0;
                        if (e.toLowerCase().indexOf("swipeboxvideo=1") >= 0) return !0;
                    }
                },
                parseUri: function (e, s) {
                    var o = t.createElement("a"),
                        n = {};
                    return (
                        (o.href = decodeURIComponent(e)),
                        o.search && (n = JSON.parse('{"' + o.search.toLowerCase().replace("?", "").replace(/&/g, '","').replace(/=/g, '":"') + '"}')),
                        i.isPlainObject(s) && (n = i.extend(n, s, d.settings.queryStringData)),
                        i
                            .map(n, function (e, t) {
                                if (e && e > "") return encodeURIComponent(t) + "=" + encodeURIComponent(e);
                            })
                            .join("&")
                    );
                },
                getVideo: function (e) {
                    var t = "",
                        i = e.match(/((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/),
                        s = e.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/),
                        o = e.match(/(?:www\.)?vimeo\.com\/([0-9]*)/),
                        n = "";
                    return (
                        i || s
                            ? (s && (i = s),
                              (n = a.parseUri(e, { autoplay: d.settings.autoplayVideos ? "1" : "0", v: "" })),
                              (t = '<iframe width="560" height="315" src="//' + i[1] + "/embed/" + i[2] + "?" + n + '" frameborder="0" allowfullscreen></iframe>'))
                            : o
                            ? ((n = a.parseUri(e, { autoplay: d.settings.autoplayVideos ? "1" : "0", byline: "0", portrait: "0", color: d.settings.vimeoColor })),
                              (t = '<iframe width="560" height="315"  src="//player.vimeo.com/video/' + o[1] + "?" + n + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'))
                            : (t = '<iframe width="560" height="315" src="' + e + '" frameborder="0" allowfullscreen></iframe>'),
                        '<div class="swipebox-video-container" style="max-width:' + d.settings.videoMaxWidth + 'px"><div class="swipebox-video">' + t + "</div></div>"
                    );
                },
                loadMedia: function (e, t) {
                    if (0 === e.trim().indexOf("#")) t.call(i("<div>", { class: "swipebox-inline-container" }).append(i(e).clone().toggleClass(d.settings.toggleClassOnLoad)));
                    else if (!this.isVideo(e)) {
                        var s = i("<img>").on("load", function () {
                            t.call(s);
                        });
                        s.attr("src", e);
                    }
                },
                getNext: function () {
                    var e,
                        t = this,
                        s = i("#swipebox-slider .slide").index(i("#swipebox-slider .slide.current"));
                    s + 1 < p.length
                        ? ((e = i("#swipebox-slider .slide").eq(s).contents().find("iframe").attr("src")),
                          i("#swipebox-slider .slide").eq(s).contents().find("iframe").attr("src", e),
                          s++,
                          t.setSlide(s),
                          t.preloadMedia(s + 1),
                          d.settings.nextSlide && d.settings.nextSlide(s))
                        : !0 === d.settings.loopAtEnd
                        ? ((e = i("#swipebox-slider .slide").eq(s).contents().find("iframe").attr("src")),
                          i("#swipebox-slider .slide").eq(s).contents().find("iframe").attr("src", e),
                          (s = 0),
                          t.preloadMedia(s),
                          t.setSlide(s),
                          t.preloadMedia(s + 1),
                          d.settings.nextSlide && d.settings.nextSlide(s))
                        : (i("#swipebox-overlay").addClass("rightSpring"),
                          setTimeout(function () {
                              i("#swipebox-overlay").removeClass("rightSpring");
                          }, 500));
                },
                getPrev: function () {
                    var e,
                        t = i("#swipebox-slider .slide").index(i("#swipebox-slider .slide.current"));
                    t > 0
                        ? ((e = i("#swipebox-slider .slide").eq(t).contents().find("iframe").attr("src")),
                          i("#swipebox-slider .slide").eq(t).contents().find("iframe").attr("src", e),
                          t--,
                          this.setSlide(t),
                          this.preloadMedia(t - 1),
                          d.settings.prevSlide && d.settings.prevSlide(t))
                        : (i("#swipebox-overlay").addClass("leftSpring"),
                          setTimeout(function () {
                              i("#swipebox-overlay").removeClass("leftSpring");
                          }, 500));
                },
                nextSlide: function (e) {},
                prevSlide: function (e) {},
                closeSlide: function () {
                    i("html").removeClass("swipebox-html"), i("html").removeClass("swipebox-touch"), i(e).trigger("resize"), this.destroy();
                },
                destroy: function () {
                    i(e).unbind("keyup"),
                        i("body").unbind("touchstart"),
                        i("body").unbind("touchmove"),
                        i("body").unbind("touchend"),
                        i("#swipebox-slider").unbind(),
                        i("#swipebox-overlay").remove(),
                        i.isArray(o) || o.removeData("_swipebox"),
                        this.target && this.target.trigger("swipebox-destroy"),
                        (i.swipebox.isOpen = !1),
                        d.settings.afterClose && d.settings.afterClose();
                },
            }),
            d.init();
    }),
        (i.fn.swipebox = function (e) {
            if (!i.data(this, "_swipebox")) {
                var t = new i.swipebox(this, e);
                this.data("_swipebox", t);
            }
            return this.data("_swipebox");
        });
})(window, document, jQuery);