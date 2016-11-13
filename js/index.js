$(function(){

	function makePoker(){
		//声明变量
		
		var poker=[];//放52张牌
		var flag={};//判断牌的状态
		var colors=['h','s','c','d'];//花色

		while(poker.length!==52){
			var n=Math.ceil( Math.random()*13 );//1-13
			var c=colors[Math.floor( Math.random()*4 )];//0-3
			var v={color:c,number:n};
			//去重
			if (!flag[n+c]) {
				flag[n+c]=true;
				poker.push(v);
			};
			
		};
		return poker;
	};
	function setPoker(poker){
		//清空页面
		$('.game').empty();
		score=0;
		match=1;
		//开计时器
		tt=setInterval(time,1000);
		var t=0;
		var a=0,b=0,c=0;
		function time(){
			t++;
			if (t>9) {
				c+=1
				t=0
			};
			if (c>5) {
				b+=1;
				c=0
			};
			if (b>9) {
				a+=1;
				b=0
			};
			$('#time').val('计时：'+a+''+b+':'+c+''+t+'')
		}

		//将牌追加到页面中
		// $(poker).each(function(i,v){
		// 	$('<div>').addClass('pai').css('background-image','url(./image/'+dict[v.number]+v.color+'.png)').appendTo('.game');

		// })
		var index=0;
		var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'};
		//创建下边按钮
		$('<div>').text('返回').addClass('move-left').appendTo('.game');
		$('<div>').text('抽牌').addClass('move-right').appendTo('.game');
		$('<div>').addClass('zuo').text('剩3次').appendTo('.game');

		//绘制金字塔式的7层牌
		for (var i = 0; i <7; i++) {
			// var x=0;
			for(var j=0;j<i+1;j++){
			var dd=poker[index];
			if ($('.pai').length) {
				$('.pai').css('top','80px')
			};
				// x++;
				index+=1;
				$('<div>')
					.addClass('pai')
					.attr({'id':i+'-'+j,'data-number':dd.number})
					.css({'background-image':'url(./image/'+dict[dd.number]+dd.color+'.png)'})
					.appendTo('.game')
					.delay(index*30)
					.animate({
						top:(i+3)*30,
						left:50*(6-i)+50+j*100,
						opacity:1
					})
			}			
		};
		
		$('<div>').addClass('z').appendTo('.game');
		$('<div>').addClass('r').appendTo('.game');

		//将剩下的24张牌放在下边

		for(;index<poker.length;index++){
			ss=poker[index]
			$('<div>')
				.addClass('pai left')
				.attr('data-number',ss.number)
				.css({'background-image':'url(./image/'+dict[ss.number]+ss.color+'.png)'})
				.appendTo('.game')
				.delay(index*30)
				.animate({
					top:450,
					left:100,
					opacity:1
				})

			// $('<div>').addClass('you').appendTo('.game');
			
		}//shengxia




		var moveRight=$('.game .move-right');
		var moveLeft=$('.game .move-left');
		var zIndex=0;
		//抽牌
		moveRight.on('click',function(){
			if (!$('.left').length) {
				return
			};
			zIndex++;//与上边的判断条件有一个先后
			$('.left').last()
				.css('z-index',zIndex)
				.animate({left:600})
				.queue(function(){
					$(this).removeClass('left')
						   .addClass('right')
						   .dequeue()
				})
			// $('.zuo').text('共'+($('.left').length-1)+'张');
			// $('.you').text('共'+($('.right').length+1)+'张');

		})
		//阻止选中文本的默认事件
		moveRight.on('mousedown',false)
		moveLeft.on('mousedown',false)

		var back=0;
		moveLeft.on('click',function(){
			if ($('.left').length) {
				return
			};
			back++;
			if (back>3) {//回牌三次后 停止
				return
			};
			//回牌 动画 each 延迟
			$('.right').each(function(i){
				$(this).delay(i*100)
					   .animate({left:100})
					   .queue(function(){
					   	$(this).css({zIndex:0})
					   		   .removeClass('.right')
					   		   .addClass('left')
					   		   .dequeue()
					   })

		$('.zuo').text('剩'+(3-back)+'次');
		// $('you').text('共'+($('.right').length+1)+'张');
			})
		})

	}//set poker

	//开始游戏 
	$('#start').on('click',function(){
		setPoker(makePoker());
	})

	
	//获取牌面的值
	function getNumber(el){
		return parseInt( $(el).attr('data-number') );

	}
	//判断是否牌被压
	function isCanClick(el){
		var x=parseInt($(el).attr('id').split('-')[0]);
		var y=parseInt($(el).attr('id').split('-')[1]);
		if ($('#'+(x+1)+'-'+y+' ').length||$('#'+(x+1)+'-'+(y+1)+' ').length) {
			alert('发')
			return false;
		}else{
			return true;
		}
	}
	
	var prev=null;
	var score=0;
	var match=1;
	

	$('.game').on('click','.pai',function(){
		var pw=Math.floor(Math.random()*$('.scene').width());
		var ph=Math.floor(Math.random()*$('.scene').height());
		
		//判断是否是被压的牌
		// id 5-2(5行3列) 被 6-2和6-3 压着
		if ($(this).attr('id') && !isCanClick(this)  ) {
			return;
		};
		$(this).animate({top:"-=20",border:'3px solid  #30c9e8'},100)
		
		// ##K  
		if (getNumber(this)==13) {
			$(this).animate({top:0,right:50},100)
				.queue(function(){
					$(this).detach()
						.dequeue()
						prev=null;
					$('#score').val(' 得分：'+ (score+=10) +' ');


				})
		};//k

		// ## 有无前牌
		
		if (prev){
			// ##第二个prev

			//判断俩次点击是否为同一张牌
			if ($(this).attr('id')&&  ($(this).attr('id')==$(prev).attr('id'))  ) {
				
				$(prev).finish().animate({'top':'+=40'},10);//因为点击俩次上升了了40个高度
				prev=null;
				return;

			};
			//计算和是否为13
			if (getNumber(this)+getNumber(prev)==13) {
				prev.add(this).animate({top:ph,left:pw},100)
					.queue(function(){
						$(this).detach()
							.dequeue()
					prev=null;

					})
					$('#score').val(' 得分：'+ (score+=10) +' ');
					$('#matched').val(' 配对：'+(match++)+'对 ')


					prev=null;
			}else{
				$(this).animate({top:'+=20'},100);
				prev.delay(100).animate({top:'+=20'},100)
					.queue(function(){
						$(this).css('border','').dequeue()
					})
				prev=null;

			}
			// prev=null
		}else{
			
			// ##第一个prev
			prev=$(this)
			
		}//prev


	})//牌面点击  游戏ing

	//重新发牌
	$('#restart').on('click',function(){
		clearInterval(tt);
		setPoker(makePoker());
		$('#score').text('');
		$('#matched').text('')
	})//重新

	$('#quit').on('click',function(){
		
			window.close()

		
	})



























})//加载结束