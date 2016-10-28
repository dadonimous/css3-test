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
		var $box = $(this);
		if (mouseOverElementId == $box.attr('id')) {
			$box.css('box-shadow', '');
			$box.css('background', '');
		} else {
			var shadowXOffset = 0, shadowYOffset = 0, blurRadius = 0, distance = 0, distancCapped, blurRadius = 0, spreadRadius = 0, opacity, gradientPercent, backgroundColor, backgroundColorDarker;

			var boxPosition = $box.offset();
			var boxWidth = $box.width();
			var boxHeight = $box.height();

			var boxCenter = { x:(boxPosition.left + boxWidth / 2), y:(boxPosition.top + boxHeight/2) };
			var mousePosition = { x:pageX, y:pageY };
			var angleDeg = Math.atan2(mousePosition.y - boxCenter.y, mousePosition.x - boxCenter.x) * 180 / Math.PI;

			// get background-color for gradient
			backgroundColor = 'rgb(51, 133, 255)';
			backgroundColorDarker = 'rgb(0, 82, 198)';

			// calculate the distance
			distance = Math.sqrt( (boxCenter.x-mousePosition.x)*(boxCenter.x-mousePosition.x) + (boxCenter.y-mousePosition.y)*(boxCenter.y-mousePosition.y) );

			// calculate spread radius
			spreadRadius = Math.round((distance - 100) / 10);

			// calculate shadow x offset
			shadowXOffset = Math.round(10 * (1 - Math.abs(Math.sin(angleDeg * Math.PI / 180))) + (spreadRadius * Math.abs(Math.cos(angleDeg * Math.PI / 180))));
			if ((Math.abs(angleDeg) > 0 && Math.abs(angleDeg) < 90)) { shadowXOffset = (-1) * shadowXOffset; }

			// calculate shadow y offset
			shadowYOffset = Math.round(10 * Math.abs(Math.cos(angleDeg * Math.PI / 180 + Math.PI / 2)) + (spreadRadius * Math.abs(Math.sin(angleDeg * Math.PI / 180))));
			if (angleDeg > 0) { shadowYOffset = (-1) * shadowYOffset; }

			blurRadius = spreadRadius;
			opacity = roundToTwo(1 - (distance - 100) / 300);
			if (opacity < 0) { opacity = 0; }

			gradientPercent = ((distance - 100) / 300) * 100;
			if (gradientPercent > 100) { gradientPercent = 100; }
			if (gradientPercent < 0) { gradientPercent = 0; }

			$box.css('box-shadow', shadowXOffset + 'px ' + shadowYOffset + 'px ' + blurRadius + 'px ' + spreadRadius + 'px rgba(0, 0, 0, ' + opacity + ')');

			// radial gradient for boxes
			var boxRadialX, boxRadialY;
			var angleRightTop, angleLeftTop, angleRightBottom, angleLeftBottom;

			angleRightBottom = Math.atan2(boxHeight, boxWidth) * 180 / Math.PI;
			angleRightTop = (-1) * angleRightBottom;
			angleLeftBottom = 180 - angleRightBottom;
			angleLeftTop = (-1) * angleLeftBottom;

			$box.find('.badge-left-top').text(roundToTwo(angleLeftTop) + '°');
			$box.find('.badge-right-top').text(roundToTwo(angleRightTop) + '°');
			$box.find('.badge-left-bottom').text(roundToTwo(angleLeftBottom) + '°');
			$box.find('.badge-right-bottom').text(roundToTwo(angleRightBottom) + '°');
			$box.find('.badge-center').text(roundToTwo(angleDeg) + '°');

			// boxRadialY
			if (angleDeg >= angleLeftTop && angleDeg <= angleRightTop) { boxRadialY = 0;
			} else if (angleDeg >= angleRightBottom && angleDeg <= angleLeftBottom) { boxRadialY = boxHeight;
			} else if ((angleDeg >= angleRightTop && angleDeg <= 0) || (angleDeg >= 0 && angleDeg <= angleRightBottom)) {
				boxRadialY = boxHeight / 2 + (boxWidth / 2) * Math.tan(angleDeg * Math.PI / 180);
			} else { boxRadialY = boxHeight / 2 - (boxWidth / 2) * Math.tan(angleDeg * Math.PI / 180); }

			// boxRadialX
			if ((angleDeg >= angleRightTop && angleDeg <= 0) || (angleDeg >= 0 && angleDeg <= angleRightBottom)) { boxRadialX = boxWidth;
			} else if ((angleDeg >= -185 && angleDeg <= angleLeftTop) || (angleDeg >= angleLeftBottom && angleDeg <= 185)) { boxRadialX = 0;
			} else if ((angleDeg >= -90 && angleDeg < angleRightTop) || (angleDeg >= angleRightBottom && angleDeg < 90)) {
				boxRadialX = (boxWidth / 2) + Math.abs((boxHeight / 2) / Math.tan(angleDeg * Math.PI / 180));
			} else if ((angleDeg >= angleLeftTop && angleDeg < -90) || (angleDeg >= 90 && angleDeg < angleLeftBottom)) {
				boxRadialX = (boxWidth / 2) - Math.abs((boxHeight / 2) / Math.tan(angleDeg * Math.PI / 180));
			}

			$box.css('background', 'radial-gradient(circle at ' + boxRadialX + 'px ' + boxRadialY + 'px, ' + backgroundColor + ', ' + backgroundColorDarker + ')');
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
