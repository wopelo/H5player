(function(){
    //判断设备，加载对应的js文件
	var element = document.createElement("script");
    if( navigator.userAgent.match(/Android/i)  
    || navigator.userAgent.match(/webOS/i)  
    || navigator.userAgent.match(/iPhone/i)  
    || navigator.userAgent.match(/iPad/i)  
    || navigator.userAgent.match(/iPod/i)  
    || navigator.userAgent.match(/BlackBerry/i)  
    || navigator.userAgent.match(/Windows Phone/i)  
    ){
        //移动端，调用移动端js，相对路径是以html为基准
        element.src = "./js/forMobile.js";
    }
    else {
    	//pc端
        element.src = "./js/forPc.js";
    }
    document.body.appendChild(element);

    //获取播放列表
    var playList = document.querySelector("#play-list");
    //获取播放器
    var player = document.querySelector("#v-player");
    //获取source
    var source = document.querySelector("#source");
    //datas可以通过ajax获取
    var datas = [
        {
            'name': '告白气球',
            'poster': 'http://p8hsehkmu.bkt.clouddn.com/%E5%91%8A%E7%99%BD%E6%B0%94%E7%90%83.jpg',
            'mv': 'http://p8hsehkmu.bkt.clouddn.com/%E5%91%8A%E7%99%BD%E6%B0%94%E7%90%83.mp4'
        },
        {
            'name': 'uptownFunk',
            'poster': 'http://p8hsehkmu.bkt.clouddn.com/%E7%81%AB%E6%98%9F%E5%93%A5.jpg',
            'mv': 'http://p8hsehkmu.bkt.clouddn.com/Uptown%20Funk.mp4'
        }
    ];  

    for(var n in datas){
        var item = datas[n];
        var ele =document.createElement("div");
        ele.className = "list-item";
        ele.setAttribute("poster",item.poster);
        ele.setAttribute("mv",item.mv);
        ele.onclick = function(e){
            var mv = e.currentTarget.getAttribute("mv");
            var poster = e.currentTarget.getAttribute("poster");
            player.setAttribute("poster",poster);
            source.setAttribute("src",mv);
            //重新加载视频
            player.load();
        }
        var poster = "<div class='item-poster'>" + "<img src='" + item.poster + "'>" + "</div>";
        ele.innerHTML = poster + "<div>" + item.name + "</div>";
        playList.appendChild(ele);
    }

}())