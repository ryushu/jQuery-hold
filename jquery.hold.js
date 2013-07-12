/*
 *	jQuery long touch plugin
 *	Copyright (C) Ryuhei Shudo
 *	Lisensed under the MIT Lisence
 */
(function($){
	// @params
	// 	params.selector		: selector
	// 	params.data		: data
	// 	params.namespace	: namespace
	// 	params.stopPropagation	: stopPropagation default false.
	// 	params.ms		: duration. default 700ms.
	$.fn.extend({
		longTouch : function( params, fn ){
			//params for jQeury.event.add
			var selector, data;

			//private variable
			var tid = 0;
			var ms = 700;
			var run = false;
			var cnt = 0;
			var maxCnt = 3;
			var stopPropagation = false;
			var ev = {
				  start : 'touchstart'
				, move : 'touchmove'
				, end : 'touchend'
			};

			//.longTouch(fn);
			if( typeof params !== "object" ){
				fn = params ;
				params = null;
			//.longTouch(params,fn);
			}else{
				if( typeof params.selector !== 'undefined' ) selector = params.selector;
				if( typeof params.data !== 'undefined' ) data = params.data;
				if( typeof params.namespace !== 'undefined' ) {
					ev.start +=  '.' + params.namespace ;
					ev.move += '.' + params.namespace ;
					ev.end += '.' + params.namespace ;
				}
				if( typeof params.stopPropagation !== 'undefined' ) stopPropagation = params.stopPropagation ;
				if( typeof params.ms !== 'undefined' ) ms = params.ms;
			}

			// touchstart function
			var startFn = function( e ){
				run = false;
				cnt = 0;
				if( stopPropagation ) e.stopPropagation();
				tid = setTimeout(function( me ){
					fn.call( me, e );
					if( stopPropagation ){
						e.stopImmediatePropagation();
						run = true;
					}
				}, 700, this );
			};
        		// touchmove function
			var moveFn = function( e ){
				if( stopPropagation ) e.stopPropagation();
				e.preventDefault();
				if(cnt == maxCnt){
					cnt = 999;
					clearTimeout( tid );
				}else if( cnt < maxCnt ){
					cnt++;
				}
			};
        		// touchstart function
			var endFn = function( e ){
				if( !run ){
					clearTimeout( tid );
				}
			};
			
			//attach event
			return this.each( function(){
				jQuery.event.add( this, ev.start, startFn, data, selector );
				jQuery.event.add( this, ev.move, moveFn, data, selector );
				jQuery.event.add( this, ev.end, endFn, data, selector );
			});
		}
	});
})(jQuery);

