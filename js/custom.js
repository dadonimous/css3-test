var mouseOverElementId = null;
			
$(function() {
	$('body').on('mousemove', function(e) { setBackgroundAnimation(e.pageX, e.pageY); setAnimation(e.pageX, e.pageY); });
	$('.box').mouseenter(function() { mouseOverElementId = $(this).attr('id'); }).mouseleave(function() { mouseOverElementId = null; });
	
	alert('Testing css box-shadow, linear-gradient, radial-gradient and transition.')
});

function setBackgroundAnimation(pageX, pageY) {
	$('body').css('background', 'radial-gradient(circle at ' + pageX + 'px ' + pageY + 'px, #FFFFFF, gray)');
}

function setAnimation(pageX, pageY) {
	$('.box').each(function() {
		var $element = $(this);
		if (mouseOverElementId == $element.attr('id')) {
			$element.css('box-shadow', '');
			$element.css('background', '');
		} else {
			var shadowXOffset = 0, shadowYOffset = 0, blurRadius = 0, distance = 0, distancCapped, blurRadius = 0, spreadRadius = 0, opacity, gradientPercent, backgroundColor;
			
			var elementPosition = $element.offset();
			var elementWidth = $element.width();
			var elementHeight = $element.height();
			
			var elementCenter = { x:(elementPosition.left + elementWidth / 2), y:(elementPosition.top + elementHeight/2) };
			var mousePosition = { x:pageX, y:pageY };
			var angleDeg = Math.atan2(mousePosition.y - elementCenter.y, mousePosition.x - elementCenter.x) * 180 / Math.PI;
			
			// get backgraound-color for gradient
			backgroundColor = getBackgroundColor($element);
			
			// calculate the distance
			distance = Math.sqrt( (elementCenter.x-mousePosition.x)*(elementCenter.x-mousePosition.x) + (elementCenter.y-mousePosition.y)*(elementCenter.y-mousePosition.y) );
			
			// calculate spread radius, increase by 1 every 10px after 100px distance
			spreadRadius = Math.round((distance - 100) / 10);
			
			// calculate box-shadow x offset
			shadowXOffset = Math.round(10 * (1 - Math.abs(Math.sin(angleDeg * Math.PI / 180))) + (spreadRadius * Math.abs(Math.cos(angleDeg * Math.PI / 180))));
			if ((Math.abs(angleDeg) > 0 && Math.abs(angleDeg) < 90)) { shadowXOffset = (-1) * shadowXOffset; }
			
			// calculate box-shadow y offset
			shadowYOffset = Math.round(10 * Math.abs(Math.cos(angleDeg * Math.PI / 180 + Math.PI / 2)) + (spreadRadius * Math.abs(Math.sin(angleDeg * Math.PI / 180))));
			if (angleDeg > 0) { shadowYOffset = (-1) * shadowYOffset; }
			
			blurRadius = spreadRadius;
			
			// calculate the opacity of the box-shadow
			opacity = roundToTwo(1 - (distance - 100) / 300);
			if (opacity < 0) { opacity = 0; }
			
			gradientPercent = ((distance - 100) / 300) * 100;
			if (gradientPercent > 100) { gradientPercent = 100; }
			if (gradientPercent < 0) { gradientPercent = 0; }
			
			$element.css('box-shadow', shadowXOffset + 'px ' + shadowYOffset + 'px ' + blurRadius + 'px ' + spreadRadius + 'px rgba(0, 0, 0, ' + opacity + ')');
			$element.css('background', 'linear-gradient(' + (angleDeg + 90) + 'deg, #000, ' + backgroundColor + ' ' + gradientPercent + '%)');
		}
	});
}

function roundToTwo(num) { return +(Math.round(num + "e+2")  + "e-2"); }

function getBackgroundColor($element) {
	if ($element.hasClass('box-red')) {
		return '#ff3300';
	} else if ($element.hasClass('box-green')) {
		return '#009900';
	} else if ($element.hasClass('box-blue')) {
		return '#0066ff';
	} else {
		return '000000';
	}
}