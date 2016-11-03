(function ($) {
    $.fn.pIlluminate = function (option, settings) {
        if (typeof option === 'object') {
            settings = option;
        }

        return this.each(function () {
            var $elem = $(this);
            var $settings = $.extend({}, $.fn.pIlluminate.defaultSettings, settings || {});
            var illuminate = new Illuminate($settings, $elem);
            var $el = illuminate.initialize();
        });
    }

    $.fn.pIlluminate.defaultSettings = {
		angleBadgesVisible: false,
        bodyRadialGradientColorStop1: '#FFFFFF',
		bodyRadialGradientColorStop2: 'gray',
		boxRadialGradientColorStop1: 'rgb(51, 133, 255)',
		boxRadialGradientColorStop2: 'rgb(0, 82, 198)',
		mouseOverElementId: null
    };

    function Illuminate(settings, $elem) {
        this.illuminate = null;
        this.settings = settings;
        this.$elem = $elem;
        return this;
    }
	
	function roundToN(num, n) { return +(Math.round(num + "e+" + parseInt(n).toString()) + "e-" + parseInt(n).toString()); }
	
	function roundToTwo(num) { return roundToN(num, 2); }

    Illuminate.prototype =
	{
	    initialize: function () {
	        var $this = this;
	        if ($this.illuminate) return $this.illuminate;

	        if (!$this.$elem.hasClass('illuminate-container'))
	            $this.$elem.addClass('illuminate-container');
			
			var $illuminateContainer = $this.$elem;
	        $illuminateContainer.find('.illuminate-box').each(function() {
				$(this).css({ 'background-color': $this.settings.boxRadialGradientColorStop2 });
			
				var $illuminateBoxContent = $(this).find('.illuminate-box-content');
				var $badgeLeftTop = $illuminateBoxContent.find('.badge-left-top');
				var $badgeRightTop = $illuminateBoxContent.find('.badge-right-top');
				var $badgeLeftBottom = $illuminateBoxContent.find('.badge-left-bottom');
				var $badgeRightBottom = $illuminateBoxContent.find('.badge-right-bottom');
				var $badgeCenter = $illuminateBoxContent.find('.illuminate-box-title > .badge-center');
				
				if ($this.settings.angleBadgesVisible) {
					if ($badgeLeftTop.length == 0) { $illuminateBoxContent.append('<span class="badge badge-left-top"></span>');
					} else { $badgeLeftTop.removeClass('hidden'); }
					
					if ($badgeRightTop.length == 0) { $illuminateBoxContent.append('<span class="badge badge-right-top"></span>');
					} else { $badgeRightTop.removeClass('hidden'); }
					
					if ($badgeLeftBottom.length == 0) { $illuminateBoxContent.append('<span class="badge badge-left-bottom"></span>');
					} else { $badgeLeftBottom.removeClass('hidden'); }
					
					if ($badgeRightBottom.length == 0) { $illuminateBoxContent.append('<span class="badge badge-right-bottom"></span>');
					} else { $badgeRightBottom.removeClass('hidden'); }
					
					if ($badgeCenter.length == 0) { $illuminateBoxContent.find('.illuminate-box-title').append('<br /><span class="badge badge-center"></span>');
					} else { $badgeCenter.removeClass('hidden'); }
				} else {
					$badgeLeftTop.removeClass('hidden').addClass('hidden');
					$badgeRightTop.removeClass('hidden').addClass('hidden');
					$badgeLeftBottom.removeClass('hidden').addClass('hidden');
					$badgeRightBottom.removeClass('hidden').addClass('hidden');
					$badgeCenter.removeClass('hidden').addClass('hidden');
				}
			});
			
			$('body').css({ 'background-color': $this.settings.bodyRadialGradientColorStop2 });
			$('body').on('mousemove', function(e) { setBackgroundAnimation(e.pageX, e.pageY); setAnimation(e.pageX, e.pageY); });
			$illuminateContainer.on('mouseenter', '.illuminate-box, .illuminate-text', function() { $this.settings.mouseOverElementId = $(this).attr('id'); });
			$illuminateContainer.on('mouseleave', '.illuminate-box, .illuminate-text', function() { $this.settings.mouseOverElementId = null; });
			
			function setBackgroundAnimation(pageX, pageY) {
				$('body').css('background', 'radial-gradient(circle at ' + pageX + 'px ' + pageY + 'px, ' + $this.settings.bodyRadialGradientColorStop1 + ', ' + $this.settings.bodyRadialGradientColorStop2 + ')');
			}
			
			function setAnimation(pageX, pageY) {
				$illuminateContainer.find('.illuminate-box').each(function() {
					var $box = $(this);
					if ($this.settings.mouseOverElementId == $box.attr('id')) {
						$box.css('box-shadow', '');
						$box.css('background', '');
						$box.css('background-color', $this.settings.boxRadialGradientColorStop1);
					} else {
						var shadowXOffset = 0, shadowYOffset = 0, blurRadius = 0, distance = 0, distancCapped, spreadRadius = 0, opacity, gradientPercent, backgroundColor, backgroundColorDarker;

						var boxPosition = $box.offset();
						var boxWidth = $box.width();
						var boxHeight = $box.height();

						var boxCenter = { x:(boxPosition.left + boxWidth / 2), y:(boxPosition.top + boxHeight/2) };
						var mousePosition = { x:pageX, y:pageY };
						var angleDeg = Math.atan2(mousePosition.y - boxCenter.y, mousePosition.x - boxCenter.x) * 180 / Math.PI;

						// get background-color for gradient
						backgroundColor = $this.settings.boxRadialGradientColorStop1;
						backgroundColorDarker = $this.settings.boxRadialGradientColorStop2;

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
				
				$illuminateContainer.find('.illuminate-text').each(function() {
					var $elem = $(this); // in-line element containing text
					if ($this.settings.mouseOverElementId == $elem.attr('id')) {
						$elem.css('text-shadow', '');
					} else {
						var shadowXOffset = 0, shadowYOffset = 0, blurRadius = 0, distance = 0, distancCapped, spreadRadius = 0, opacity;

						var elemPosition = $elem.offset();
						var elemWidth = $elem.width();
						var elemHeight = $elem.height();

						var boxCenter = { x:(elemPosition.left + elemWidth / 2), y:(elemPosition.top + elemHeight/2) };
						var mousePosition = { x:pageX, y:pageY };
						var angleDeg = Math.atan2(mousePosition.y - boxCenter.y, mousePosition.x - boxCenter.x) * 180 / Math.PI;

						// calculate the distance
						distance = Math.sqrt( (boxCenter.x-mousePosition.x)*(boxCenter.x-mousePosition.x) + (boxCenter.y-mousePosition.y)*(boxCenter.y-mousePosition.y) );

						// calculate spread radius
						blurRadius = Math.round(distance / 10);

						// calculate shadow x offset
						shadowXOffset = Math.round(blurRadius * Math.abs(Math.cos(angleDeg * Math.PI / 180)));
						if ((Math.abs(angleDeg) > 0 && Math.abs(angleDeg) < 90)) { shadowXOffset = (-1) * shadowXOffset; }

						// calculate shadow y offset
						shadowYOffset = Math.round(blurRadius * Math.abs(Math.sin(angleDeg * Math.PI / 180)));
						if (angleDeg > 0) { shadowYOffset = (-1) * shadowYOffset; }

						opacity = roundToTwo(1 - (distance - 100) / 300);
						if (opacity < 0) { opacity = 0; }

						$elem.css('text-shadow', shadowXOffset + 'px ' + shadowYOffset + 'px ' + blurRadius + 'px rgba(0, 0, 0, ' + opacity + ')');
					}
				});
			}

	        return $this.illuminate;
	    }
	}
})(jQuery);