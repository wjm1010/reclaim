$(function() {
	// 合同开始的时候请求iframe的地址
	// var adresa_zmluvy = $(".adresa-zmluvy").attr("src")
	// $.ajax({
	// 		type: 'GET',
	// 		url: url,
	// 		data: data,
	// 		success: function(res) {
	// 		},
	// 		error: function(res) {
	// 		}
	// 	 });
	// 三要素触发焦点
	$(".compact-name").focus(function() {
		$(".con-hint1").css('opacity', '0');
	});
	$(".compact-identity").focus(function() {
		$(".con-hint2").css('opacity', '0');
	});
	$(".compact-phone").focus(function() {
		$(".con-hint3").css('opacity', '0');
	});
	$(".send-code").focus(function() {
		$(".con-hint5").css('opacity', '0');
	});
	// 发送验证码
		/*倒计时*/
	var InterValObj; 
	var count = 60; 
	var curCount;
	function sendMessage() { 
	   curCount = count; 
	   $(".verification-code").attr("disabled", "true"); 
	   $(".verification-code").val(curCount + "s"); 
	   InterValObj = window.setInterval(SetRemainTime, 1000); 
	  //后台验证码TODO 
	} 
	function SetRemainTime() { 
      	if (curCount == 0) {         
        	window.clearInterval(InterValObj);
        	$(".verification-code").removeAttr("disabled"); 
        	$(".verification-code").val("重新发送"); 
      	}else { 
        curCount--; 
        	$(".verification-code").val(curCount + "s"); 
      	} 
	}
	$(".verification-code").click(function() {
		var compact_phone = $('.compact-phone').val()
		if (!compact_phone || !/^1(3|4|5|7|8|9)\d{9}$/i.test(compact_phone)) {
			$(".con-hint3").css('opacity', '1');
			return false;
		};
		sendMessage()
	});
	// 点击确定
	$(".confirm").click(function() {
		var compact_name = $('.compact-name').val()
		var compact_identity = $('.compact-identity').val()
		var compact_phone = $('.compact-phone').val()
		var send_code = $(".send-code").val()

		if (!compact_name || !/^([\u4e00-\u9fa5a-zA-Z]){2,15}$/.test(compact_name)) {
			$(".con-hint1").css('opacity', '1');
			return false;
		}
		if (!compact_identity || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(compact_identity)) {
			$(".con-hint2").css('opacity', '1');
			return false
		}
		if (!compact_phone || !/^1(3|4|5|7|8|9)\d{9}$/i.test(compact_phone)) {
			$(".con-hint3").css('opacity', '1');
			return false;
		}	
		
		// 验证码验证是否正确
			// 验证码为空 不正确时执行下面操作 补充不正确
		if (!send_code) {
			$(".con-hint5").css('opacity', '1');
			return false;
		}

		// var data = {
		//     compactName: compact_name,
		//     compactIdentity: compact_identity,
		//     compactPhone: compact_phone,
		// 	sendCode: send_code
		// }
		// $.ajax({
		//         type: 'GET',
		//         url: url,
		//         data: data,
		//         success: function(res) {
						// 当表单提交成功之后画板显示
						// $(".contract-drawing").show()
		//         },
		//         error: function(res) {
		//         }
		//     });

	})
	// 调用画板
	$('#signName').canvasSignature()
	//清除画板´
	$('#clearCanvas').click(function() {
		$('#signName').clearSignature();
	});
	// 画板没有元素
	function isEmptyCanvas(canvas) {
		var ctx = canvas.getContext("2d");
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		for (var i = 0, len = imageData.length; i < len; i += 4) {
			if (imageData[i + 3] > 0) {
				return true;
			}
		}
		return false
	}
	var canvas = document.getElementById("signName");
	var ctx = canvas.getContext("2d");
	var sureButton = document.getElementById("createImage");
	// 点击提交按钮事件
	sureButton.addEventListener("click", function (ev) {
		if (!isEmptyCanvas(canvas)) {
			$(".con-hint4").css('opacity', '1');
		}else{
			$(".con-hint4").css('opacity', '0');
			// 当有图像时,提交成功
			$('#newImage').attr('src',$('#signName').createSignature('png'));
			var new_image = $('#newImage').attr('src') //图像的地址
			$(".tj-loading").show() //提示信息加载中
			$(".export-contract").show() //导出合同禁
			// 多余内容隐藏
			$(".contract").hide()
			 $.ajax({
		         type: 'GET',
		         url: url,
		         data: data,
		         success: function(res) {
					$(".tj-loading").hide()
			 		if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
						$(".adresa-zmluvy").css("height","445px")
					} else {
						$(".adresa-zmluvy").css("height","550px")
					}
					$(".adresa-zmluvy").attr('src',path);//给iframe赋予新的地址
					//  导出合同
					$(".export-contract").css({
						border: '1px solid #108ee9',
						background: '#108ee9',
						cursor: 'pointer'
					});
			 	},
			 	error: function(res) {
					 console.log(res)
					 $(".tj-loading").hide()
			 	}
			 });
		}
		
	});
})