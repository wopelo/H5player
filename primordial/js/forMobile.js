(function(){
	//获取video标签的父元素
	var container = document.querySelector("#video-player");
	//获取video标签
	var player = document.querySelector("#v-player");
	//获取播放器中心图标
	var icon = document.querySelector("#icon-play");
	//获取播放器中心重播图标
	var chongbo = document.querySelector("#icon-chongbo");
	//获取下方控制条
	var control = document.querySelector("#player-controls");
	//获取整体进度条
	var progressBar = document.querySelector("#player-progressBar");
	//获取已播放进度条
	var timeBar = document.querySelector("#player-timeBar");
	//获取进度控制条小球
	var timeBall = document.querySelector("#time-ball");
	//获取当前播放时间
	var current = document.querySelector("#player-current");
	//获取控制条中播放/暂停按钮
	var assist_play = document.querySelector("#assist-play");
	var assist_stop = document.querySelector("#assist-stop");
	var assist_chongbo = document.querySelector("#assist-chongbo");
	//获取全屏与取消全屏按钮
	var full = document.querySelector("#player-fill");
	var copy = document.querySelector("#player-copy");
	//移动端音量显示组件
	var mobileVolume = document.querySelector("#mobile-volume");
	//移动端音量文字显示
	var mobileVolumeSize = document.querySelector("#mobile-volume-size");

	//是否正在播放
	var isPlay = false;
	//是否已播放完毕
	var isEnd = false;
	//视频总长
	var total = 0;
	//开始滑动位置的坐标
	var startX = 0;
	var startY = 0;
	//是否正在拖动进度条小球
	var timeBallDrag = false;

	//播放
	function play(){
		player.play();
		//控制条隐藏
		control.className = "opacity";
		//视频中间的播放图标隐藏
		icon.className = icon.className.replace(/inline/,"none");
		icon.className = icon.className.replace(/icon-play/,"icon-zanting");
		//控制条左侧图标切换
		assist_play.className = assist_play.className.replace(/inline/,"none");
		assist_stop.className = assist_stop.className.replace(/none/,"inline");
		isPlay = true;
	}

	//暂停
	function stop(){
		player.pause();
		control.className = "";
		icon.className = icon.className.replace(/none/,"inline");
		icon.className = icon.className.replace(/icon-zanting/,"icon-play");
		assist_play.className = assist_play.className.replace(/none/,"inline");
		assist_stop.className = assist_stop.className.replace(/inline/,"none");
		isPlay = false;
	}

	//将时间转换为几分几秒
	function stom(t) {
	    var m = Math.floor(t / 60);
	    m < 10 && (m = '0' + m);
	    return m + ":" + (t % 60 / 100).toFixed(2).slice(-2);
	}

	//全屏播放函数
	function setFull(ele){
		container.style.maxWidth = "100%";
		//获取不同浏览器下的h5全屏函数
		var rfs = ele.requestFullscreen || ele.webkitRequestFullscreen || ele.mozRequestFullScreen || ele.msRequestFullscreen || ele.oRequestFullScreen;
		rfs.call(ele);
	}

	//退出全屏
	function outFill(){
		var rfs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen  || document.msExitFullscreen || document.oExitFullScreen;
		rfs.call(document);
		container.style.maxWidth = "1170px";
	}

	//显示控制条
	function showControl(){
		control.className = "";
		//显示播放器中间的图标
		if(!isEnd){
			//避免已经播放完毕仍然出现暂停图标
			icon.className = icon.className.replace(/none/,"inline");
			icon.className = icon.className.replace(/icon-play/,"icon-zanting");
		}
		//函数节流，防止重复点击设置多个setTimeout
		clearTimeout(player.timeId);
		player.timeId = setTimeout(function(){
			//避免三秒之后isPlay状态改变
			if(isPlay){
				icon.className = icon.className.replace(/inline/,"none");
				control.className = "opacity";
			}
		},3000);
	}

	//改变进度条小球位置
	function moveTimeBall(percentage){
		//percentage有可能大于1小于0，这样player.volume的值就不在[0,1]之间
		if(percentage > 1){
			percentage = 1;
		}else if(percentage < 0){
			percentage = 0;
		}
		timeBall.style.left = percentage*100 + "%";
	}

	//重播
	function replay(){
		isEnd = false;
		chongbo.className = chongbo.className.replace(/inline/,"none");
		assist_stop.className = assist_stop.className.replace(/none/,"inline");
		assist_chongbo.className = assist_chongbo.className.replace(/inline/,"none");
		player.currentTime = 0;
		play();
	}

	//视频加载完后获取总时长
	player.onloadedmetadata = function(){
		total = player.duration;
		document.querySelector("#player-duration").innerHTML = stom(total);
	}

	//实时更新播放位置
	player.ontimeupdate = function(){
		var currentTime = this.currentTime;
		var percentage = currentTime/total; 
		timeBar.style.width = percentage*100 + "%";
		if(!timeBallDrag){
			moveTimeBall(percentage);
		}
		current.innerHTML = stom(currentTime);
	}

	//点击屏幕播放/暂停
	icon.ontouchend = function(){
		if(isPlay){
			stop();
		}else{
			play();
		}
	}

	assist_play.ontouchend = function(){
		play();
	}

	assist_stop.ontouchend = function(){
		stop();
	}

	//全屏切换
	full.ontouchend = function(){
		copy.className = copy.className.replace(/none/,"inline");
		full.className = full.className.replace(/inline/,"none");
		setFull(container);
	}

	copy.ontouchend = function(){
		full.className = full.className.replace(/none/,"inline");
		copy.className = copy.className.replace(/inline/,"none");
		outFill()
	}

	//移动端水平滑动实现快进快退,垂直滑动控制音量
	player.ontouchstart = function(event){
		startX = event.targetTouches[0].clientX;
		startY = event.targetTouches[0].clientY;
	}

	player.ontouchend = function(event){
		var horizontal = event.changedTouches[0].clientX - startX;
		var vertical = event.changedTouches[0].clientY - startY;

		//避免点击（而不是在在player上滑动）player触发播放
		var goPlay = true;

		//判断水平与垂直方向的移动距离是否大于临界值，水平移动优先于垂直移动
		if(horizontal > 10 || horizontal < -10){
			//水平方向移动大于临界值，判断为控制进度
			
			//显示控制条
			showControl();

			if(horizontal > 0){
				player.currentTime += 5;
			}else if(horizontal < 0){
				player.currentTime -= 5;
			}
		}else if(vertical > 10 || vertical < -10){
			goPlay = false;
			//垂直方向移动大于临界值，判断为控制音量
			
			//显示当前音量
			mobileVolume.className = "";
			//函数节流，防止重复点击设置多个setTimeout
			clearTimeout(mobileVolume.timeId);
			mobileVolume.timeId = setTimeout(function(){
				mobileVolume.className = "opacity";
			},3000);

			if(vertical > 0){
				//如果目前音量大小+0.1小于等于1
				if(player.volume - 0.1 >= 0){
					player.volume -= 0.1;
				}else{
					player.volume = 0;
				}
			}else if(vertical < 0){
				if(player.volume + 0.1 <= 1){
					player.volume += 0.1;
				}else{
					player.volume = 1;
				}
			}
			mobileVolumeSize.innerHTML = (player.volume * 100).toFixed(0) + "%";
		}else{
			//两个参数均小于临界值，判断为点击播放器
			//移动端控制控制条显示
			goPlay = false;
			//在播放情况下，点击player显示控制条，并在三秒后隐藏
			if(isPlay){
				//显示控制条
				showControl();
			}
		}

		//如果没有在播放
		if(goPlay && !isPlay){
			play();
		}
	}

	//点击进度条快进快退
	progressBar.ontouchend = function(event){
		//当开或离开progressBar时注销touchmove事件
		progressBar.ontouchmove = null;
		timeBallDrag = false;
		//点击位置 = (点击点距离浏览器左侧距离 - 触发元素距离浏览器左侧距离) / 元素宽
		var percentage = (event.changedTouches[0].clientX-this.getBoundingClientRect().left) / this.clientWidth;
		timeBall.style.left = (percentage*100) + "%";
		player.currentTime = total * percentage;
		//如果没有在播放
		if(!isPlay){
			play();
		}
	}

	//拖动进度条小球快进快退
	timeBall.ontouchstart = function(e){
		//阻止事件冒泡
		e.stopPropagation();
		progressBar.ontouchmove = function(event){
			//避免操作过程中控制条隐藏
			clearTimeout(player.timeId);
			player.timeId = setTimeout(function(){
				//避免三秒之后isPlay状态改变
				if(isPlay){
					icon.className = icon.className.replace(/inline/,"none");
					control.className = "opacity";
				}
			},3000);
			var percentage = (event.changedTouches[0].clientX-this.getBoundingClientRect().left) / this.clientWidth;
			timeBallDrag = true;
			moveTimeBall(percentage);
		}
	}

	//播放结束，显示重播按钮
	player.onended = function(){
		isEnd = true;
		//防止在结束前三秒点击播放器在结束时出现图标重叠
		clearTimeout(player.timeId);
		icon.className = icon.className.replace(/inline/,"none");
		control.className = "opacity";

		chongbo.className = chongbo.className.replace(/none/,"inline");
		assist_stop.className = assist_stop.className.replace(/inline/,"none");
		assist_chongbo.className = assist_chongbo.className.replace(/none/,"inline");
	}

	chongbo.ontouchend = function(){
		replay();
	}

	assist_chongbo.ontouchend = function(){
		replay();
	}
}())