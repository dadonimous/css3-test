$(function() {
	$('.container').pIlluminate({ angleBadgesVisible: false, boxRadialGradientColorStop2: 'rgb(0, 81, 196)' });
	$('body').on('mousemove', function(e) { $(this).trigger('illuminate.lightmove', [{ left: e.pageX, top: e.pageY }]); });
});
