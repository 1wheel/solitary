var enterPx = 1,
		durationPx = 400,
		exitPx = 25;

var data = [
	{sound: 'audio/1.ogg', duration: 400, onView: runOnlyOnce(playVideo)},
	{sound: 'audio/2.ogg', duration: 400, onView: runOnlyOnce(drawBars)},
	{sound: 'audio/3.ogg', duration: 400, onView: runOnlyOnce(function(){ console.log('testFun'); })},
	{sound: 'audio/4.ogg', duration: 400, onView: function(){}},
	{sound: 'audio/5.ogg', duration: 400, onView: function(){}},
	{sound: 'audio/6.ogg', duration: 400, onView: function(){}}
]

function runOnlyOnce(fun){
	var ranAlready = false;
	return function(){
		if (ranAlready){ return; }
		ranAlready = true;
		fun();
	}
}

var sectionDivs = d3.selectAll('.sectionDiv')
		.data(data)
		.each(function(d, i){
			var previousDurations = d3.sum(data
					.filter(function(d, j){ return j < i; })
					.map(function(d){ return d.duration }));
			var offset = (enterPx + exitPx)*i + previousDurations;

			d3.select(this)
					.attr(str(offset), "top:100%;color:rgb(0, 0, 1)")
					.attr(str(offset += enterPx), "top:0%;color:rgb(0, 0, 0)")
					.attr(str(offset += durationPx), "top:0%;display:block;color:rgb(0, 0, 0)")
					.attr(str(offset += exitPx), "top:-100%;display:none;;color:rgb(0, 0, 1)")
				.append('audio')
					.attr('src', function(d, i){ return d.sound; })
		});

function str(d){ return 'data-' + d; }


skrollr.init();

var lastScroll
d3.select('#playButton').on('click', function(){
	lastScroll = $('body').scrollTop();
	$('body,html').animate({scrollTop: document.height}, (1 - $('body').scrollTop()/document.height)*60000); 
});



$(window).scroll(function (){
	if (Math.abs($('body').scrollTop() - lastScroll) > 4){
		$('body,html').stop() 
	}
	lastScroll = $('body').scrollTop()
	sectionDivs.each(function(d, i){ 
		if (d3.select(this).style('color') == "rgb(0, 0, 0)"){
			d3.select(this).select('audio').node().play();
			d.onView();
		}
		else{
			d3.select(this).select('audio').node().pause();			
		}
	});
});

// d3.selectAll('.sectionDiv').each(function(){
// 	$(this).bind('inview', function (event, visible) {
// 	  if (visible == true) {
// 	    // element is now visible in the viewport
// 	  	console.log(d3.select(this).text());
// 	  } else {
// 	    // element has gone out of viewport
// 	    console.log('out');
// 	  }
// 	});
// });
