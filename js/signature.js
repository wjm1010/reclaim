(function($){
	//初始化签名样式
	var defaults = {
		fillStyle:'transparent',	
		lineWidth:4,	
		strokeStyle:'#000'
	};
    var _drawCount = 0;
    var _drawSign = false;
    var _context = '';
    var _canvas = '';
    var _isPC = true;
    //判断手机
	if (!!("ontouchend" in document)) _isPC = false;
	function _setCanvasInit(ele,param){
    	_canvas = ele;
    	_context = _canvas.getContext('2d');
    	_drawCount = 0;
    	_context.fillStyle = param.fillStyle;
    	_context.lineWidth = param.lineWidth;
    	_context.strokeStyle = param.strokeStyle;
    }
	$.fn.canvasSignature = function(options){
		var params = $.extend(defaults,options);
	    _setCanvasInit($(this).get(0),params);
	    if(!_isPC){
	        _canvas.addEventListener('touchstart',function(e){
	            var touch = e.touches[0];
	            _context.beginPath();
	            _context.moveTo(touch.pageX - $(_canvas).offset().left,touch.pageY - $(_canvas).offset().top);
	            _context.lineTo(touch.pageX - $(_canvas).offset().left + 4,touch.pageY - $(_canvas).offset().top);
	            _context.stroke();
	            _drawSign = true;
	            _drawCount ++;
	        },false);
	        _canvas.addEventListener('touchmove',function (e) {
	            if(_drawSign){
	                var touch = e.touches[0];
	                _context.lineTo(touch.pageX - $(_canvas).offset().left,touch.pageY - $(_canvas).offset().top);
	                _context.stroke();
	            }
	        },false);
	        _canvas.addEventListener('touchend',function(e){
	            if(_drawSign){
	                _drawSign = false;
	                _context.closePath();
	            }
	        },false);
	    }else{
	        _canvas.onmousedown = function(e){
	            var e = e || window.event;
	            _context.beginPath();
	            _context.moveTo(e.pageX - $(_canvas).offset().left,e.pageY - $(_canvas).offset().top);
	            _context.stroke();
	            _drawSign = true;
	            _drawCount ++;
	        }
	        _canvas.onmousemove = function(e){
	            if(_drawSign){
	                var e = e || window.event;
	                _context.lineTo(e.pageX - $(_canvas).offset().left, e.pageY - $(_canvas).offset().top);
	                _context.stroke();
	            }
	        }
	        _canvas.onmouseout = function(e){
	            if(_drawSign){
	                _drawSign = false;
	                _context.closePath();
	            }
	        }
	        _canvas.onmouseup = function(e){
	            if(_drawSign){
	                _drawSign = false;
	                _context.closePath();
	            }
	        }
	    }
	    return this;
	};
	//清除图像
	$.fn.clearSignature = function(){
   		_drawCount = 0;
    	_context.clearRect(0,0,_canvas.width,_canvas.height);

    	return this;
	};
	//导出canvas图像
	$.fn.createSignature = function(pictureType){
		var _image = '';
		switch(pictureType){
			case 'jpg':
				_image = _canvas.toDataURL("image/jpeg");
				break;
			case 'png':
				_image = _canvas.toDataURL("image/png");
				break;
			default:
				_image = _canvas.toDataURL();
				break;
		}

		return _image;
	};
})(jQuery);