/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing', 'queryloader', 'transit'] , function( $ , api ){
    'use strict'

    LP.use('panel');


    if( $.browser.msie && $.browser.version <= 8 ){
        $(document.body).addClass('ie8');
    }
    var isMobileBrowser = (function(){
        var sUserAgent = navigator.userAgent.toLowerCase();  
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";  
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";  
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";  
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";  
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";  
        var bIsAndroid = sUserAgent.match(/android/i) == "android";  
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";  
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";  
        return  bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM;
    })();
    var isMobile = $(window).width() <= 640 || isMobileBrowser;
    if( isMobile ){
        $(window).load(function(){
            setTimeout(window.scrollTo(0,0) , 0);
        });
    }

    var lang = $(document.body).data('lang');
    var COLOR = window.from == 'weibo' || !window.from ? '#ff0000' : '#065be0';

	// if(isMobile) {
	// 	LP.use(['hammer'] , function(){
	// 		$('body').hammer()
	// 			.on("release dragleft dragright swipeleft swiperight", '.page', function(ev) {
	// 				switch(ev.type) {
	// 					case 'swipeleft':
	// 					case 'dragleft':
	// 						$nav.stop( true , true )
 //                                    .animate({left: -190} , 300);
 //                                $('body').bind('touchmove', function(e){e.preventDefault()});
	// 						break;
	// 					case 'swiperight':
	// 					case 'dragright':
	// 						LP.triggerAction('show-menu');
	// 						break;
	// 					case 'release':
	// 						break;
	// 					default:;
	// 				}

	// 			}
	// 		);
	// 	});
	// }

    function retweetMonitoring( data ) {
      var msg = $(this).closest(".tweet-signle-item").find(".profile-msg").text();
      var max_length = 112;
      LP.panel({
        content: '<div class="popup_dialog popup_post" style="width:auto;">\
            <div class="popup_dialog_msg" style="height:110px;width: auto;">\
                <textarea style="overflow:auto;">' + msg + '</textarea>\
            </div><div class="alert-message clearfix"><div class="msg"></div><div class="msg-sug"><span class="s1">10</span>/<span class="s2">' + max_length + '</span></div></div>\
            <div class="popup_dialog_btns">' + '<a href="javascript:void(0);" class="p-cancel">' + _e('Cancel') + '</a> <a href="javascript:void(0);" class="p-confirm">' + _e('Confirm') + '</a>' + 
                '<span class="loading"></span>\
            </div>\
            <div class="popup_dialog_status">\
                <span>' + _e('Success!') + '</span>\
            </div>',
        title: "",
        closeAble: false,
        onShow: function () {
            var panel = this;
            panel.$panel.find('.p-cancel')
                .click(function(){
                    panel.close();
                });
            panel.$panel.find('textarea').bind("keydown", function (event) {
              var self = $(this);
              var length = self.val().length;
              panel.$panel.find(".msg-sug .s1").html(length);
              if (length >= max_length) {
                var keycode = event.which;
                if (keycode != 8) {
                  //panel.$panel.find(".alert-message .msg").html(_e("Max length of twitte is " + max_length));
                  panel.$panel.find(".alert-message .msg").html(_e("Maximum number of characters attained"));
                  event.preventDefault();
                  return false;
                }
              }
              else {
                panel.$panel.find(".alert-message .msg").html("");
              }
            }).trigger('keydown');
            var isDisabled = false;
            panel.$panel.find('.p-confirm')
                .click(function(){
                    if( isDisabled ) return;
                    isDisabled = true;
                    var textarea = this.$panel.find('textarea');
                    api.post("/api/twitte/post", {msg: textarea.val(), uuid: data.uuid}, function (e) {
                        panel.close();
                    } , null , function(){
                        isDisabled = false;
                    });
                });
        },
        width: $(window).width() * 0.6
      });
        return false;
    }
    
    function commentMonitoring( data ) {
      var self = $(this);
      var max_length = 100;
      var screen_name = self.parents(".tweet-signle-item").find(".title").text();
      LP.panel({
        content: '<div class="popup_dialog popup_post" style="width:auto;">\
            <div class="popup_dialog_msg" style="height:110px;width: auto;">\
                <textarea style="overflow:auto;">' + screen_name + " " + window.topic + '</textarea>\
            </div><div class="alert-message clearfix"><div class="msg"></div><div class="msg-sug"><span class="s1">0</span>/<span class="s2">' + max_length + '</span></div></div>\
            <div class="popup_dialog_btns">' + '<a href="javascript:void(0);" class="p-cancel">' + _e('Cancel') + '</a> <a href="javascript:void(0);" class="p-confirm">' + _e('Confirm') + '</a>' + 
                '<span class="loading"></span>\
            </div>\
            <div class="popup_dialog_status">\
                <span>' + _e('Success!') + '</span>\
            </div>',
        title: "",
        closeAble: false,
        onShow: function () {
            var panel = this;
            panel.$panel.find('.p-cancel')
                .click(function(){
                    panel.close();
                });
            panel.$panel.find('textarea').bind("keydown", function (event) {
              var self = $(this);
              var length = self.val().length;
              panel.$panel.find(".msg-sug .s1").html(length);
              if (length >= max_length) {
                var keycode = event.which;
                if (keycode != 8) {
                  //panel.$panel.find(".alert-message .msg").html(_e("Max length of twitte is " + max_length));
                  panel.$panel.find(".alert-message .msg").html(_e("Maximum number of characters attained"));
                  event.preventDefault();
                  return false;
                }
              }
              else {
                panel.$panel.find(".alert-message .msg").html("");
              }
            }).trigger('keydown');
            var isDisabled = false;
            panel.$panel.find('.p-confirm')
                .click(function(){
                    if( isDisabled ) return;
                    isDisabled = true;

                    var textarea = this.$panel.find('textarea');
                    api.post("/api/twitte/post", {msg: textarea.val(), uuid: data.uuid}, function (e) {
                        panel.close();
                    } , null , function(){
                        isDisabled = false;
                    });
                });
        },
        width: $(window).width() * 0.6
      });
      return false;
    }

    // widgets and common functions here
    // ======================================================================
    var rotateAnimate = function( $dom , current , total ,  startAngle , noMoveNum ){
        current = current || 0;
        var percent = Math.min( current / total , 1 ) ;
        startAngle = startAngle / 180 * Math.PI || 0;
        LP.use('raphaeljs' , function( Raphael ){
            // Creates canvas 320 × 200 at 10, 50
            var width = $dom.width();
            var height = $dom.height();
            var memberHeight = $('.member_item').outerHeight() - 8;
            if($('body').hasClass('ie8')) {
                memberHeight = $('.member_item').outerHeight() + 8;
            }
            var r = memberHeight / 2 - 5 , stockWidth = 8 , stockColor = COLOR;

            var start = [ width / 2 + Math.cos( startAngle )  * r , height / 2 + Math.sin( startAngle ) * r ];

            var paper = Raphael( $dom.get(0) , width , height );

            var circleBg = paper.circle( width / 2 , height / 2, r )
                    .attr("stroke" , '#000' )
                    .attr("stroke-width" , 0 )
                    .animate({'stroke-width': stockWidth} , 700);

            var redPath = paper.path( "" )
                    .attr("stroke" , stockColor )
                    .attr("stroke-width" ,stockWidth );
            // var blackPath = paper.path( "" )
            //         .attr("stroke", "#000")
            //         .attr("stroke-width" , stockWidth);

            var text = paper.text( width / 2 , height / 2 , "0 " + _e("T/H") )
                .attr({fill: "#fff",'font-size': isMobile ? '11px' : lang == 'zh_cn' ? '11px' : '13px'});


            var now ;
            var duration = 700;
            var ani = function(){
                var p = Math.min( 1 ,  ( new Date() - now ) / duration );
                var end = [ width / 2 + Math.cos( startAngle + percent * p * 2 * Math.PI ) * r , height / 2 + Math.sin( startAngle + percent * p * 2 * Math.PI ) * r  ]
                var path = [
                    'M' , start[0] , ' ' , start[1] ,
                    'A' , r , ' ' , r , ' 0 ' , percent * p > 0.5 ? '1' : '0' , ' 1 ' ,  end[0] , ' ' , end[1]
                    ].join("");
                // var otherPath = [
                //     'M' , start[0] , ' ' , start[1] ,
                //     'A' , r , ' ' , r , ' 0 ' , percent * p > 0.5 ? '0' : '1' , ' 0 ' ,  end[0] , ' ' , end[1]
                // ].join("");

                if( percent * p < 1 ){
                    redPath.attr( 'path' , path );
                    //blackPath.attr( 'path' , otherPath );
                }
                if( percent * p == 1 ){
                    paper.circle( width / 2 , height / 2, r )
                        .attr("stroke" , stockColor )
                        .attr("stroke-width" ,stockWidth );
                    redPath.remove();
                    blackPath.remove();
                }

                // render numbers
                if( !noMoveNum )
                    text.attr('text' , ~~( p * 100 * percent * 100 ) / 100 + ' ' + _e("T/H") );

                if( p != 1 ){
                    setTimeout(ani , 60/1000);
                }
            }
            if( percent ){
                setTimeout( function(){
                    now = new Date();
                    ani();
                } , 700 );
            }
            //if( !percent ){
                // redPath.remove();
                // blackPath.remove();
                // paper.circle( width / 2 , height / 2, r )
                //     .attr("stroke" , '#000' )
                //     .attr("stroke-width" ,stockWidth );
            // } else {
            //     ani();
            // }
        });
    }

    var initPlaceHoler = function( $input ){
        if( $('<input/>').get(0).placeholder === undefined ){
            $input.val( $input.attr('placeholder') )
                .focus(function(){
                    if( this.value == $input.attr('placeholder') ){
                        this.value = '';
                    }
                })
                .blur(function(){
                    if( !this.value ){
                        this.value = $input.attr('placeholder');
                    }
                })
                .trigger('blur');
        }
    }
    var getPlaceHolderValue = function( $input ){
        return $input.val() == $input.attr('placeholder') ? "" : $input.val();
    }


    var questionTimerInitTimer = null;
    var questionTimerInit = function( $dom  , duration , cb ){
        var width = $dom.width();
        var r = width / 2;
        duration = duration || 30000;
        LP.use('raphaeljs' , function( Raphael ){
            var paper = Raphael( $dom.get(0) , width , width );
            var path = paper.path("").attr('fill' , '#f00');
            // draw a circle
            var circle = paper.circle( ~~r , ~~r , ~~r ).attr({
                'fill': COLOR,
                'stroke-width': 0
            });


            var rotateBlack = paper.rect(0 , 0 , width / 2 , width).attr({
                'fill': '#000',
                'stroke-width': 0
            });
            var topCircle = paper.path(['M' , ~~r , ' 0l0 ' , width , 'A' , ~~r  , ' ', ~~r , ' 0 0 1 ' , ~~r , ' 0'].join('') )
                .attr({
                    'fill': COLOR,
                    'stroke-width': 0,
                    zIndex: 2
                });
            var topBlack = paper.rect(width / 2 , 0 , width / 2 , width).attr({
                'fill': '#000',
                zIndex: 1
            }).hide();

            var now = new Date;
            var lastper = 0;
            var drawCircle = function(  ){
                var d = new Date - now;
                var per = d / duration;
                if( per >= 1 ){
                    //path.remove();
                    cb && cb();
                    return;
                }
                if( per > 0.5 ){
                    topBlack.show();
                    topCircle.hide();
                }
                rotateBlack.rotate( ( per - lastper ) * 360 , r , r  );
                // var p = [
                //     'M' , ~~(width/2) , ' 0l0 ' , ~~(width/2) ,
                //     'l' , ~~(Math.sin(per * Math.PI * 2) * r) , ' ' , -~~(Math.cos(per * Math.PI * 2) * r),
                //     'A' , ~~r , ' ' , ~~r , ' 0 ' , per > 0.5 ? 0 : 1 , ' 1 ' ,  ~~(width/2) , ' ' , 0 
                // ].join("");

                // console.log( p );
                // path.attr('path' , p);
                
                questionTimerInitTimer = setTimeout( drawCircle , 1000 / 60 );
                lastper = per;
            }
            questionTimerInitTimer = setTimeout( drawCircle , 1000 / 60 );
        });
    }
    // left { max: xx , tip : '' , text: yyy }
    var coordinate = (function(){
        var object = {};
        function init( $dom , cb ){
            
            //var left = [ 120 , xstart[1] ] , right = [ 340 , xstart[1] ] , top = [ ystart[0] , 100 ] , bottom = [ ystart[0] , 300 ];

            var pathAttr = {
                'stroke' : '#d1d1d1',
                'opacity' : 0.7,
                'stroke-width' : 2
            }
            var textAttr = {
                'fill' : '#fff',
                'font-size' : isMobile ? '18px' : '14px',
                'opacity' : 1
            }

            LP.use('raphaeljs' , function( Raphael ){

                // draw x 
                var paper = Raphael( $dom.get(0) , $dom.width() , $dom.height() );

                var drawCoordinate = function( ){
                    var width = $dom.width();
                    var height = $dom.height();
                    var ch = ~~( height / 2 );
                    var cw = ~~( width / 2 );
                    
                    //var left = 0.5 , right = 0.7 , top = 0.3 , bottom = 0.9;

                    var xstart = [ 70 , ch ] , xend = [ width - 70 , ch ] , xwidth = xend[ 0 ] - xstart[ 0 ]
                        , ystart = [ cw , 70 ] , yend = [ cw , height - 70 ] , yheight = yend[ 1 ] - ystart[ 1 ];


                    var sw = ( xend[0] - xstart[0] ) / 10 ; // step width
                    var sh = 7; // step height

                    var center = [ xwidth / 2 + xstart[0] , yheight / 2 + ystart[1] ];

                    paper.path( ['M' , xstart.join(" ") , 'L' , xend.join(" ")].join("") ).attr(pathAttr);
                    var xpath = [
                        //'M' , xstart.join(" ") , 'L' , xend.join(" ") ,
                        // 'M0 ' , ch , 'L' , width , ' ' , ch ,
                        'M' , xstart[ 0 ] , ' ' , xstart[1] - ~~(sh/2) , 'l0 ' , sh ];
                    for( var i = 1 ; i * sw <= xwidth ; i++ ){
                        xpath.push( 'm' + sw + ' 0l0 ' + ( i % 2 == 1 ? '-' : '' ) + sh );
                    }
                    paper.path( xpath.join("") )
                        .attr(pathAttr)
                        .attr({'stroke-width': 1});

                    paper.text( xstart[0] - 40 , xstart[1] , _e('Impact') )
                        .attr( textAttr );
                    paper.text( xend[0] + 40 , xend[1] , _e('Speed') )
                        .attr( textAttr );

                    // draw y
                    paper.path( ['M' , ystart.join(" ") , 'L' , yend.join(" ")].join("") ).attr(pathAttr);
                    var ypath = [
                        //'M' , ystart.join(" ") , 'L' , yend.join(" ") ,
                        //'M' , cw , ' 0L' , cw , ' ' , height ,
                        'M' , ystart[ 0 ] - ~~(sh/2) , ' ' , ystart[1] , 'l' , sh , ' 0' ];
                    for( var i = 1 ; i * sw <= yheight ; i++ ){
                        ypath.push( 'm0 ' + sw + 'l' + ( i % 2 == 1 ? '-' : '' ) + sh + ' 0' );
                    }
                    paper.path( ypath.join("") ).attr(pathAttr).attr({'stroke-width': 1});;

                    paper.text( ystart[0] , ystart[1] - 20 , _e('Quality') )
                        .attr( textAttr );
                    paper.text( yend[0] , yend[1] + 20  , _e('Knowledge') )
                        .attr( textAttr );


                    object.center = center;
                    object.xwidth = xwidth;
                    object.xstart = xstart;
                    object.ystart = ystart;
                    object.yheight = yheight;



                    object.path = paper.path( "" ).attr( {
                        "stroke": COLOR,
                        "stroke-width": 3
                    } );
                }

                $(window).resize(function(){
                    paper.clear();
                    paper.setSize( $dom.width() , $dom.height() );
                    drawCoordinate();
                    object.path.attr('path' , '');
                    runAnimate.call( '' , target[0],target[1],target[2],target[3] , true );
                });
                drawCoordinate();
                cb && cb();
            });
        }

        function easeOutElastic( x, t, b, c, d ) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        }

        var target = [];

        function runAnimate( left , top, right , bottom , noAnimate ){
            // left = 0.5;
            // right = 0.7;
            // top = 0.9;
            // bottom = 0.3;
            target = [left , right , top , bottom];
            

            var center = object.center;
            var xwidth = object.xwidth;
            var xstart = object.xstart;
            var ystart = object.ystart;
            var yheight = object.yheight;

            var lastLeft = object.lastLeft || 0;
            var lastTop = object.lastTop || 0;
            var lastRight = object.lastRight || 0;
            var lastBottom = object.lastBottom || 0;

            var duration = 1000;
            var now = new Date;
            var renderPath = function( left , right , top , bottom ){
                left = [ center[0] - xwidth / 2 * left , xstart[1] ];
                right = [ center[0] + xwidth / 2 * right , xstart[1] ];
                top = [ ystart[0] , center[1] - yheight / 2 * top ];
                bottom = [ ystart[0] , center[1] + yheight / 2 * bottom ];

                var rpath = [];
                $.each([ left, top , right , bottom] , function( i , dot){
                    rpath.push( ( i == 0 ? 'M' : 'L' ) + dot[0] + ' ' + dot[1] );
                });
                rpath.push('Z');

                object.path.attr( 'path' , rpath.join("") );
            }

            if( noAnimate ){
                renderPath( left , right , top , bottom  );
                object.lastLeft = left;
                object.lastRight = right;
                object.lastTop = top;
                object.lastBottom = bottom;
                return;
            }
            var ani = function(){
                var dur = new Date - now;
                var per = dur / duration;
                if( per > 1 ){
                    per = 1;
                }
                var l = easeOutElastic('' , dur , lastLeft , left - lastLeft , duration ) ;// per * ( left - lastLeft );
                var r = easeOutElastic('' , dur , lastRight , right - lastRight , duration ) ;// per * ( right - lastRight );
                var t = easeOutElastic('' , dur , lastTop , top - lastTop , duration ) ;//per * ( top - lastTop );
                var b = easeOutElastic('' , dur , lastBottom , bottom - lastBottom , duration ) ;//per * ( bottom - lastBottom );
                renderPath( l || 0 , r || 0 , t || 0 , b || 0 );
                // renderPath( l + lastLeft , r + lastRight , t + lastTop , b + lastBottom );
                if( per < 1 ) {
                    setTimeout( ani , 1000 / 60 );
                } else {
                    object.lastLeft = left;
                    object.lastRight = right;
                    object.lastTop = top;
                    object.lastBottom = bottom;
                }
            }
            ani();
        }
        return {
            init: init , 
            run: runAnimate ,
            isEmpty: function(){
                return !target[0] && !target[1] && !target[2] && !target[3];
            }
        }
    })();

    var animateTure =  (function(){

        $('.tutr-step').find('.step-btn')
            .click(function(){
                animateTure.showStep( $(this).data('step') );
                return false;
            });

        $(document.body).delegate('.read_tutr .tutr-step-skip,.read_tutr .tutr-step-top,.read_tutr .tutr-step-left,.read_tutr .tutr-step-right,.read_tutr .tutr-step-bottom',
            'click' , function(){
                $('.tutr-step,.tutr-step-tip1,.tutr-step-tip2,.tutr-step-tip3,.tutr-step-tip4').fadeOut();
				if( isNoAchivmentsbox ){
					$('.stand_achivments .stand_achivmentsbox .full-star').removeClass('full-star').html('');
				}
                if( isCoordinateEmpty ){
                    coordinate.run( 0,0,0,0 );
                }
            })
        // if( $('.read_tutr').length ){
        //     $('.tutr-step-skip,.tutr-step-top,.tutr-step-left,.tutr-step-right,.tutr-step-bottom').click(function(){
        //         $('.tutr-step').fadeOut();
        //     });
        // }

        $('body').keyup(function(e){
            if(e.keyCode == 27 && $('.tutr-step').hasClass('read_tutr')) {
				$('.page').css({'overflow-x':'hidden'});
                $('.tutr-step').fadeOut();
            }
        });

        var renderTure = function( top , left , width , height , isAni ){
            var $step = $('.tutr-step').fadeIn();
            
            var winHeight = $(document).height();
            var winWidth = $(document).width();

            $step.find('.tutr-step-top')
                .animate({
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: top
                } , 500);
            $step.find('.tutr-step-left')
                .animate({
                    top: top,
                    left: 0,
                    width: left,
                    height: height
                } , 500);
            $step.find('.tutr-step-right')
                .animate({
                    top: top,
                    left: left + width,
                    width: winWidth - left - width,
                    height: height
                } , 500);
            $step.find('.tutr-step-bottom')
                .animate({
                    top: top + height,
                    left: 0,
                    width: '100%',
                    height: winHeight - top - height
                } , 500);
        }

        var isCoordinateEmpty = false;
        var isNoAchivmentsbox = false;
        return {
            showStep: function( num ){
                switch( num ){
                    case 1:
                        var off = $('.stand_tit').offset();
                        var w = Math.max( $('.member_item').width() , 200 );
                        renderTure( off.top - 10 , off.left - 20 , w + 40 , 60 );
                        $('.tutr-step').find('.tutr-step-tip1')
                            .delay( 700 )
                            .css( isMobile ? {left: off.left-20 , top: off.top + $('.stand_tit').height() + 10 } : {left: off.left + w + 40 , top: off.top - 10 })
                            .fadeIn();

                        if( isMobile ){
                            $(document.body).animate({
                                scrollTop: 0
                            } , 200);
                        }

                        break;
                    case 2:
                        var off = $('.stand_tit').offset();
                        $('.tutr-step-tip1').fadeOut();
                        var h = $('.stand_tit').height() + $('.teambuild_members').height();
                        renderTure( isMobile ? off.top - 15 : off.top , off.left - 20 , isMobile ? $('.stand_tit').width() + 145 : $('.stand_tit').width() - $('.stand_chart_score').width() + 40, isMobile ? h + 25 : h );
                        $('.tutr-step').find('.tutr-step-tip2')
                            .delay( 700 )
                            .css( isMobile ? {left: off.left-20 , top: off.top + h + 10 } :  {left: isMobile ? off.left + $('.stand_tit').width() + 60 : off.left + $('.stand_tit').width() - $('.stand_chart_score').width() + 40, top: off.top , height: h - 80 })
                            .fadeIn();
                        break;
                    case 3:
                        var off = $('.stand_chart').offset();
                        $('.tutr-step-tip2').fadeOut();
                        $('html,body,.page').animate({scrollTop:off.top},500);
                        renderTure( off.top , off.left - 20 , isMobile ? $('.stand_chart').width() + 50 : $('.stand_chart').width() + 20 , $('.stand_chart').height() );
                        $('.tutr-step').find('.tutr-step-tip3')
                            .delay( 700 )
                            .css(isMobile ? {left: off.left-20 , top: off.top + $('.stand_chart').height() + 10 } :  {left: off.left  - 600 , top: off.top })
                            .fadeIn();

                        // if there is no data , render the demo data;
                        isCoordinateEmpty = coordinate.isEmpty();
                        if( isCoordinateEmpty ){
                            coordinate.run( Math.random(),Math.random(),Math.random(),Math.random() );
                        }
                        break;
                    case 4:

                        if( isCoordinateEmpty ){
                            coordinate.run( 0,0,0,0 );
                        }
                        // add demo 
                        isNoAchivmentsbox = !$('.stand_achivments .stand_achivmentsbox .full-star').length;
                        if( isNoAchivmentsbox ){
                            $('.stand_achivments .stand_achivmentsbox p').slice(0,2).addClass('full-star').each(function( i ){
                                $(this).html( i + 1 );
                            });
                        }
                        var off = $('.stand_achivments').offset();
                        $('.tutr-step-tip3').fadeOut();
                        renderTure( off.top , off.left - 20 , isMobile ? $('.stand_tweet').width() + 20 : $('.stand_tweet').width(), $('.stand_achivments').height() + $('.stand_tweet').height() + 20);
                        $('.tutr-step').find('.tutr-step-tip4')
                            .delay( 700 )
                            .css({left: off.left - 20 , top: isMobile ? off.top - $('.tutr-step').find('.tutr-step-tip4').height() - 220 : off.top - $('.tutr-step').find('.tutr-step-tip4').height() - 80 , width: $('.stand_achivments').width() - 80 })
                            .fadeIn();
						if(isMobile) {
							setTimeout(function(){
								$('.tutr-step-bottom').stop().animate({height:120});
							}, 500);
						}
                        break;
                    case 5:
                        if( isNoAchivmentsbox ){
                            $('.stand_achivments .stand_achivmentsbox .full-star').removeClass('full-star').html('');
                        }
                        $('.tutr-step-tip4').fadeOut();
                        LP.panel({
                            title: '',
                            content: '<div class="popup_box popup_dialog popup_email" >\
                                    <span class="con-step">' + _e('5/5') + '</span>\
                                    <h4>' + _e('Receive a reminder for the d-day') + '</h4>\
                                    <input class="popup_dialog_msg" placeholder="' + _e('Enter your email address') + '" />\
                                    <p class="error-tip"></p>\
                                    <div class="popup_dialog_btns">\
                                        <a href="javascript:void(0);">' + _e('Finish tutorial') + '</a>\
                                    </div>\
                                    <div class="popup_dialog_status">\
                                        <span>' + _e('Success!') + '</span>\
                                    </div>\
                                </div>',
                            onShow: function(){
                                var panel = this;
                                var $input = this.$panel.find('input').focus(function(){
                                    $tip.html('');
                                });

                                // init place holder
                                var $input = panel.$panel.find('input');
                                initPlaceHoler( $input );
                                // if( $('<input/>').get(0).placeholder === undefined ){
                                //     $input.val( $input.attr('placeholder') )
                                //         .focus(function(){
                                //             if( this.value == $input.attr('placeholder') ){
                                //                 this.value = '';
                                //             }
                                //         })
                                //         .blur(function(){
                                //             if( !this.value ){
                                //                 this.value = $input.attr('placeholder');
                                //             }
                                //         })
                                //         .trigger('blur');
                                // }
                                // init tutor place holder

                                var $tip = this.$panel.find('.error-tip');
                                panel.$panel.find('.popup_dialog_btns a').click(function(){

                                    var email = getPlaceHolderValue( $input );
                                    // if( email == $input.attr('placeholder') ){
                                    //     email = '';
                                    // }
                                    if( email &&
                                        (!email.match(/^[a-zA-Z_0-9].*[a-zA-Z]$/) ||
                                        !email.match(/[a-zA-Z_0-9]@[a-zA-Z_0-9]/) ||
                                        !email.match(/^[a-zA-Z_0-9.]+@[a-zA-Z_.0-9]+$/)) ){
                                        $tip.html( _e('wrong email') );
                                    }

                                    if($(this).hasClass('disabled')) {
                                        return;
                                    }
                                    if( email ){
                                        var $btn = $(this).addClass('disabled');
                                        $(this).next().fadeIn();
                                        api.post( '/api/user/logmail' , {email: email} , function(){
                                            var height = panel.$panel.find('.popup_dialog').height();
                                            panel.$panel.find('.popup_dialog').height(height);
                                            panel.$panel.find('.popup_dialog_btns').fadeOut();
                                            panel.$panel.find('.popup_dialog_status').delay(500).fadeIn(function(){
                                                setTimeout(function(){
                                                    panel.close();
                                                }, 500);
                                            });
                                        } , function(){
                                            $btn.removeClass('disabled');
                                        } );
                                    } else {
                                        panel.close();
                                    }

                                    api.get('/api/user/readtoturial');
                                });
                            }
                        });
                        
                    default:
						$('.page').css({'overflow-x':'hidden'});
                        $('.tutr-step').fadeOut();

                }
            }
        }
    })();


    // var initSuggestion = (function(){
    //     var tUtil = null;
    //     var BaseSelectPanel = null;
    //     var atSugConfig = {
    //         zIndex: 9999,
    //         width: 200,
    //         wrapClass: 'suggestWrap',
    //         // maxHeight: 200,
    //         availableCssPath: 'p', // 用于hover的css path
    //         //loadingContent: '<h4>想用@提到谁？</h4><div class="suggest-list" node-type="suggestion-list">',
    //         renderData: function(data){
    //             var key = this.key , aHtml = ['<h4>想用@提到谁？</h4><div class="suggest-list" node-type="suggestion-list">'];
    //             $.each(data , function(i,item){
    //                 aHtml.push(['<p data-insert="' , item.nickname , '">', item.nickname.replace(key , '<b>' + key + '</b>') + '<br/></p>'].join(''));
    //             });
    //             aHtml.push('</div>');
    //             return aHtml.join('');
    //         },
    //         // how to get data
    //         getData: function(cb){
    //             var key = this.key ;
    //             api.get('/api/user/Friendssuggestion' , {q: key} , function( e ){
    //                 cb( e.data );
    //             });
    //         }
    //     }
    //     var inputSuggestion = function( $textarea , cfg ){
    //         var regx = cfg.regx,
    //             tag = cfg.tag,
    //             lastIndex = 0,
    //             currIndex = 0,
    //             lastText = '',
    //             suggestion = null,
    //             _timeout = null,
    //             showSuggestion = function( ev ){
    //                 if( suggestion && suggestion.$wrap.is(':visible')){
    //                     switch(ev.keyCode){
    //                         case 40: // down
    //                         case 38: // up
    //                         case 13: //enter
    //                             return;
    //                     }
    //                 }
                    
    //                 var textarea = this,
    //                     value = textarea.value,
    //                     range = tUtil.getPos(textarea),
    //                     text = value.substring(0 , range.start);
                    
    //                 currIndex = range.start;
    //                 lastIndex = text.lastIndexOf(tag);
    //                 lastText = text.substring(lastIndex);
    //                 if(!regx.test(lastText)){
    //                     suggestion && suggestion.hide();
    //                     return;
    //                 }
    //                 if(!suggestion){
    //                     suggestion = new BaseSelectPanel(textarea , cfg.selectConfig);
    //                     suggestion.addListener("select" , function($dom){
    //                         var name = $dom.attr('data-insert');
    //                         if(!name){
    //                             tUtil.setText(textarea , '\n' , currIndex);
    //                         }else{
    //                             cfg.afterSelect && cfg.afterSelect(textarea , name , lastIndex , lastText.length);
    //                             //tUtil.setText(textarea , name , lastIndex , lastText.length);
    //                         }
    //                         $textarea.trigger('countwords');
    //                     });
    //                     suggestion.addListener("beforeShow" , function(t , data){
    //                         if(cfg.beforeShow){
    //                             return !!cfg.beforeShow( t , data );
    //                         }
    //                         return true;
    //                         //return !!$(data).find('li').length;
    //                     });
    //                 }
                    
    //                 // show suggestion
    //                 var pos = tUtil.getPagePos(textarea ,lastIndex);
    //                 var toff = $(textarea).offset()
    //                 suggestion.show( pos.left - toff.left , pos.bottom + 3 - toff.top + 30 , lastText.substring(1));
    //             },
    //             eventFn = function(ev){
    //                if(ev.keyCode == 27){
    //                    return false;;
    //                }
    //                // 延迟处理
    //                clearTimeout(_timeout);
    //                var textarea = this;
    //                _timeout = setTimeout(function(){
    //                    showSuggestion.call(textarea , ev);
    //                },100);
    //             };
    //         // key up event
    //         $textarea.keyup(eventFn);
    //         // mouse down event
    //         $textarea.mouseup (eventFn);
    //         return suggestion;
    //     }


    //     return function( $textarea ){
    //         LP.use(['textareaUtil','suggestion'] , function( textUtil , sug ){
    //             tUtil = textUtil ;
    //             BaseSelectPanel = sug;
    //             inputSuggestion( $textarea , {
    //                 regx : /^@([^\s,)(\]\[\{\}\\\|=\+\/\-~`!#\$%\^&\*\.:;"'\?><]){1,15}$/,
    //                 tag  : '@',
    //                 selectConfig : atSugConfig,
    //                 afterSelect : function(textarea , value , lastIndex , len){
    //                     tUtil.setText(textarea , value+" " , lastIndex + 1 , len - 1);
    //                 }
    //             });
    //         } )
    //     }
    // })();


    var globalVideos = [];
    var globalVideoInterval = [];

    var renderVideo  = (function(){
        var tpl = '<video id="#[id]" style="width: 100%;height: 100%;" class="video-js vjs-default-skin"\
                preload="auto"\
                  poster="#[poster]">\
                 <source src="#[videoFile].mp4" type="video/mp4" />\
                 <source src="#[videoFile].webm" type="video/webm" />\
                 <source src="#[videoFile].ogv" type="video/ogg" />\
            </video>';
        var vid = 0;
        return function( $wrap , videoFile , poster , cfg , cb , focus ){

            if( isMobile && !focus ){
				$wrap.addClass('m-videobg');
				$wrap.css({'background-image':'url('+poster+')'});
//                var $img = $('<img/>')
//                    .appendTo( $wrap )
//                    .load(function(){
//                        var $img = $(this);
//                        var w = $img.width();
//                        var h = $img.height();
//                        $(window).resize(function(){
//                            var ww = $wrap.width();
//                            var hh = $wrap.height();
//                            var tarw = w ,  tarh = h;
//                            if( ww / hh > w / h ){
//                                tarw = ww;
//                                tarh = h / w * ww;
//                            } else {
//                                tarh = hh;
//                                tarw = w / h * hh;
//                            }
//
//                            $img.css({
//                                'margin-top' : (hh - tarh) / 2,
//                                'margin-left' : (ww - tarw) / 2});
//                        }).trigger('resize');
//                    })
//                    .attr('src' , poster );
                return;
            }


            var id = 'my_video_' + ( vid++ );
            var resize = cfg.resize === undefined ? true : cfg.resize;

            var defaultConfig = { "controls": false, "autoplay": false, "preload": "auto", "loop": true, "children": {"loadingSpinner": false}};
            $wrap.append( LP.format( tpl , {id: id , poster: poster , videoFile: videoFile } ) );
            LP.use('video-js' , function(){
                videojs.options.flash.swf = "/js/video-js/video-js.swf";
                cfg = LP.mix(defaultConfig , cfg);
                var ratio = cfg.ratio || ( 516 / 893 );
                var myVideo = videojs( id , cfg , function(){
                    var v = this;
                    if( resize ){
                        $(window).bind( 'resize.video-' + id , function(){
                            if( v.isRemoved  ) return;
                            var w = $wrap.width()  ;
                            var h = $wrap.height() ;
                            var vh = 0 ;
                            var vw = 0 ;
                            if( h / w > ratio ){
                                vh = h + 40;
                                vw = vh / ratio;
                            } else {
                                vw = w + 40;
                                vh = vw * ratio;
                            }
                            v.dimensions( vw , vh );

                            $('#' + v.Q).css({
                                "margin-top": ( h - vh ) / 2,
                                "margin-left": ( w - vw ) / 2
                            });
                        }).trigger('resize');

                        if( $.browser.msie && $.browser.version <= 8 ){
                            setTimeout(function(){
                                $(window).trigger('resize');
                            } , 100);
                        }
                    }
                    var player = this;
                    // player.on('loadeddata' , function(){
                    //     player.play();
                    // });
                    // console.log( this.buffered().end() );
                    setTimeout( function(){
                        player.play();
                    } , 6000 );
                    // this.dine = function(){
                    //     clearInterval( timer );
                    // }
                    // if( this.ia == 'Html5' ){
                    //     var timer = setInterval( function(){
                    //         if( player.bufferedPercent() > 0.9 ){
                    //             player.play();
                    //             clearInterval( timer );
                    //         }
                    //     } , 1000 / 10 );
                    // } else {
                    //     this.play();
                    // }
                    cb && cb.call( this );
                } );
                // var index = globalVideos.length;
                // globalVideos[index] = 0;
//                globalVideoInterval[index] = setInterval( function(){
//                    globalVideos[index] = myVideo.bufferedPercent();
//                } , 100 );

//console.log( myVideo.bufferedPercent() );
                // var timer = setInterval( function(){

                //     console.log( myVideo.bufferedPercent() );
                //     return;
                //     if( myVideo.bufferedPercent() > 0.9 ){
                //         myVideo.play();
                //         clearInterval( timer );
                //     }
                // } , 1000 / 1 );
                
                //myVideo.muted( true );
                $wrap.data('video' , myVideo);
            });
        }
    })();

    // count down function 
    var countDownMgr = (function(  ){
        var colClass = "countdown-col";
        var groupClass = "countdown-group";
        var itemHeight = 0;
        // 8
        // 9
        // 0
        var initCol = function ( $dom , max , origin ){
            var htmls = [];
            var height = itemHeight = $dom.height();

            //save data to dom
            $dom.data( 'max' , max )
                .data( 'num' , origin )
                .data( 'height' , height )
                .addClass( groupClass );


            // build html
            $.each( (max + '').split("") ,  function( i , num ){
                var max = i == 0 ? num : 9;
                var inner = [];
                inner.unshift( '<div>0</div>') ;
                inner.unshift( '<div> ' + max + ' </div>') ;

                var tmp = max;
                while( tmp-- ){
                    inner.unshift( '<div> ' + tmp + ' </div>') ;
                }

                htmls.push( '<div class="' + colClass + '" data-max="' + max + '" >' + inner.join("") + '</div>' );
            });

            $dom.html( htmls.join("") );

            // set origin
            var originArr = (origin + "").split("");
            var $cols = $dom.children().css({
                float: "left"
            });

            if( originArr.length < $cols.length ){
                for( var i = 0 ;  i < $cols.length - originArr.length ; i ++ ){
                    originArr.unshift( 0 );
                }
            }

            for( var i = originArr.length - 1 ; i >= 0 ; i -- ){
                var $col = $cols.eq( $cols.length - ( originArr.length - i ) );
                var ch = (originArr[ i ] == 0 ? - ( ~~$col.data('max') + 1 ) : - originArr[ i ]) * height;
                $col.children().first().css( "margin-top" , ch )
                    .parent().data('num' , originArr[ i ]);
            }
        }
        var reduce = function ( $dom ){
            var height = itemHeight;
            var num = $dom.data('num');
            var next = num - 1 < 0 ? $dom.data('max') : num - 1;
            var nextArr = (next + "").split("");
            var $cols = $dom.children();
            if( nextArr.length < $cols.length ){
                for( var i = 0 ;  i < $cols.length - nextArr.length ; i ++ ){
                    nextArr.unshift( 0 );
                }
            }

            for( var i = nextArr.length - 1 ; i >= 0 ; i -- ){
                !!(function( i ){
                    var ch = - nextArr[ i ] * height;
                    var $col = $cols.eq( $cols.length - ( nextArr.length - i ) );
                    
                    if ( $col.data( 'num' ) != nextArr[ i ] ){
                        // change to it's last num
                        $col.children().first().css('margin-top' , ch - height ).animate({
                                "margin-top" : ch
                            } , 500 , '' , function(){
                                if( ch == 0 ){
                                    $(this).css('margin-top' , - (~~$(this).parent().data('max') + 1) * height);
                                }
                                $(this).parent().data('num' , nextArr[ i ]);
                                $dom.data('num' , next);
                            });
                    }
                })( i );
            }

            // reduce prev one
            if( num - 1 < 0 ){
                reduce( $dom.prevAll( "." + groupClass ).first() );
            }
        }

        var interval = null;
        return {
            init: function( $doms , maxs , origins ){
                clearInterval( interval );
                $(window).unbind('resize.countdown').bind('resize.countdown' , function(){
                    $doms.each( function( i ){
                        initCol( $(this) , maxs[i] , $(this).data('num') );
                    } );
                });

                //$doms = $doms.eq(0);
                $doms.each( function( i ){
                    initCol( $(this) , maxs[i] , origins[i] );
                } );

                // start animate
                interval = setInterval(function(){
                    reduce( $doms.last() );
                } , 1000);
            },

            initCountDown: function(){
                 api.get('/api/web/time' , function( e ){
                    var times = e.data.time_start.split(/[- :]/);
                    var start = new Date(times[0] , times[1] - 1 , times[2], times[3], times[4], times[5]);
                    times = e.data.time_now.split(/[- :]/);
                    var now = new Date(times[0] , times[1] - 1 , times[2], times[3], times[4], times[5]);

                    var dura = ~~( ( start - now ) / 1000 );
                    var d = ~~( dura/86400 );
                    var h = ~~( ( dura - d * 86400 ) / 3600 );
                    var m = ~~( ( dura - d * 86400 - h * 3600 ) / 60 );
                    var s = dura - d * 86400 - h * 3600 - m * 60;

                    countDownMgr.init( $(".conut_downitem" ) , [ 99 , 23 , 59 , 59 ] , [ d , h , m , s ] );
                });

                setTimeout(function(){
                    countDownMgr.initCountDown();
                } , 30 * 1000);
            }
        }
    })();


    var bigVideoInit = function(){ 
        var ratio = 516 / 893;
		var videoname = $('body').data('page');

        renderVideo( $('<div></div>').css({
            "position": "fixed",
            "z-index": "-1",
            "top": "0",
            "left": "0",
            "height": "100%",
            "width": "100%",
            "overflow": "hidden"
        }).appendTo( $('.page').css('background' , 'none') ) , "/videos/"+videoname , "/videos/"+videoname + '.jpg' ,  {muted:1} );
        // // init video
        // var ratio = 516 / 893;
        // LP.use('video-js' , function(){
        //     videojs.options.flash.swf = "./js/video-js.swf";
        //     var myVideo = videojs("bg_video_1", { "controls": false, "autoplay": true, "preload": "auto","loop": true, "children": {"loadingSpinner": false} } , function(){
        //       // Player (this) is initialized and ready.
        //       console.log( this);
        //     });

        //     $(window).resize(function(){
        //         var w = $(window).width();
        //         var h = $(window).height();
        //         var vh = 0 ;
        //         var vw = 0 ;
        //         if( h / w > ratio ){
        //             vh = h;
        //             vw = h / ratio;
        //         } else {
        //             vh = w * ratio;
        //             vw = w;
        //         }

        //         console.log( myVideo );
        //         myVideo.dimensions( vw , vh );

        //         $('#bg_video_1').css({
        //             "margin-top": ( h - vh ) / 2,
        //             "margin-left": ( w - vw ) / 2
        //         })
        //     }).trigger('resize');

        // });
    }



    // page actions here
    // ======================================================================
    LP.action("login" ,function(){
        api.ajax( "login" , $(this).closest('form').serialize() , function( ){

        } );
        return false;
    });

    LP.action('logout' , function(){
        api.ajax('/api/user/logout', function(){
            window.location.href = '/';
        });
        return false;
    })

    LP.action("member_invent" , function(){
        var $_btn = $(this).attr('disabled' , 'disabled');
        LP.panel({
            content: '<div class="popup_invite">\
                    <div class="popup_close"></div>\
                    <div class="popup_invite_search"><a class="close-search" href="javascript:;">×</a><input type="text" placeholder="'+ _e('Invite a friend') + '"/> <a href="javascript:void(0);" class="search-btn">'+ _e('Search') + '</a></div>\
                    <div class="popup_invite_friend_list"></div>\
                    <div class="popup_search_friend_list"></div>\
                    <div class="loading-wrap"><div class="loading"></div></div>\
                    <div class="cs-clear"></div>\
                    <div class="popup_invite_btns" style="position:relative;">\
                        <p class="popup_error">&nbsp;</p>\
                        <a href="javascript:void(0);" class="disabled">' + _e('Ok') + '</a>\
                    </div>\
                </div>',
            title: '',
            width: isMobile ? 600 : 920,
            height: 408,
            onload: function() {
                $_btn.removeAttr( 'disabled' );

                var panel = this;
                var uTpl = '<div class="friend_item" data-uuid="#[uuid]">\
                        <div class="avatar"><img src="#[avatar]"></div>\
                        <div class="name">@#[name]</div>\
                        <div class="btns">\
                            <div class="selected" data-name="#[name]" style="display:none;"></div>\
                            <div class="send" >' + _e('Send Invitation') + '</div>\
                        </div>\
                    </div>';


                var loadFriends = function( page ){
                    if( next_cursor == -1 ) return;
                    isLoading = true;
                    panel.$panel.find('.loading-wrap').show();
                    // load user list from sina weibo or twitter
                    api.get("/api/user/friends" , next_cursor == -2 ? '' : { next_cursor: next_cursor } , function( e ){
                        next_cursor = e.ext.next_cursor;
                        panel.$panel.find('.loading-wrap').hide();

                        if( isMobile ){
                            var $list = panel.$panel.find('.popup_invite_friend_list');
                        } else {
                            var $list = panel.$panel.find('.popup_invite_friend_list .jspPane');
                        }
                        $.each( e.data , function( i , user ){
                            var $friend = $(LP.format( uTpl , {avatar: user.avatar_large , name: user.screen_name , uuid:user.uuid} ))
                                .css({top:-30 , opacity: 0 , 'position': 'relative'});
                            setTimeout(function(){
                               $friend.appendTo( $list )
                                    .animate({
                                        top: 0,
                                        opacity: 1
                                    } , 100);
                           } , i * 100 );
                        } );

                        setTimeout( function(){isLoading = false;} , 100 * e.data.length );
                    } , null, function(){
                        
                    });
                }

                //  ssearch component
                var $search = panel.$panel.find('.popup_invite_search input')
                    .keyup(function( ev ){
                        if( this.value ){
                            panel.$panel.find('.close-search').fadeIn();
                        } else {
                            panel.$panel.find('.close-search').fadeOut();
                        }
                        if( ev.which == 13 ){
                            panel.$panel.find(".search-btn").trigger('click');
                        }
                    });
                initPlaceHoler( $search );
                var floading = false;
                panel.$panel.find(".search-btn").click(function(){
                    if( floading ) return false;
                    var val =  getPlaceHolderValue( $search );
                    if( !val ){
                        $search.focus();
                        return false;
                    }
                    floading = true;
                    panel.$panel.find('.loading-wrap').show();
                    api.get('/api/user/searchfriends' , {q: val} , function( e ){
                        panel.$panel.find('.loading-wrap').fadeOut();

                        panel.$panel.find('.popup_invite_friend_list').hide();
                        panel.$panel.find('.popup_search_friend_list').show();
                        if( isMobile ){
                            var $list = panel.$panel.find('.popup_search_friend_list');
                        } else {
                            var $list = panel.$panel.find('.popup_search_friend_list .jspPane').html('');
                        }
                        $.each( e.data , function( i , user ){
                            var $friend = $(LP.format( uTpl , {avatar: user.avatar_large , name: user.screen_name , uuid:user.uuid} ))
                                .css({top:-30 , opacity: 0 , 'position': 'relative'});
                            setTimeout(function(){
                               $friend.appendTo( $list )
                                    .animate({
                                        top: 0,
                                        opacity: 1
                                    } , 100);
                           } , i * 100 );
                        } );

                        setTimeout( function(){floading = false;} , 100 * e.data.length );
                    });
                });

                panel.$panel.find(".close-search").click(function(){
                    $search.val('');
                    panel.$panel.find('.popup_invite_friend_list').show();
                    panel.$panel.find('.popup_search_friend_list').hide();
                    $(this).fadeOut();
                });


                if( !isMobile ){
                    LP.use(['jscrollpane' , 'mousewheel'] , function(){
                        $('.popup_invite_friend_list,.popup_search_friend_list').jScrollPane({autoReinitialise:true}).bind(
                            'jsp-scroll-y',
                            function(event, scrollPositionY, isAtTop, isAtBottom){
                                if( !hasMore || isLoading ) return;
                                if( isAtBottom ){
                                    loadFriends( next_cursor );
                                }
                                // if(isAtBottom) {
                                //     var commentParam = $('.comment-wrap').data('param');
                                //     getCommentList(node.nid,commentParam.page + 1);
                                // }
                            }
                        );
                        loadFriends( );
                    });
                } else {
                    loadFriends( );
                    // bind scroll event to load friend
                    $('.popup_invite_friend_list').scroll(function(){
                        if( !hasMore || isLoading ) return;

                        var scrollTop = $(this).scrollTop();
                        var height = $(this).height();
                        if( this.scrollHeight - scrollTop - height < 100 )
                            loadFriends( next_cursor );
                    });
                }
                
                

                var hasMore = true;
                var isLoading = false;
                var next_cursor = -2;

                panel.$panel.find('.popup_invite').delegate(".send" , 'click' , function(){
                    if( $(this).closest('.popup_invite').find(".selected.show").length
                        >= $('.teambuild_member .member_add').length ){
                        panel.$panel.find('.popup_error').html(_e('You can\'t invite too many people '));
                        setTimeout(function(){panel.$panel.find('.popup_error').html('')} , 5000);
                        return false;
                    }
                    panel.$panel.find('.popup_error').html('');
                    $(this).hide().prev().show().addClass('show');

                    // btn status
                    panel.$panel.find('.popup_invite_btns a')
                        .removeClass('disabled');
                })
                .delegate(".selected" , "click" , function(){
                    $(this).hide().removeClass('show').next().show();
                    panel.$panel.find('.popup_error').html('');
                    if( !panel.$panel.find('.popup_invite .selected.show').length ){
                        // btn status
                        panel.$panel.find('.popup_invite_btns a')
                            .addClass('disabled');
                    }
                });
                // .bind('scroll' , function(){
                //     if( !hasMore || isLoading ) return;

                //     var scrollTop = $(this).scrollTop();
                //     var height = $(this).height();
                //     if( this.scrollHeight - scrollTop - height < 100 )
                //         loadFriends( next_cursor );
                // });

                panel.$panel.find('.popup_close')
                    .click( function(){
                        panel.close();
                    });

                // set invite
                panel.$panel.find('.popup_invite_btns a')
                    .click(function(){
                        if( $(this).hasClass('disabled') ) return false;
                        var $btn = $(this).addClass('disabled');

                        panel.$panel.find('.loading-wrap').show();
                        // get user list
                        var users = [];
                        var us = [];
                        $('.popup_invite .selected.show').each(function(){
                            users.push( '@' + $(this).data('name') );
                            var $p = $(this).closest('.friend_item');
                            us.push( {
                                'avatar' : $p.find('.avatar img').attr('src'),
                                'name' : $p.find('.name').html().replace('@' , ''),
                                'uuid' : $p.data('uuid')
                            } );
                        });

                        if( !users.length ) return false;
                        //p1
                        api.post( '/api/user/invite' , {msg: (window.from == 'weibo' ? '加入我的队伍吧！@保时捷 邀你参加#勒芒社交耐力赛#。以微博之名，助力勒芒竞赛。' : 'Join my team! @Porsche introduces #24SocialRace; the better you\'ll tweet, the faster you\'ll go! ' ) + users.join(" ")} , function(){
                            $.each( us , function( i , u ){
                                // add user to panel
                                $(LP.format('<div class="member_item ">\
                                        <img src="#[avatar]" />\
                                        <p class="member_name"><span class="member_name_span">@#[name]<br/></span><span class="cancel-invit" style="display:none;cursor:pointer;" data-d="uuid=#[uuid]" data-a="cancel-invit">' + _e('Cancel Invitation') + '</span></p>\
                                    </div>' , u ))
                                    .insertBefore( $('.teambuild_member .member_add').eq(0) )
                                    .parent()
                                    .addClass('stand_inviting')
                                    .find('.member_add')
                                    .remove();
                            } );
                            

                            panel.close();
                        } , null ,  function(){
                            $btn.removeClass('disabled');
                            panel.$panel.find('.loading').hide();

                        } );
                    });
            },
            onSubmit: function(){
                // var $input = this.$panel.find('input[name="email"]');
                // var email = $input.val();
                // if( !email.match( /^[a-zA-Z_0-9][a-zA-Z\-_.0-9]@([a-zA-Z\-_0-9]+\.)+[a-zA-Z]+$/) ){
                //     $input.css('border-color' , 'red');
                // } else {
                //     $input.css('border-color' , '');
                // }
                // var msg = this.$panel.find('textarea').val();
                // api.post( '/api/user/invite' , {msg: msg,email:email} , function(){
                //     LP.right('success');
                // });
            }
        });
    });


    LP.action('show-menu' , function( data ){
        var left = parseInt( $('.nav').css('left') );
        data = data || {};
        if( data.d == 'left' && left != 0 ) return;
        if( data.d == 'right' && left == 0 ) return;

        // push all content to right
        $('.page').width( $('.page').width() );

        $('.stand').animate({
            marginLeft: left >= 0 ? 0 : 250
        } , 400);

        $('.nav').animate({
            left: left >= 0 ? -250 : 0
        } , 400);
    });


    LP.action("post_weibo" , function( data ){
        if( $(this).attr('disabled') ) return false;
        var $btn = $(this).attr('disabled' , 'disabled');
        var max_length = 112;
		var html_buttons = '<a href="javascript:void(0);" class="p-cancel">' + _e('Cancel') + '</a> <a href="javascript:void(0);" class="p-confirm">' + _e('Confirm') + '</a>';
//		if(lang == 'zh_cn') {
//			html_buttons = '<a href="javascript:void(0);" class="p-confirm">' + _e('Confirm') + '</a> <a href="javascript:void(0);" class="p-cancel">' + _e('Cancel') + '</a>';
//		}
        LP.panel({//p1
            content: '<div class="popup_dialog popup_post" style="width:auto;">\
            <div class="popup_dialog_msg" style="height:110px;width: auto;">\
                <textarea style="overflow:auto;">' + (window.from == 'weibo' ? '#勒芒社交耐力赛# @保时捷' : '#24SocialRace @Porsche' ) + '</textarea>\
            </div><div class="alert-message clearfix"><div class="msg"></div><div class="msg-sug"><span class="s1">10</span>/<span class="s2">' + max_length + '</span></div></div>\
            <div class="popup_dialog_btns">' + html_buttons +
                '<span class="loading"></span>\
            </div>\
            <div class="popup_dialog_status">\
                <span>' + _e('Success!') + '</span>\
            </div>',
            title: "",
            width: 604,
            height: 252,
            onShow: function(){
                $btn.removeAttr('disabled');
                var panel = this;
                this.$panel.find('.p-cancel')
                    .click(function(){
                        panel.close();
                    });

                var $textarea = panel.$panel.find('textarea');
                $textarea.bind("keydown", function (event) {
                  var self = $(this);
                  var length = self.val().length;
                  panel.$panel.find(".msg-sug .s1").html(length);
                  if (length >= max_length) {
                    var keycode = event.which;
                    if (keycode != 8) {
                      //panel.$panel.find(".alert-message .msg").html(_e("Max length of twitte is " + max_length));
                      panel.$panel.find(".alert-message .msg").html(_e("Maximum number of characters attained"));
                      event.preventDefault();
                      return false;
                    }
                  }
                  else {
                    panel.$panel.find(".alert-message .msg").html("");
                  }
                }).trigger('keydown');
                this.$panel.find('.p-confirm')
                    .click(function(){
						if($(this).hasClass('disable')) {
							return;
						}
                        var msg = $textarea.val();
                        if (msg.length > max_length) {
                          return false;
                        }
						$(this).addClass('disable');
						$(this).next().fadeIn();
                        api.post( '/api/twitte/post' , {msg: msg, "from": "web"} , function(){
							var height = panel.$panel.find('.popup_dialog').height();
							panel.$panel.find('.popup_dialog').height(height);
							panel.$panel.find('.popup_dialog_btns').fadeOut();
							panel.$panel.find('.popup_dialog_status').delay(500).fadeIn(function(){
                            	setTimeout(function(){
									panel.close();
								}, 500);
							});
                        } );
                    }) ;
            }
            // ,
            // onSubmit: function(){
            //     var msg = this.$panel.find('textarea').val();
            //     api.post( '/api/twitte/post' , {msg: msg, "from": "web"} , function(){
            //         LP.right('success');
            //     } );
            // }
        });

        return false;
    });
    
    LP.action('start-tutr' , function(){
        if( $(document.body).data('page') != 'stand' ){
            // set cookit 
            LP.setCookie('_t_' , 1);
        } else {

			$('.page').css({'overflow':'visible','overflow-x':'visible'});
            animateTure.showStep( 1 );
            return false;
        }
    });

    LP.action('preview' , function( data ){

        var media = $(this).closest('.fuelitem').data('media');
        
        // show big pic or big video
        var tpls = {
            'video': '<div class="popup_fuel">\
                    <div class="popup_close"></div>\
                    <div class="popup_fuel_video">\
                        <h4>#[title]</h4>\
                        <div class="popup_image_wrap"><img src="#[imgsrc]"/></div>\
                    </div>\
                    <div class="popup_fuel_btns">\
                        <a class="repost" data-img="#[imgsrc]" data-d="#[mid]" data-a="repost" href="#">' + _e('Repost') + '</a>\
                    </div>\
                </div>',
            'image': '<div class="popup_fuel" >\
                <div class="popup_close"></div>\
                <div class="popup_fuel_photo_left">\
                    <div class="popup_image_wrap"><img src="#[imgsrc]"/></div>\
                </div>\
                <div class="popup_fuel_photo_right">\
                    <h4>#[title]</h4>\
                    <div class="popup_fuel_photo_description">\
                        #[description]\
                    </div>\
                    <div class="popup_fuel_btns">\
                        <a class="repost" data-img="#[imgsrc]" data-d="#[mid]" data-a="repost" href="#">' + _e('Repost') + '</a>\
                    </div>\
                </div>\
                <div class="cs-clear"></div>\
            </div>'
        };

        var $img = $(this)
            .closest('.fuelitem')
            .children('img');
        var self = $(this);
        
        // var imgH = $img.height();
        // var imgW = $img.width();
        var video = $(this).closest('.fuelitem').data('video');

        // init panel width and height
        // var $img = $('<img/>')

        var content = LP.format(video ? tpls['video'] : tpls['image'] , {imgsrc: $img.attr('src') , mid: data.mid , title: media.title , description: media.description});
        LP.panel({
            content: content,
            //title: "share the content",
            title: '',
            height: 'auto',
            width: 'auto',
            onShow: function(){
                this.$panel.find('.lpn_panel')
                    .css({
                        'margin-top': '-50%',
                        'opacity' : 0
                    })
                    .animate({
                        marginTop: 0,
                        opacity: 1
                    } , 500 , 'easeOutQuart' , function(){
                        var imgH = $('.popup_image_wrap img').height();
                        var imgW = $('.popup_image_wrap img').width();
                        if( video ){ // play the video
                            $('.popup_image_wrap img').hide();
                            renderVideo( $('.popup_image_wrap').css({width: imgW , height: imgH + 30}) , video.replace(/\.\w+$/ , '') , $img.attr('src') ,  {
                                controls: true,
                                resize: false
                            } );
                        }

                        $(window).on('resize.fixfuel' , function(){
                            var maxH = $(window).height() - 20;
                            var maxW = $(window).width() - 20;
                            var tarW = imgW , tarH = imgH;
                            if( maxH / maxW > imgH / imgW && maxW < imgW ){
                                tarH = imgH / imgW * maxW;
                                tarW = maxW;
                            } else if( maxH / maxW < imgH / imgW && maxH < imgH ){
                                tarW = imgW / imgH * maxH;
                                tarH = maxH;
                            }

                            // resize the panel
                            //panel.resize( tarW , tarH );
                        });
                    } );

                var panel = this;

                this.$panel.find('.popup_close')
                    .click(function(){
                      console.log(panel);
                        panel.close();
                    });
            },
            onBeforeClose: function(){
                var $panel = this.$panel;
                // unbind event
                $(window).off('resize.fixfuel');
                return true;
            },
            onSubmit: function(){
              //
            }
        });
    });

    LP.action('repost' , function( data ){
      var self = $(this);
      var max_length = 112;
      var share_text = "They’re watching you! Share image for getting more fuel for your race ";
		var html_buttons = '<a class="p-cancel" href="javascript:void(0);">' + _e('Cancel') + '</a><a class="p-confirm" href="javascript:void(0);">' + _e('Confirm') + '</a>';
//		if(lang == 'zh_cn') {
//			var html_buttons = '<a class="p-confirm" href="javascript:void(0);">' + _e('Confirm') + '</a><a class="p-cancel" href="javascript:void(0);">' + _e('Cancel') + '</a>';
//		}
        var tpl = '<div class="popup_dialog popup_post popup_post_with_photo">\
                    <div class="popup_dialog_msg">\
                        <div class="popup_post_photo"><img src="#[imgsrc]" /></div>\
                        <textarea>' + _e(share_text) + '</textarea>\
                    </div><div class="alert-message clearfix"><div class="msg"></div><div class="msg-sug"><span class="s1">'+share_text.length+'</span>/<span class="s2">' + max_length + '</span></div></div>\
                    <div class="popup_dialog_btns">'+html_buttons+'<span class="loading"></span></div><div class="popup_dialog_status"><span>' + _e('Success!') + '</span></div>\
                </div>';

        LP.panel({
            content: LP.format( tpl , {imgsrc: $(this).data('img')}),
            title: "",
            onload: function(){
                var panel = this;
                var loading = panel.$panel.find(".loading");
                
                var $textarea = panel.$panel.find('textarea');
                $textarea.bind("keydown", function (event) {
                  var self = $(this);
                  var length = self.val().length;
                  panel.$panel.find(".msg-sug .s1").html(length);
                  if (length >= max_length) {
                    var keycode = event.which;
                    if (keycode != 8) {
                      //panel.$panel.find(".alert-message .msg").html(_e("Max length of twitte is " + max_length));
                      panel.$panel.find(".alert-message .msg").html(_e("Maximum number of characters attained"));
                      event.preventDefault();
                      return false;
                    }
                  }
                  else {
                    panel.$panel.find(".alert-message .msg").html("");
                  }
                }).trigger('keydown');
                
                panel.$panel.find('.popup_dialog_btns .p-cancel')
                    .click(function() {
                        panel.close();
                    })
                    .end()
                    .find('.popup_dialog_btns .p-confirm')
                    .click(function(){
                        var msg = panel.$panel.find('textarea').val();
                        loading.css("display", "block");
                        api.post( '/api/media/share' , {share_text: msg , media_id: self.data("d")} , function(){
                            //LP.right('success');
                            loading.css("display", "none");
                            var height = panel.$panel.find('.popup_dialog').height();
                            panel.$panel.find('.popup_dialog').height(height);
                            panel.$panel.find('.popup_dialog_btns').fadeOut();
                            panel.$panel.find('.popup_dialog_status').delay(500).fadeIn(function(){
                              setTimeout(function(){
                                            panel.close();
                              }, 500);
                            });
                        }, function () {
                          panel.close();
                        });
                    });
            }
        });
    });

    var fuelPage = 0;
    LP.action('fuel-load' , function( data ){
        $(this).attr('disabled' , 'disabled');
        var page = ++fuelPage;

        $('.fuel .loading').show();
        $(this).data( 'page' , fuelPage );

        api.get('/api/media/list' , { page:page } , function( e ){
            $('.fuel .loading').hide();
            //  render fuel item
            $.each( e.data || [] , function( i , data ){
              if (data["type"] == "video") {
                data["video"] = 1;
              }
                LP.compile('fuel-tpl' , data , function( html ){
                    $( html ).appendTo( $('.fuellist') ).data( 'media' , data );
                    if (i >= e.data.length - 1) {
                      callback();
                    }
                });
                
            } );
            
            function callback(){
              $(this).removeAttr('disabled');

              LP.use('isotope' , function(){
                 // first init isotope , render no animate effect
                 $('.fuellist')
                     .isotope({
                         resizable: false
                     });
              });
            }
        });
        return false;
    });


    LP.action('legal-mentions' , function( data ){
        // fix scroll
        // $('#legal-notice').fadeIn( function(){
        //     // if( !this.getAttribute('init') ){
        //     //     this.setAttribute('init' , 1);
        //     //     LP.use('jscrollpane' , function(){
        //     //         $('.legal-con').jScrollPane();    
        //     //     });
        //     // }
        // } );

		renderVideo( $('<div></div>').css({
			"position": "absolute",
			"z-index": "-1",
			"top": "0",
			"left": "0",
			"height": "100%",
			"width": "100%",
			"overflow": "hidden"
		}).addClass('videobg').appendTo( $('#legal-notice') ) , "/videos/index" , "/videos/index.jpg" ,  {muted:1} , function(){

        });
		setTimeout(function(){
			$('#legal-notice').fadeIn();

            if( !isMobile ){
                // set js scroll bar
                LP.use(['jscrollpane' , 'mousewheel'] , function(){
                    $('#legal-notice .legal-con').jScrollPane({autoReinitialise:true});
                });
            }
			$(window).trigger('resize');
		} , 200);
    });

	LP.action('winners-prizes' , function( data ){
		
		renderVideo( $('<div></div>').css({
			"position": "fixed",
			"z-index": "-1",
			"top": "0",
			"left": "0",
			"height": "100%",
			"width": "100%",
			"overflow": "hidden"
		}).addClass('videobg').appendTo( $('#winners-prizes').css('background' , 'none') ) , "/videos/winner" , "/videos/winner.jpg" ,  {muted:1} , function(){

        } );
		setTimeout(function(){
			$('#winners-prizes').fadeIn();
			$(window).trigger('resize');
		} , 200);
	});

    LP.action('skip-intro' , function(data){
        $('#home_video').fadeOut(function(){
            var video = $(this).find('.video-js')
                .parent()
                .data('video');

            video.isRemoved = true;
            video.pause();
            video.dispose();
            
            $(this).find( '.video-js' )
                .parent().removeData( 'video' );
            $(window).unbind( 'resize.video-' + video.Q );
            $(this).remove();
        } );
    });


    // LP.action('mobile_home_v' , function(){
    //     // renderVideo( $('#home_video').show() , "/videos/intro" , /*"/videos/small.png"*/ '' ,  {ratio: 516 / 893 , loop: false} , function(){
    //     //     $('#' + this.Q).css('z-index' , 0);
    //     //     this.on('ended' , function(){
    //     //         LP.triggerAction('skip-intro');
    //     //     });
    //     // } );
    //     videojs( id 
    // });

    LP.action('leaveteam' , function( e ){
        var self = $(this);
		var html_buttons = '<a class="p-cancel" href="javascript:void(0);">' + _e('Cancel') + '</a><a class="p-confirm" href="javascript:void(0);">' + _e('Confirm') + '</a>';
//		if(lang == 'zh_cn') {
//			html_buttons = '<a class="p-confirm" href="javascript:void(0);">' + _e('Confirm') + '</a><a class="p-cancel" href="javascript:void(0);">' + _e('Cancel') + '</a>';
//		}
        var tpl = '<div class="popup_box popup_dialog">\
                <div class="popup_dialog_msg">#[content]</div>\
                <div class="popup_dialog_btns">'+html_buttons+'</div>\
            </div>';
        LP.panel({
            title: '',
            content: LP.format( tpl , {content: _e('do you want to leave the team?')} ),
            onShow: function(){
                var panel = this;
                this.$panel.find('.popup_dialog_btns .p-cancel')
                    .click(function(){
                        panel.close();
                    })
                    .end()
                    .find('.popup_dialog_btns .p-confirm')
                    .click(function(){
                        api.get("/api/user/leaveteam", function ( e ) {
                           //TODO:: 动画效果
                           panel.close("fast");
							window.location.reload();
                        });
                    });
            }
        });
    });
    
    LP.action("invite_box_with_auto_join", function (params) {
	  var html_buttons = '<a href="javascript:void(0);" class="cancel">'+_e("Cancel")+'</a><a href="javascript:void(0);" class="confirm">'+_e("Confirm")+'</a>';
//	  if(lang == 'zh_cn') {
//		  var html_buttons = '<a href="javascript:void(0);" class="confirm">'+_e("Confirm")+'</a><a href="javascript:void(0);" class="cancel">'+_e("Cancel")+'</a>';
//	  }
      LP.panel({
        type: "panel",
        "content": '<div class="popup_box popup_dialog"><div class="popup_dialog_msg">' + _e('You already have team #[now_team_name], Are you want to join team #[team] ? If that, the record in the your team will be destoried.' ,{team: params["team_name"], now_team_name: params["now_team_name"]}) + '</div><div class="popup_dialog_btns">'+html_buttons+'</div></div>',
        "title": "",
        mask: true,
        destroy: true,
        submitButton: false,
        cancelButton: false,
        closeAble: false,
        onShow: function () {
          var panel = this;
          this.$panel.find(".cancel").click(function () {
            api.post("/api/user/jointeam", {"owner": 0}, function(e) {
              if (e["status"] == 0) {
                panel.close();
                window.location.reload();
              }
            });
            panel.close();
          });
          this.$panel.find(".confirm").click(function () {
            api.post("/api/user/jointeam", {"team_id": params["team_id"]}, function(e) {
              if (e["status"] == 0) {
                panel.close();
                window.location.reload();
              }
            });
          });
        },
        onSubmit: function () {
          
        },
        onCancel: function () {

        },
        width: $(window).width() * 0.6
      });
    });
    
    LP.action("invite_box", function(params) {
      var html_buttons = '<a href="javascript:void(0);" class="cancel">'+_e("Cancel")+'</a><a href="javascript:void(0);" class="confirm">'+_e("Confirm")+'</a>';
//	  if(lang == 'zh_cn') {
//		  html_buttons = '<a href="javascript:void(0);" class="confirm">'+_e("Confirm")+'</a><a href="javascript:void(0);" class="cancel">'+_e("Cancel")+'</a>';
//	  }
      LP.panel({
        type: "panel",
        "content": '<div class="popup_box popup_dialog"><div class="popup_dialog_msg">' + _e('Do you want to join #[team] ?' ,{team: params["team_name"]}) + '</div><div class="popup_dialog_btns">'+html_buttons+'</div></div>',
        "title": "",
        mask: true,
        destroy: true,
        submitButton: false,
        cancelButton: false,
        closeAble: false,
        onShow: function () {
          var panel = this;
          this.$panel.find(".cancel").click(function () {
            api.post("/api/user/jointeam", {"owner": 0}, function(e) {
              if (e["status"] == 0) {
                panel.close();
                window.location.reload();
              }
            });
            panel.close();
          });
          this.$panel.find(".confirm").click(function () {
            api.post("/api/user/jointeam", {"team_id": params["team_id"]}, function(e) {
              if (e["status"] == 0) {
                panel.close();
                window.location.reload();
              }
            });
          });
        },
        onSubmit: function () {
          
        },
        onCancel: function () {

        },
        width: $(window).width() * 0.6
      });
    });
    
    
    LP.action('cancel-invit' , function( data ){
        var $dom = $(this).closest('.teambuild_member ');
        api.post('/api/user/cancelinvite' , {uuid: data.uuid} , function(){
            $dom.children().fadeOut( function(){
                $dom.html( '<a href="javascript:;" data-a="member_invent" class="member_add cs-clear"><span>+</span></a>' )
                    .removeClass('stand_inviting')
                    .css('opacity' , 1);
            } );
        });
    });


    LP.action('close-share' , function(){
        $('#share .share-btns').fadeOut();
    });



    // for monition here
    LP.action('mo-retweet' , retweetMonitoring);
    LP.action('mo-comment' , commentMonitoring);


    // page init here
    // =======================================================================
	var isComplete = false;
	var initComplete = function(){
		if(isComplete) return;
        isComplete = true;
		$('.loading-wrap').fadeOut(function(){
            $(this).remove();
        });

		/* for animation */
		var isUglyIe = $.browser.msie && $.browser.version <= 8;
		if(isUglyIe && $('#scheme').length > 0)
			return;
		var ANIMATE_NAME = "data-animate";
		$('[' + ANIMATE_NAME + ']')
			.each(function(){
				var $dom = $(this);
				var tar = $dom.data('animate');
				var browser = $dom.data('browser');
				var style = $dom.data('style');
				var time = parseInt( $dom.data('time') );
				var delay = $dom.data('delay') || 0;
				var easing = $dom.data('easing');
				var begin = $dom.data('begin');
				tar = tar.split(';');
				var tarCss = {} , tmp;
				if(browser == 'uglyie' && isUglyIe) {
					return;
				}
				for (var i = tar.length - 1; i >= 0; i--) {
					tmp = tar[i].split(':');
					if( tmp.length == 2 )
						tarCss[ tmp[0] ] = $.trim(tmp[1]);
				}
				if( isUglyIe && tarCss.opacity !== undefined ){
					delete tarCss.opacity;
				}


				style = style.split(';');
				var styleCss = {} , tmp;
				for (var i = style.length - 1; i >= 0; i--) {
					tmp = style[i].split(':');
					if( tmp.length == 2 )
						styleCss[ tmp[0] ] = $.trim(tmp[1]);
				}
				if( isUglyIe && styleCss.opacity !== undefined ){
					delete styleCss.opacity;
				}
				$dom.css(styleCss).delay( delay )
					.animate( tarCss , time , easing );
				if( begin ){
					setTimeout(function(){
						animation_begins[begin].call( $dom );
					} , delay);
				}
			});
	}

    // page load event
    $(document.body).queryLoader2({
        onLoading : function( percentage ){
            var per = parseInt(percentage);
            $('.loading-percentage').html(per+'%');
            $('.loading-bar').css({'width':per+'%'});
            if(per == 100) {
				initComplete();
//                var timer = setInterval(function(){
//                    if( globalVideos.length == 0 ) return ;
//                    var total = 0;
//                    $.each( globalVideos , function( i , buff){
//                        total += buff;
//                    } ) ;
//
//                    if( total >= globalVideos.length / 10){
//                        initComplete();
//                        $.each( globalVideoInterval , function( i , intval ){
//                            clearInterval( intval );
//                        } );
//                        clearInterval( timer );
//                    }
//                } , 100);
            }
        },
        onComplete : function(){
			initComplete();

            // load all the video
//            var timer = setInterval(function(){
//                if( globalVideos.length == 0 ) return ;
//                var total = 0;
//                $.each( globalVideos , function( i , buff){
//                    total += buff;
//                } ) ;
//                if( total >= globalVideos.length / 10){
//                    initComplete();
//                    $.each( globalVideoInterval , function( i , intval ){
//                        clearInterval( intval );
//                    } );
//                    clearInterval( timer );
//                }
//            } , 100);
        }
    });

    $(function(){

        // init all pages fadein element 
        $('[data-fadein]').hide().each( function( i ){
            $(this).delay( i * 300 ).fadeIn( 800 );
        } );

        // lang swither
        $("a").click(function () {
            var self = $(this);
            if (self.attr("data-lang")) {
                LP.setCookie("lang", self.attr("data-lang"), 3600 * 24, "/");
                window.location.reload();
            }
        });

        // login
        $('.login_tips').live('click',function(){
            $(this).hide()
            $(this).prev('input').focus()
        });
        $('.loginipt input').live('blur',function(){
            if($(this).val() == ''){
                $(this).next('.login_tips').show()
            }   
        });


        // init nav list effect
        $('.nav p').css({opacity:0,marginLeft:-20}).each(function( i ){
            $(this).delay( i * 200 )
                .animate({
                    opacity: 1,
                    marginLeft: 0
                } , 500);
        });

        // init share btn
        $('#share').hover(function(){
            $('.share-btns').stop( true , true ).fadeIn();
        } , function(){
            $('.share-btns').stop(true , true).delay(200).fadeOut();
        })
        .find('.share-btns a').hover(function(){
            $(this).stop( true , true ).animate({
                opacity: 1
            } , 300);
        } , function(){
            $(this).stop( true , true ).animate({
                opacity: 0.7
            } , 300);
        });

		$('#share').click(function(){
			$('.share-btns').stop( true , true ).fadeIn();
		});

		// init post twitter button
		$('.post_link').hover(function(){
			$(this).find('.post_tips').fadeIn();
		}, function(){
			$(this).find('.post_tips').fadeOut();
		});

        // init #legal-notice
        $('#legal-notice .popup_close').click(function(){
            $('#legal-notice').fadeOut(function(){
				$('#legal-notice .videobg').remove();
			});
        })

		// init #legal-notice
		$('#winners-prizes .popup_close,.winners-close').click(function(){
			$('#winners-prizes').fadeOut(function(){
				$('#winners-prizes .videobg').remove();
			});
		});

        // swip to load menu
//        if(isMobile) {
//            LP.use('hammer' , function(){
//                var $nav = $('.nav');
//
//                $('body').hammer({
//                    behavior: {
//                        userSelect: true
//                    }
//                })
//                    .on("release dragleft dragright swipeleft swiperight", function(ev) {
//                        if( $nav.data('disabled') ) return false;
//                        $nav.data('disabled' , 'disabled');
//                        switch(ev.type) {
//                            case 'swipeleft':
//                                break;
//                            case 'dragleft':
//                                LP.triggerAction('show-menu' , {d: 'left'});
//                                // $nav.stop( true , true )
//                                //     .animate({left: -250} , 300);
//                                //$('body').bind('touchmove', function(e){e.preventDefault()});
//                                break;
//                            case 'swiperight':
//                                break;
//                            case 'dragright':
//								if(ev.gesture.center.pageX > 320) {
//                                    $nav.removeData('disabled');
//									return false;
//								}
//                                LP.triggerAction('show-menu' , {d: 'right'});
//                                //LP.triggerAction('show-menu');
//                                // $nav.stop( true , true )
//                                //     .animate({left: 0} , 300);
//                                //$('body').bind('touchmove', function(e){e.preventDefault()});
//                                break;
//                            case 'release':
//								// if($nav.is(':visible')) {
//								// 	LP.triggerAction('show-menu' , {d: 'left'});
//								// }
//                                //$('body').unbind('touchmove');
//                                break;
//                        }
//                        setTimeout(function(){
//                            $nav.removeData('disabled');
//                        } , 300);
//                        return false;
//                    });
//            });
//        }


        // tracking events
		var ga_device = 'PC';
		if(isMobile) {
			ga_device = 'M';
		}
        $('.skipintro').click(function(){
            ga('send', 'event', ga_device + '-' + lang + '-HTMl-Intro', 'SkipIntro', lang);
        });

        $('.footer-icon').click(function(){
            ga('send', 'event', ga_device + '-' + lang + '-HTMl-Intro', 'Howto', lang);
        });

        $('.share-btns a').click(function(){
            ga('send', 'event', ga_device + '-' + lang + '-HTMl-Intro', 'Share', lang);
        });

        $('.footer .legal').click(function(){
            ga('send', 'event', ga_device + '-' + lang + '-HTMl-Intro', 'Legal', lang);
        });

		$('.home_weibo').click(function(){
			ga('send', 'event', ga_device + '-' + lang + '-HTMl-CountDown', 'SinaLogin', lang);
		});

		$('.home_twitter').click(function(){
			ga('send', 'event', ga_device + '-' + lang + '-HTMl-CountDown', 'TwitterLogin', lang);
		});

		$('.home_winners').click(function(){
			ga('send', 'event', ga_device + '-' + lang + '-HTMl-CountDown', 'WinnerPrizes', lang);
		});

		$('.popup_invite_btns a').click(function(){
			ga('send', 'event', ga_device + '-' + lang + '-HTMl-Stand', 'ChooseFriend-Submit', lang);
		});

		$('.navicon').click(function(){
			ga('send', 'event', ga_device + '-' + lang + '-HTMl-User', 'Post', lang);
		});

		$('.logout').click(function(){
			ga('send', 'event', ga_device + '-' + lang + '-HTMl-Nav', 'LogOut ', lang);
		});


		$(window).resize(function(){
			if( $.browser.msie && $.browser.version <= 8 ){
				var width = ($(window).width() - 1340) / 2;
				var height = ($(window).height() - 457 - 60)/2;
				if(width < 30) {
					width = 30;
				}
				if(height < 0) {
					height = 0;
				}
				$('.stand').css({top:height, left: width-30+250});
				$('.nav').css({top:height+54, left: width});
			}
		});

        // fix Q & A
        !!(function(){
            // ban qa
            return false;
            var now  = new Date();

            var cookieTimes = [];
            var qaCookie = LP.getCookie( "__QA__") ;
            if( qaCookie ){
                cookieTimes = qaCookie.split(",");
                cookieTimes = cookieTimes.slice(cookieTimes.length - 4);
            }

            // deal current hour
            var atimes = 0;
            for( var _i = cookieTimes.length - 1 ; _i >= 0 ; _i-- ){
                if( now - cookieTimes[ _i ] < 60 * 60 * 1000
                    && new Date( parseInt(cookieTimes[ _i ]) ).getHours() == now.getHours() ){
                    atimes++;
                }
                break;
            }


            var minutes = 60 - now.getMinutes();
            var maxtimes = 3;

            var times = minutes > 40 ? 3 : minutes > 24 ? 2 : minutes > 10 ? 1 : 0;
            times = Math.min( times , maxtimes - atimes );
            var sep = 10; // minutes
            var eachRuntime = ( minutes - times * sep ) / times ;
            var lastTime = 0;
            var getNextTime = function( ){
                if( qtimes < times ){
                    return sep / 2 + qtimes * ( sep + eachRuntime ) + Math.random() * eachRuntime ;
                } else {
                    return minutes + 5 + 10 * Math.random() + ( qtimes - times ) * 25 ;
                }
            }
            var showQa = function(){
                cookieTimes.push( + new Date() );
                LP.setCookie( "__QA__" , cookieTimes.join(",") , 86400 * 30 , '/');

                qtimes++;
                var timer = null;
                api.get('/api/question/random' , '' , function( e ){

                    var data = e.data || {};
                    var content = '<div class="popup_dialog"><div class="popup_timer"></div><div class="popup_dun">1 <span>' + _e('Assiduity') + '</span></div><div class="popup_dialog_msg">';
                    content += data.question + '</div><div class="popup_dialog_options">';
                    $.each( [1,2,3,4] , function( i ){
                        content += '<label data-value="' + ( i + 1 ) + '">' + data['answer' + ( i + 1 ) ] + '</label>'
                    } );
                    content += "</div></div>";

                    LP.panel({
                        title: '',
                        content: content,
                        width: 784,
                        height: 296,
                        onload: function(){
                            var times = 10;
                            var t = this;

                            // init select event
                            this.$panel.find('.popup_dialog_options label')
                                .click(function(){
                                    $(this).addClass('active')
                                        .unbind('click')
                                        .siblings()
                                        .removeClass('active')
                                        .unbind('click');

                                    clearTimeout( questionTimerInitTimer );

                                    api.post("/api/question/answer" , { answer: t.$panel.find('.popup_dialog_options label.active').data('value') , qaid: data.qaid} , function(){
                                        t.close();
                                    });
                                });

                            // init timer
                            questionTimerInit( this.$panel.find('.popup_timer') , 30000 , function(){
                                // TODO..
                                api.post("/api/question/answer" , { answer: '' , qaid: data.qaid} , function(){
                                    t.close();
                                });
                            } );
                        }
                    });
                });
                setTimeout( showQa , ( getNextTime() - lastTime ) * 60 * 1000 );
            }
            var qtimes = 0;
            setTimeout( showQa , ( getNextTime() - lastTime ) * 60 * 1000 );
        })();


        // render mobile video
        if( isMobile ){
            $("#mobile_home_v").html('<div id="mobile_home_v_poster"><img src="/images/home_v.jpg" /></div><video style="width: 100%;height: 100%;"\
                preload="true" poster="/images/home_v.jpg" src="/videos/intro_1.mp4">\
                 <source src="/videos/intro_1.mp4" type="video/mp4" />\
            </video>').click(function(){
                $(this).find('video').get(0).play();
                $(this).find('video').get(0).webkitEnterFullscreen();
            });
            // checkOrientation
//            var orientation = window.orientation;
//            if ( orientation != 0 && orientation !== undefined ) {
//                $('.turnphone').show();
//            } else {
//                $('.turnphone').hide();
//            }

			$('#mobile_home_v_poster').click(function(){
				$(this).hide();
				$('#mobile_home_v').find('video').get(0).play();
			});

			$(window).bind('orientationchange', function() {
				var orientation = window.orientation;
				if ( orientation != 0 && orientation !== undefined ) {
					$('.turnphone').show();
				} else {
					$('.turnphone').hide();
				}
			});


            // no Monitoring
            $('.nav p').eq(3).hide();
        }

        bigVideoInit();


        var needTriggerTutr = false;
        // init first page template
        switch( $(document.body).data('page') ){
            case "index":
                var moveTimer = 0;
                var $intro = $('.skipintro');
                $(document).mousemove(function(){
                    $intro.fadeIn();
                    clearTimeout(moveTimer);
                    moveTimer = setTimeout(function(){
                        $intro.fadeOut();
                    } , 2000);
                })
                // show the big video
                if( !isMobile ){
                    renderVideo( $('#home_video') , "/videos/intro" , "/videos/intro.png" ,  {ratio: 368 / 653 , loop: false} , function(){
                        $('#' + this.Q).css('z-index' , 0);
                        $('#home_video .vjs-poster').html('<div style="position: absolute;height: 100%;width: 100%;background: url(/images/loading_b.gif) no-repeat center center;"></div>').show();
                        this.on('ended' , function(){
                            LP.triggerAction('skip-intro');
                        });
                    } );
                }
                // get parameter d
                var urlObj = LP.parseUrl();
                if( urlObj.params.d ){
                    api.post( "/api/web/decryptionURL" , {d: urlObj.params.d} );
                }

                countDownMgr.initCountDown();
                break;
            case "teambuild":
                api.get("/api/user" , function( e ){
                    if( !e.data.user ) return;
                    // if current user is invited
                    if( e.data.team ){ // show team info
                        $.each( e.data.team.members || [] , function( i , member ){
                            LP.compile( 'teambuild-member-tpl' , member , function( html ){
                                $(html).insertBefore( $('#teambuild_info .member_add') );
                            } );
                        } );

                        $('#teambuild_info').fadeIn()
                            .find( ".member_add" )
                            [ parseInt(e.data.user.invited_by) ? 'hide' : 'show' ]();
                    } else {
                        $(".teambuild_from").fadeIn();
                    }
                } );

                // bind event 
                $(".teambuild_from").submit(function(){
                    api.post( "/api/user/BuildTeam" ,  $(this).serialize() , function( e ){
                        $(".teambuild_from").hide();
                        $('#teambuild_info').fadeIn();
                    });
                    return false;
                });
                break;

            case "countdown":
                countDownMgr.initCountDown();
                break;

            case "fuel":
                //fuel
                $('.fuelitem').live({
                    'mouseenter':function(){
                        $(this).children('.fuelshade').stop().fadeIn()
                        $(this).children('.fuelbtnbox').stop().fadeIn()
                    },
                    'mouseleave':function(){
                        $(this).children('.fuelshade').stop().fadeOut()
                        $(this).children('.fuelbtnbox').stop().fadeOut()
                    }
                });

                // page loaded
                LP.triggerAction('fuel-load');
                
                break;
                
              case "stand":
                if( isMobile ){
                    setTimeout(function(){
                        if( parseInt($('.nav').css('left')) == 0 ){
                            LP.triggerAction('show-menu');
                        }
                    } , 3000);
                }

                // show invited panel
                var dataCon = $("#data-stand");
                var isInvited = !!parseInt(dataCon.attr("data-is_invited"));
                var now_team_name = dataCon.attr("data-now_team_name");
                if ( isInvited ) {
                    if (now_team_name.trim() == "") {
                        LP.triggerAction('invite_box', {"team_name": dataCon.attr("data-team_name"), "team_id": dataCon.attr("data-team_id")});
                    }
                    else {
                        LP.triggerAction('invite_box_with_auto_join', {"team_name": dataCon.attr("data-team_name"), "team_id": dataCon.attr("data-team_id"), "now_team_name": now_team_name});
                    }
                }



                // init hover event
                $('.stand_chart_speed,.stand_chart_quality,.stand_chart_assiduite,.stand_chart_impact')
                    .hover(function(){
                        // TODO ...
                        $(this).find('.stand_chart_tip').fadeIn();
                    } , function(){
                        // TODO ...
                        $(this).find('.stand_chart_tip').fadeOut();
                    });

                $('.stand_tit .team_name').hover(function(){
                        $(this).next().fadeIn();
                        $(this).trigger('keyup');
                    } , function(){
                        $(this).next().fadeOut();
                    });


                $(".stand .teambuild_member").live({
                    'mouseenter':function(){
                        $(this).addClass("hover");
                    },
                    'mouseleave':function(){
                        $(this).removeClass("hover");
                    }
                });

                // init team name
                var lastTname = null;
                var hideTimer = null;
                $('.team_name').blur(function(){
                    $('.stand_chart_tip').fadeOut();
                    $(this).removeClass('focus');
                    var txt = $(this).text();
                    if( lastTname === txt ) return;
                    // match
                    
                    var tmp = txt.replace( /[\u4e00-\u9fa5]/g , '00' );
                    if( tmp.length > 15 ){
                        $('.team_name_error_tip').fadeIn();
                        clearTimeout( hideTimer );
                        hideTimer = setTimeout(function(){
                            $('.team_name_error_tip').fadeOut();
                        } , 3000);
                        $(this).focus();
                        return false;
                    }
					if(txt.length != 0) {
						lastTname = txt;
						api.post("/api/user/updateteam" , {name: txt}, function(){
							$('.team_name').data('team', txt);
						});
					}
					else {
						$('.team_name').text($('.team_name').data('team'));
					}
                }).keydown(function( ev ){ 
                    if( ev.shiftKey && ( ev.which == 57
                        || ev.which == 48 || ev.which == 49 || ev.which == 50 )
                        ) return false;
                    switch( ev.which ){
                        case 221:
                        case 219:
                            return false;
                        case 13:
                            $(this).trigger('blur');
                            return false;
                            break;
                    }

                    var txt = $(this).text();
                    var tmp = txt.replace( /[\u4e00-\u9fa5]/g , '00' );
                    if( tmp.length >= 15 && ev.which != 8 && ev.which != 37 && ev.which != 39 ){
                        $('.team_name_error_tip').fadeIn();
                        clearTimeout( hideTimer );
                        hideTimer = setTimeout(function(){
                            $('.team_name_error_tip').fadeOut();
                        } , 3000);
                        return false;
                    }
                    $('.team_name_error_tip').fadeOut();
                })
                .keyup(function(){
                    var w = $(this).width() + 20;
                    var cw = $('.stand_chart_tip').width();
                    var tw = $('.member_item').width();

                    if( w + cw < tw ){
                        $('.stand_chart_tip').css({
                            left: w,
                            top: 4,
                            bottom: 'auto'
                        }).find('span').css({
                            left: 4,
                            top: 3
                        });
                    } else {
                        $('.stand_chart_tip').css({
                            left: ( w - cw - 30 ) / 2,
                            top: '',
                            bottom: ''
                        }).find('span').css({
                            left: '',
                            top: ''
                        });
                    }
                })
                .focus(function(){
                    $(this).addClass('focus');
                });

               countDownMgr.initCountDown();


                api.get('/api/user' , function( e ){
                    var data = e.data;
                    var crtuser = data["user"];

                    // auto render tuto
                    needTriggerTutr = LP.getCookie('_t_') || !crtuser.read_tutorial;
                    if( needTriggerTutr && !isInvited ){
                        setTimeout(function(){
                            LP.triggerAction( 'start-tutr' );
                            LP.removeCookie('_t_');
                        } , 3000 );
                    }

                    if(!needTriggerTutr) {
                        $('.tutr-step').addClass('read_tutr');
                    }

                    
                    var team = data.team;
                    
                    // TODO:: 如果发现team 是空， 则需要返回到team building 页面
                    
//                    var team = data.team || {
//                        score: {average: 100,impact:0.5 , quality:0.8 ,speed:0.3 , assiduite:0.2},
//                        name:'xxxx',
//                        users:[{
//                            "uid":"101648",
//                            "name":"\u8299\u7f8e\u513f",
//                            "from":"weibo",
//                            "cdate":"2014-05-16 10:39:25",
//                            "udate":"2014-05-16 10:39:25",
//                            "uuid":"5072167230",
//                            "lat":null,
//                            "lng":null,
//                            "speed": 0.9,
//                            "impact": 3452,
//                            "invited_by":"0","profile_msg":"","avatar":"http:\/\/tp3.sinaimg.cn\/5072167230\/180\/40049599975\/0","status":"1","friends":"81","location":"","score":null
//                    }]};

                    // 
                    $('.team_name').html( team.name).data('team', team.name);
                    $('#team-score').html( _e('P') + (data.team_position < 10 && data.team_position > 0 ? '0' + data.team_position : data.team_position ) + ' / ' + (data.team_total < 10 && data.team_total > 0 ? '0' + data.team_total : data.team_total ) );

                    // render users
                    var utpl_crtuser = '<div class="teambuild_member stand_useritem cs-clear">\
                        <div class="member_item ">\
                            <img src="#[avatar]" />\
                            <p class="member_name"><span class="member_name_span">@#[name]<br/></span><span class="member-leave" data-a="leaveteam">' + _e('Leave Team') + '</span></p>\
                        </div>\
                        <div class="member_speed"></div>\
                        <div class="memeber_space"><span data-num="#[num]" data-unit="#[unit]">0</span> ' + _e('fans_unit') + '</div></div>';
                    var utpl_teammem = '<div class="teambuild_member stand_useritem cs-clear">\
                        <div class="member_item ">\
                            <img src="#[avatar]" />\
                            <p class="member_name">@#[name]<br/></p>\
                        </div>\
                        <div class="member_speed"></div>\
                        <div class="memeber_space"><span data-num="#[num]" data-unit="#[unit]">0</span> ' + _e('fans_unit') + '</div></div>';
                    var utpl_inviting = '<div class="teambuild_member stand_useritem cs-clear stand_inviting">\
                        <div class="member_item ">\
                            <img src="#[avatar]" />\
                            <p class="member_name"><span class="member_name_span">@#[name]<br/></span>#[opt]</p>\
                        </div></div>';
                    var html = [];
                    var speeds = [];
                    var spaces = [1000000 , 1000 , 1];
                    var spacesUnit = ['M' , 'K' , ''];

                    var duration = 600;
                    var now = (+new Date()) + 1000;
                    var animateTo = function(  $dom , num , unit ){
                        var dur = new Date() - now;
                        var per = dur / duration;
                        if( per > 1 ){
                            per = 1;
                        }
                        if(( num + '' ).indexOf('.') < 0 )
                            var fixNum = 0;
                        else 
                            var fixNum = 1;
                        $dom.html( parseFloat((num * per).toFixed(fixNum)) + unit );
                        if( per < 1 ){
                            setTimeout( function(){
                                animateTo( $dom , num , unit );
                            } , 1000 / 60);
                        }
                    } 

                    // render invited user
                    $.each( team.users || [] , function( i , user ){
                        var space = '';
                        var unit = '';

                        if( user.friends > 1000 ){
                            $.each( spaces , function( k , sp ){
                                //space =  Math.round((user.friends / sp)*10) / 10;
                                space =  ~~(user.friends / sp) ;
                                if( space >= 1 ){
                                    unit = spacesUnit[k];
                                    return false;
                                }
                                unit = spacesUnit[k];
                            } );
                        } else {
                            space = user.friends;
                        }

                        html.push( LP.format( user.uid == crtuser["uid"] ? utpl_crtuser : utpl_teammem ,{
                            avatar:     user.avatar,
                            name:       user.name,
                            num:        space,
                            unit:       unit,
                            space:      space + unit}));
                        speeds.push( user.score ? user.score.speed : 0 );
                    } );
                    // render inviting user
                    $.each( data.inviting || [] , function( i , user ){

                        html.push( LP.format( utpl_inviting ,{
                            avatar:     user.avatar,
                            name:       user.screen_name,
                            opt:    user.invitor == crtuser["uid"] ? '<span class="cancel-invit" style="display:none;cursor:pointer;" data-d="uuid=' + user.uuid + '" data-a="cancel-invit">' + _e('Cancel Invitation') + '</span>' : ''
                        } ) );
                    } );

                    // render plus 
                    for (var i = (data.inviting || []).length + (team.users || []).length; i < 3; i++) {
                        html.push( '<div class="teambuild_member stand_useritem cs-clear">\
                                <a href="javascript:;" data-a="member_invent" class="member_add cs-clear"><span>+</span></a>\
                            </div>' );
                    }
                    $('.teambuild_members').html( html.join("") )
                        .find('.memeber_space span')
                        .each( function(){
                            var $this = $(this);
                            setTimeout(function(){
                                animateTo( $this , $this.data('num') , $this.data('unit') );
                            } , 1000);
                            
                        } );
					// init member effect
					$('.teambuild_member:not(.stand_inviting)').css({opacity:0}).each(function( i ){
						$(this).delay( i * 200 )
							.animate({
								opacity: 1
							} , 500);
					});
                    $.each( speeds , function( i , speed ){
                        rotateAnimate( $('.member_speed').eq(i) , parseFloat( speed ) || 0.7 , 1 , 45 , true );
                    } );

                    // render achive
                    var ahtml = [];

                    for( var i = 0 ; i < 5 ; i++ ){
                        if( i < data.team_star ){
                            ahtml.push('<p class="full-star">' + ( i + 1 ) + '</p>');
                        } else {
                            ahtml.push('<p></p>');
                        }
                    }

                    $('.stand_achivmentsbox').html( ahtml.join("") );
                    $('.stand_achivments').fadeIn(function(){
                        // animation
                        $('.stand_achivmentsbox p').each(function(index,obj){
                            $(obj).delay(index*200).fadeIn();
                        });
                    });


                    //data.last_post || 
                    var posts =  data.last_post || [];
                    // render post
                    var aHtml = [];
                    $.each( posts , function( i , post ){
                        aHtml.push("<div class=\"stand_achivmentsbox\">" + post["content"] + "</div>");
                    } );

                    var postWidth = $('.stand_posts').width() / 2 + 21;
                    $('.stand_posts_inner').append( aHtml.join("") ).css('width' , posts.length * postWidth)
                        .data('index' , 0 );
                    $('.stand_tweet').fadeIn();
                    
                    // redner next page
                    $('.stand_add').click(function(){
                        if($(this).hasClass('disabled') ) return;
                        if( Math.abs(parseInt( $('.stand_posts_inner').css('marginLeft') )) + $('.stand_posts').width()
                        >= $('.stand_posts_inner').width()) return;

                        $(this).addClass('disabled');
                        $('.stand_posts_inner').animate({
                            marginLeft: '-=' + ( postWidth * 2 )
                        } , 500 , '' , function(){
                            if( Math.abs(parseInt( $('.stand_posts_inner').css('marginLeft') )) + $('.stand_posts').width()
                                >= $('.stand_posts_inner').width()){
                                $('.stand_add').adddlass('disabled');
                            }
                            $('.stand_del').removeClass('disabled');
                        });
                    });

                    $('.stand_del').click(function(){
                        if($(this).hasClass('disabled') ) return;
                        if( Math.abs(parseInt( $('.stand_posts_inner').css('marginLeft') )) == 0 ) return;

                        $(this).addClass('disabled');
                        $('.stand_posts_inner').animate({
                            marginLeft: '+=' + ( postWidth * 2 )
                        } , 500 , '' , function(){
                            if( Math.abs(parseInt( $('.stand_posts_inner').css('marginLeft') )) == 0 ){
                                $('.stand_del').addClass('disabled');
                            }
                            $('.stand_add').removeClass('disabled');
                        });
                    });


                    // hover to show the leave team
                    $('.teambuild_members').delegate( '.member_item' , 'mouseenter' , function(){
                        if(!$(this).find('.member-leave,.cancel-invit').length) return;
                        $(this).find('.member-leave,.cancel-invit').stop( true , true ).fadeIn()
                            .end()
                            .find('.member_name_span')
                            .hide();
                    })
                    .delegate('.member_item' , 'mouseleave' , function(){
                        $(this).find('.member-leave,.cancel-invit').hide()
                            .end()
                            .find('.member_name_span')
                            .stop( true , true )
                            .fadeIn();
                    })
                    .delegate('.stand_inviting .member_item' , 'mouseenter' , function(){
                        $(this).animate({opacity: 1});
                    })
                    .delegate('.stand_inviting .member_item' , 'mouseleave' , function(){
                        $(this).animate({opacity: 0.5});
                    });

                    // render stand_chart
                    var score = team.score || {};
                    $('.stand_chart_score').html( (score.average || 0) + ' km/h' );
                    coordinate.init( $('.stand_chart') , function(){
                        coordinate.run( score.impact || 0 , score.quality || 0 , score.speed || 0 , score.assiduity || 0 );
                    } );
                        
                });

                break;
                
            case "monitoring":
              var tweetGroup = $(".tweet-con .tweet-list");
              var callbackRender = function(index, group) {
                  for (var i = 0; i < group.length; i++) {
                    var tweet = {
                      media: group[i]['user']["avatar"],
                      date: group[i]["date"],
                      name: group[i]["user"]["name"],
                      from: group[i]["from"],
                      content: group[i]["content"],
                      uuid: group[i]["uuid"]
                    };
                    LP.compile("tweet-item-tpl", tweet, function(html) {
                      $(".monitor_item").eq(index).children(".monitor_list").append(html);
                    });
                  }
                  if (group.length <= 0) {
                    $(".monitor_item").eq(index).children(".monitor_list").append("<li class='tweet-signle-item clearfix'>empty</li>");
                  }
                }
              api.get("/api/twitte", function (e) {
                var group1 = e["data"]["web"];
                callbackRender(0, group1);
                
                var group2 = e["data"]["user"];
                callbackRender(1, group2);
                
                var group3 = e["data"]["team"];
                callbackRender(2, group3);
                
                var group4 = e["data"]["topic"];
                callbackRender(3, group4);
              });
              
              break;
              
          case "teamrace":
                if(document.createElement("canvas").getContext){
                    // get server time 
                    var getServerTime = function () {
                        api.get('/api/web/time?v2=1' , function( e ){
                            clearInterval( interval );
                            var now = +new Date( e.data.time_now ) / 1000;
                            var start = +new Date( e.data.time_start ) / 1000;
                            

                            interval = setInterval( function(){
                                now += 1;
                                var duration = now - start;
                                var hour = ~~((duration / 3600));
                                var minute = ~~(( ( duration - hour * 3600 ) / 60 ));
                                var seconds = duration - hour * 3600 - minute * 60;
                                

                                $('.race_time').html( ( hour > 9 ? hour : '0' + hour ) + ':' + 
                                 ( minute > 9 ? minute : '0' + minute ) + ':' + 
                                 ( seconds > 9 ? seconds : '0' + seconds ) );
                            } , 1000 );
                        });
                    };
                    var interval;
                    setInterval(getServerTime , 30 * 1000);
                    getServerTime();
                    
                    api.get('/api/user' , function( e ){
                        var speed = e.data.team.score ? e.data.team.score.average : 0;
                        $('.race_speed').html( speed + 'Kp/h' );
                    });
                } else {
                    // render flash
                    // render flash
                    $('.race_nav,.nav').hide();
                    $('#container').html(
                        '<object id="flash" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="100%" height="100%">\
                            <param name="movie" value="/js/raceflash/Sticks.swf"/>\
                            <param name="quality" value="high"/>\
                            <param name="wmode" value="transparent"/>\
                            <param name="flashVars" value="xml=/js/raceflash/xml/sticks.xml"/>\
                            <embed name="flash" src="/js/raceflash/Sticks.swf" quality="high" wmode="transparent" flashVars="xml=/js/raceflash/xml/sticks.xml" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="100%" height="100%" allowScriptAccess="always"></embed>\
                        </object>'
                        );
                }
            break;

            case "race":
                if(document.createElement("canvas").getContext){
                    var getServerTime = function () {
                        api.get('/api/web/time?v2=1' , function( e ){
                            clearInterval( interval );
                            var now = +new Date( e.data.time_now ) / 1000;
                            var start = +new Date( e.data.time_start ) / 1000;

                            interval = setInterval( function(){
                                now += 1;
                                var duration = now - start;
                                var hour = ~~(duration / 3600);
                                var minute = ~~( ( duration - hour * 3600 ) / 60 );
                                var seconds = duration - hour * 3600 - minute * 60;

                                $('.race_time').html( ( hour > 9 ? hour : '0' + hour ) + ':' + 
                                 ( minute > 9 ? minute : '0' + minute ) + ':' + 
                                 ( seconds > 9 ? seconds : '0' + seconds ) );
                            } , 1000 );
                        });
                    };
                    // get server time 
                    var interval;
                    setInterval(getServerTime , 30 * 1000);
                    getServerTime();
                } else {
                    // render flash
                    $('.race_nav,.nav').hide();
                    $('#container').html(
                        '<object id="flash" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="100%" height="100%">\
                            <param name="movie" value="/js/raceflash/track.swf"/>\
                            <param name="quality" value="high"/>\
                            <param name="wmode" value="transparent"/>\
                            <param name="flashVars" value="xml=/js/raceflash/xml/track.xml"/>\
                            <embed name="flash" src="/js/raceflash/track.swf" quality="high" wmode="transparent" flashVars="xml=/js/raceflash/xml/track.xml" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="100%" height="100%" allowScriptAccess="always"></embed>\
                        </object>'
                        );
                }
                break;
        }
    });


    // setTimeout(function(){
    //     alert($('.conut_down_wrap .conut_down').css('left'));
    //     alert($('.conut_down_wrap  .conut_down').css('top' , 0));
    // } , 2000);
    

});


