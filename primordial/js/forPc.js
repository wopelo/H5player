(function(){
	//获取video标签的父元素
	var container = document.querySelector("#video-player");
	//获取video标签
	var player = document.querySelector("#v-player");
	//获取播放器中心播放图标
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
	//获取控制条中播放/暂停/重播按钮
	var assist_play = document.querySelector("#assist-play");
	var assist_stop = document.querySelector("#assist-stop");
	var assist_chongbo = document.querySelector("#assist-chongbo");
	//获取音量控制按钮
	var playerVolume = document.querySelector("#player-volume");
	//获取音量条
	var chooseSize = document.querySelector("#choose-size");
	//当前音量
	var nowSize = document.querySelector("#now-size");
	//音量文字显示
	var sizeNum = document.querySelector("#size-num");
	//音量控制条小球
	var sizeBall = document.querySelector("#size-ball");
	//获取全屏与取消全屏按钮
	var full = document.querySelector("#player-fill");
	var copy = document.querySelector("#player-copy");

	//是否正在播放
	var isPlay = false;
	//是否静音
	var isMute = false;
	//视频总长
	var total = 0;
	//开始滑动点击位置
	var startX = 0;
	//是否正在拖动进度条小球
	var timeBallDrag = false;

	//播放器点击事件
	function playerClick(){
		if(isPlay){
			stop();
		}else{
			play();
		}
	}

	//播放
	function play(){
		player.play();
		//控制条隐藏
		control.className = "opacity";
		//视频中间的播放图标隐藏
		icon.className = icon.className.replace(/inline/,"none");
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

	//设置到指定大小音量
	function setVolume(percentage){
		//percentage有可能大于1小于0，这样player.volume的值就不在[0,1]之间
		if(percentage > 1){
			percentage = 1;
		}else if(percentage < 0){
			percentage = 0;
		}
		var now = ((1 - percentage)*100).toFixed(0) + "%";
		//video标签音量更改
		player.volume = (1 - percentage);
		//音量控制条填充
		nowSize.style.height = now;
		//控制条上的小球跟着移动
		sizeBall.style.bottom = ((1 - percentage)*100).toFixed(0) - 10 + "%";
		//音量大小文字
		sizeNum.innerHTML = now;
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
		//恢复播放器点击事件
		player.onclick = function(){
			playerClick();
		}
		chongbo.className = chongbo.className.replace(/inline/,"none");
		assist_stop.className = assist_stop.className.replace(/none/,"inline");
		assist_chongbo.className = assist_chongbo.className.replace(/inline/,"none");
		player.currentTime = 0;
		play();
	}

	//视频加载完后获取总时长
	player.onloadedmetadata = function(){
		//在另外一个视频播放时切换视频，新视频加载完成后显示图标
		stop();
		total = player.duration;
		document.querySelector("#player-duration").innerHTML = stom(total);
		//初始化音量
		var percentage = localStorage.getItem("volume");
		if(percentage){
			setVolume(percentage);
		}
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
	player.onclick = function(){
		playerClick();
	}

	//移动端点击就会触发hover，所以css中不用hover控制控制条显示
	//鼠标移入container显示控制条
	container.onmouseover = function(){
		if(isPlay){
			control.className = "";
		}
	}

	//鼠标移出淡出控制条
	container.onmouseout = function(){
		if(isPlay){
			control.className = "opacity";
		}
	}

	icon.onclick = function(){
		play();
	};

	assist_play.onclick = function(){
		play();
	}

	assist_stop.onclick = function(){
		stop();
	}

	//点击进度条快进快退
	progressBar.onclick = function(event){
		//点击位置 = (点击点距离浏览器左侧距离 - 触发元素距离浏览器左侧距离) / 元素宽
		var percentage = (event.clientX-this.getBoundingClientRect().left) / this.clientWidth;
		timeBall.style.left = (percentage*100) + "%";
		player.currentTime = total * percentage;
		//如果没有在播放
		if(!isPlay){
			play();
		}
	}

	//拖动进度条小球快进快退
	timeBall.onmousedown = function(e){
		//阻止事件冒泡
		e.stopPropagation();
		progressBar.onmousemove = function(event){
			var percentage = (event.clientX-this.getBoundingClientRect().left) / this.clientWidth;
			timeBallDrag = true;
			moveTimeBall(percentage);
		}
	}

	//当鼠标松开时注销onmousemove事件
	progressBar.onmouseup = function(){
		progressBar.onmousemove = null;
		timeBallDrag = false;
	}

	//静音
	playerVolume.onclick = function(){
		if(isMute){
			//如果静音，则恢复到之前设置的音量
			playerVolume.className = playerVolume.className.replace(/icon-jingyin/,"icon-yinliang");
			var percentage = localStorage.getItem("volume");
			setVolume(percentage);
		}else{
			playerVolume.className = playerVolume.className.replace(/icon-yinliang/,"icon-jingyin");
			setVolume(1);
		}
		isMute = !isMute;
	}

	//控制音量
	chooseSize.onclick = function(event){
		//(点击点距离浏览器顶部距离 - 触发元素距离浏览器顶部距离) / 元素高
		var percentage = (event.clientY-this.getBoundingClientRect().top) / this.clientHeight;
		setVolume(percentage);
		//储存到本地
		localStorage.setItem("volume",percentage);
	}

	sizeBall.onmousedown = function(e){
		//阻止事件冒泡
		e.stopPropagation();
		chooseSize.onmousemove = function(event){
			var percentage = (event.clientY-this.getBoundingClientRect().top) / this.clientHeight;
			setVolume(percentage);
		}
	}

	//当鼠标松开或离开chooseSize时注销onmousemove事件
	chooseSize.onmouseup = function(){
		chooseSize.onmousemove = null;
	}
	chooseSize.onmouseout = function(){
		chooseSize.onmousemove = null;
	}

	//全屏切换
	full.onclick = function(){
		copy.className = copy.className.replace(/none/,"inline");
		full.className = full.className.replace(/inline/,"none");
		setFull(container);
	}

	copy.onclick = function(){
		full.className = full.className.replace(/none/,"inline");
		copy.className = copy.className.replace(/inline/,"none");
		outFill()
	}

	//播放结束，显示重播按钮
	player.onended = function(){
		player.onclick = null;
		chongbo.className = chongbo.className.replace(/none/,"inline");
		assist_stop.className = assist_stop.className.replace(/inline/,"none");
		assist_chongbo.className = assist_chongbo.className.replace(/none/,"inline");
	}

	chongbo.onclick = function(){
		replay();
	}

	assist_chongbo.onclick = function(){
		replay();
	}
}())