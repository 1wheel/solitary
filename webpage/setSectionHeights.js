var introPx = 20,
		enterPx = 20,
		durationPx = 400,
		exitPx = 20;

var data = [
	{sound: 'audio/1.ogg', name: 'BBC Video', 			duration: 400, onView: runOnlyOnce(playVideo)},
	{sound: 'audio/2.ogg', name: 'Testing', 				duration: 400, onView: runOnlyOnce(drawBars)},
	{sound: 'audio/3.ogg', name: 'Prison Violence', duration: 400, onView: runOnlyOnce(function(){ console.log('testFun'); })},
	{sound: 'audio/4.ogg', name: 'Deform/Reform ', 	duration: 400, onView: function(){}},
	{sound: 'audio/5.ogg', name: 'Costly', 					duration: 400, onView: function(){}},
	{sound: 'audio/6.ogg', name: '', 								duration: 400, onView: function(){}}
];

data.forEach(function(d, i){
	var previousDurations = d3.sum(data
		.filter(function(d, j){ return j < i; })
		.map(function(d){ return d.duration }));
	d.offset = (enterPx + exitPx)*i + previousDurations + introPx;
});

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
			var offset = d.offset;

			d3.select(this)
					.attr(str(offset), "top:100%;color:rgb(0, 0, 1)")
					.attr(str(offset+1), "top:0%;color:rgb(0, 0, 1);opacity:0;")
					.attr(str(offset += enterPx), "top:0%;color:rgb(0, 0, 0);opacity:1")
					.attr(str(offset += durationPx), "top:0%;display:block;color:rgb(0, 0, 0);opacity:1;")
					.attr(str(offset += exitPx), "top:0%;display:none;color:rgb(0, 0, 1);opacity:0")
				.append('audio')
					.attr('src', function(d, i){ return d.sound; })
		});
function str(d){ return 'data-' + d; }

var sectionLinks = d3.select('#progress').selectAll('.sectionLinks')
		.data(data).enter()
	.append('a')
		.classed('headerLink', true)
		.text(function(d, i){ return d.name; })
		.on('click', function(d, i){ 
			window.scrollTo(0, d.offset + enterPx);
			scrollUpdate();
		});


skrollr.init();

var lastScroll;
var currentlyPlaying = false;
d3.select('#playButton,#headerPlay').on('click', function(){
	currentlyPlaying = !currentlyPlaying;
	if (currentlyPlaying){
		lastScroll = $('body').scrollTop();
		$('body,html').animate({scrollTop: document.height}, (1 - $('body').scrollTop()/document.height)*document.height*10); 
	}
	else{
		$('body,html').stop();
	}
	d3.select('#headerPlay').text(currentlyPlaying ? '■' : '▶');//❚');
});

$(window).scroll(scrollUpdate);


function scrollUpdate(){
	var scrollPos = $('body').scrollTop()
	if (Math.abs(scrollPos - lastScroll) > 10){
		console.log('stopping scroll')
		d3.select('#headerPlay').text('▶');
		$('body,html').stop() 
	}
	lastScroll = scrollPos;

	var currentSection = '';
	sectionDivs.each(function(d, i){ 
		if (d.offset + enterPx <= scrollPos && scrollPos < d.offset + enterPx + d.duration){
			console.log(d.name);
			d3.select(this).select('audio').node().play();
			d.onView();
			currentSection = d.name;
		}
		else{
			d3.select(this).select('audio').node().pause();			
		}
	});
	sectionLinks
			.style('text-decoration', function(d, i){ return d.name == currentSection ? 'underline' : ''; })
}


//on load stuff
var introDuration = 1000;
var introNum = d3.selectAll('.introDiv').transition()
		.delay(function(d, i){ return i*introDuration; })
		.duration(introDuration)
		.style('opacity', 1)
	.size();
d3.select('#progress').transition()
		.delay(introDuration*introNum)
		.duration(introDuration)
		.style('opacity', 1);
scrollUpdate();
