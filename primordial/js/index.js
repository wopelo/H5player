var container = document.querySelector("#video-player")
var player = document.querySelector("#v-player");
var icon = document.querySelector("#icon-play");
var control = document.querySelector("#player-controls");
var progressBar = document.querySelector("#player-progressBar");
var timeBar = document.querySelector("#player-timeBar");
var current = document.querySelector("#player-current");
var assist_play = document.querySelector("#assist-play");
var assist_stop = document.querySelector("#assist-stop");
var full = document.querySelector("#player-fill");
var copy = document.querySelector("#player-copy");

//是否正在播放
var isPlay = false;
//视频总长
var total = 0;
//开始滑动点击位置
var startX = 0;

//播放
function play(){
	player.play();
	//控制条隐藏
	control.className = "opacity";
	//视频中间的播放图标隐藏
	icon.className = icon.className.replace(/\sinline/,"");
	icon.className += " none";
	//控制条左侧图标切换
	assist_play.className = assist_play.className.replace(/inline/,"none");
	assist_stop.className = assist_stop.className.replace(/none/,"inline");
	isPlay = true;
}

//暂停
function stop(){
	player.pause();
	control.className = "";
	icon.className = icon.className.replace(/\snone/," inline");
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

//视频加载完后获取总时长
player.onloadedmetadata = function(){
	total = player.duration;
	document.querySelector("#player-duration").innerHTML = stom(total);
}

//后面的代码移动端,pc分开

//播放/暂停图标点击效果
icon.onclick = function(){
	play();
};

assist_play.onclick = function(){
	play();
}

assist_stop.onclick = function(){
	stop();
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

//移动端滑动实现快进快退
player.ontouchstart = function(event){
	startX = event.targetTouches[0].pageX;
}

player.ontouchend = function(event){
	var dis = event.changedTouches[0].pageX - startX;
	if(dis > 0){
		player.currentTime += 5;
	}else if(dis < 0){
		player.currentTime -= 5;
	}
	//如果没有在播放
	if(!isPlay){
		play();
	}
}

//点击进度条快进快退
progressBar.onclick = function(event){
	//点击位置 = (点击点距离浏览器左侧距离 - 触发元素距离浏览器左侧距离) / 元素宽
	var percentage = (event.clientX-this.getBoundingClientRect().left) / this.clientWidth;
	player.currentTime = total * percentage;
	//如果没有在播放
	if(!isPlay){
		play();
	}
}


//点击屏幕播放/暂停
player.onclick = function(){
	if(isPlay){
		stop();
	}else{
		play();
	}
}

//实时更新播放位置
player.ontimeupdate = function(){
	var currentTime = this.currentTime;
	timeBar.style.width = currentTime/total *100 + "%"; 
	current.innerHTML = stom(currentTime);
}

// player.onend = function(){

// }