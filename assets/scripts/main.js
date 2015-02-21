(function($) {
    window.__transform = 'basic';
    window.__active = 'none';
    window.rgb = function (hexColor, opacity, rtype) {
        var shorthandRegex, result, objRgb, isPrs;

        // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
        shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hexColor = hexColor.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

        objRgb = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };

        if (opacity && typeof opacity === 'string') {
            isPrs = opacity.search('%');

            if (isPrs !== -1) {
                opacity = opacity.replace('%', '');
                opacity = Number(opacity) / 100;
            }
            objRgb.o = opacity;
        } else if (opacity && typeof opacity === 'number') {
            objRgb.o = opacity;
        }

        if (!rtype || rtype !== 'object') {
            result = objRgb.r + ', ' + objRgb.g + ', ' + objRgb.b;
            if (objRgb.o) {
                result = 'rgba(' + result + ', ' + objRgb.o + ')';
            } else {
                result = 'rgb(' + result + ')';
            }

            return result;
        } else {
            return objRgb;
        }
    };
    $(document).ready(function() {
        $('.bored').click(function() {
            if (window.__transform === 'basic') {
                TweenMax.to('.page.main .background .inner', 0.5, {
                    left: '100%',
                    opacity: '0',
                    onComplete: function() {
                        $('.page.main .photo-box').addClass('simple');
                        TweenMax.to('.page.main .photo-box', 0.3, {
                            borderColor: rgb('#32a5d3', 0.5),
                            width: 128,
                            height: 128,
                            onComplete: function() {
                                TweenMax.to('.page.main .title', 0.3, {
                                    scale: 0,
                                    marginTop: 40,
                                    onComplete: function() {
                                        $('.page.main .title').html('FRONT-END NINJA');
                                        TweenMax.to('.page.main .title', 0.3, {
                                            scale: 1.2
                                        });
                                    }
                                });
                                TweenMax.to('.page.main .detail', 0.3, {
                                    scale: 0,
                                    marginTop: 40,
                                    onComplete: function() {
                                        $('.page.main .detail').html('Yeah! I am expert in HTML5, CSS3, Javascript, etc. I Love Front-End!');
                                        TweenMax.to('.page.main .detail', 0.3, {
                                            scale: 1.2
                                        });
                                    }
                                });
                                TweenMax.to('.page.main .name', 0.3, {
                                    scale: 0.8,
                                    marginTop: -32
                                });
                                TweenMax.to('.nav-a a .text', 0.3, {
                                    opacity: 0,
                                    onComplete: function() {
                                        $('.nav-a').addClass('basic');
                                        $('.nav-a a .text').removeAttr('style');
                                        TweenMax.to('.nav-a', 0.3, {
                                            top: 50,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                TweenMax.to('.bored', 0.3, {
                    scale: 0,
                    opacity: 0,
                    onComplete: function() {
                        $('.bored').html('STILL BORED? TRY AGAIN!');
                        TweenMax.to('.bored', 0.3, {
                            scale: 1,
                            opacity: 1
                        });
                    }
                });
                
                window.__transform = 'extended-1';
            } else if (window.__transform === 'extended-1') {
                TweenMax.to('.title, .detail', 0.5, {
                    scale: 0,
                    onComplete: function() {
                        $('.title, .detail').css({
                            display: 'none'
                        });
                        
                        $('.bored').html('STILL BORED?');
                        TweenMax.to('.bored', 0.3, {
                            scale: 5,
                            opacity: 1,
                        });
                        window.__transform = 'poor';
                    }
                });
                TweenMax.to('.bored', 0.3, {
                    scale: 0,
                    opacity: 0,
                });
            } else if (window.__transform === 'poor') {
                TweenMax.to('.bored', 0.3, {
                    scale: 0,
                    opacity: 0,
                    onComplete: function() {
                        $('.bored').html('I DON\'T CARE! :P');
                        TweenMax.to('.bored', 0.3, {
                            opacity: 1,
                            scale: 6,
                            onComplete: function() {
                                setTimeout(function() {
                                    $('.title, .detail').css({
                                        display: 'block'
                                    });
                        
                                    TweenMax.to('.detail, .bored', 0.3, {
                                        opacity: 1,
                                        scale: 1,
                                        onComplete: function() {
                                            $('.bored').html('STILL BORED? JUST PRESS "COMMAND + Q" OR "ALT + F4"!');
                                            window.__transform = 'super';
                                        }
                                    });
                                    TweenMax.to('.title', 0.3, {
                                        opacity: 1,
                                        scale: 1.2
                                    });
                                }, 2000);
                            }
                        });
                    }
                });
            }
            
            return false;
        });
        
        /* Navigation. */
        $('.exit').click(function() {
            if (window.__active === 'none') return false;
            
            TweenMax.to('.page.' + window.__active, 0.4, {
                top: '100%',
                opacity: 0
            });
            TweenMax.to('.exit', 0.3, {
                opacity: 0
            });
            
            return false;
        });
        $('.nav-a a').click(function() {
            var page_next = $(this).attr('class');
            if (window.__active === 'none') {
                TweenMax.to('.page.' + page_next, 0.4, {
                    top: 0,
                    opacity: 1,
                    ease: Elastic.easeInOut,
                    onComplete: function() {
                        TweenMax.to('.page.' + page_next + ' .inner-box', 0.3, {
                            opacity: 1
                        });
                        window.__active = page_next;
                    }
                });
            }
            
            $('.page.' + page_next).addClass('prepare');
            
            TweenMax.to('.' + window.__active, 0.4, {
                top: '100%',
                opacity: 1,
                onComplete: function() {
                    TweenMax.to('.exit', 0.3, {
                        opacity: 1
                    });
                    TweenMax.to('.page.' + page_next, 0.4, {
                        top: 0,
                        opacity: 1,
                        ease: Elastic.easeInOut,
                        onComplete: function() {
                            TweenMax.to('.page.' + page_next + ' .inner-box', 0.3, {
                                opacity: 1
                            });
                            window.__active = page_next;
                        }
                    });
                }
            });
            
            return false;
        });
    });
})(jQuery);