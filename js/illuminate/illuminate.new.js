function Illuminate(options) {
	var illuminate = null;
	this.defaultOptions = {
		angleBadgesVisible: false,
        bodyRadialGradientColorStop1: "#FFFFFF",
		bodyRadialGradientColorStop2: "gray",
		boxColors: {
			blue: {
				gradientColorStop1: "rgb(33, 150, 243)",
				gradientColorStop2: "rgb(13, 71, 161)",
				shadowColorRGB: {
					red: 14,
					green: 47,
					blue: 100
				}
			},
			purple: {
				gradientColorStop1: "rgb(103, 58, 183)",
				gradientColorStop2: "rgb(49, 27, 146)",
				shadowColorRGB: {
					red: 61,
					green: 49,
					blue: 117
				}
			},
			orange: {
				gradientColorStop1: "rgb(255, 152, 0)",
				gradientColorStop2: "rgb(230, 81, 0)",
				shadowColorRGB: {
					red: 151,
					green: 58,
					blue: 8
				}
			}
		},
		renderInterval: 33, // in miliseconds
		mouseOverElementId: null,
		lightPosition: null,
		lastRenderedLightPosition: null
	};
	this.options = $.extend({}, this.defaultOptions, options || {});
	
	this.$illuminateContainer = null;
	
	return this.initialize();
}

Illuminate.prototype = {
	initialize: function() {
		var $this = this;
		if ($this.illuminate) { return $this.illuminate; }
			
		$this.$illuminateContainer = $(".illuminate-container");
		$this.$illuminateContainer.find(".illuminate-box").each(function() {
			var $box = $(this); 
			var color = $this.options.boxColors.blue.gradientColorStop2;
			if ($box.hasClass("purple")) {
				color = $this.options.boxColors.purple.gradientColorStop2;
			} else if ($box.hasClass("orange")) {
				color = $this.options.boxColors.orange.gradientColorStop2;
			}
			
			$box.css({ "background-color": color });
		
			var $illuminateBoxContent = $box.find(".illuminate-box-content");
			var $badgeLeftTop = $illuminateBoxContent.find(".badge-left-top");
			var $badgeRightTop = $illuminateBoxContent.find(".badge-right-top");
			var $badgeLeftBottom = $illuminateBoxContent.find(".badge-left-bottom");
			var $badgeRightBottom = $illuminateBoxContent.find(".badge-right-bottom");
			var $badgeCenter = $illuminateBoxContent.find(".illuminate-box-title > .badge-center");
			
			if ($this.options.angleBadgesVisible) {
				if ($badgeLeftTop.length == 0) { $illuminateBoxContent.append("<span class='badge badge-left-top'></span>");
				} else { $badgeLeftTop.removeClass("hidden"); }
				
				if ($badgeRightTop.length == 0) { $illuminateBoxContent.append("<span class='badge badge-right-top'></span>");
				} else { $badgeRightTop.removeClass("hidden"); }
				
				if ($badgeLeftBottom.length == 0) { $illuminateBoxContent.append("<span class='badge badge-left-bottom'></span>");
				} else { $badgeLeftBottom.removeClass("hidden"); }
				
				if ($badgeRightBottom.length == 0) { $illuminateBoxContent.append("<span class='badge badge-right-bottom'></span>");
				} else { $badgeRightBottom.removeClass("hidden"); }
				
				if ($badgeCenter.length == 0) { $illuminateBoxContent.find(".illuminate-box-title").append("<br /><span class='badge badge-center'></span>");
				} else { $badgeCenter.removeClass("hidden"); }
			} else {
				$badgeLeftTop.removeClass("hidden").addClass("hidden");
				$badgeRightTop.removeClass("hidden").addClass("hidden");
				$badgeLeftBottom.removeClass("hidden").addClass("hidden");
				$badgeRightBottom.removeClass("hidden").addClass("hidden");
				$badgeCenter.removeClass("hidden").addClass("hidden");
			}
		});
		
		$("body").css({ "background-color": $this.options.bodyRadialGradientColorStop2 });
		$("body").on("illuminate.lightmove", function(e, position) { $this.options.lightPosition = position; });
		setInterval(function() {
			if ($this.options.lightPosition != null && $this.options.lightPosition != undefined &&
				JSON.stringify($this.options.lightPosition) !== JSON.stringify($this.options.lastRenderedLightPosition)) {
				$this.setBackgroundAnimation();
				$this.setAnimation();
				$this.options.lastRenderedLightPosition = $.extend(true, {}, $this.options.lightPosition);
			}}, $this.options.renderInterval);
		$this.$illuminateContainer.on("mouseenter", ".illuminate-box, .illuminate-text", function() { $this.options.mouseOverElementId = $(this).attr("id"); });
		$this.$illuminateContainer.on("mouseleave", ".illuminate-box, .illuminate-text", function() { $this.options.mouseOverElementId = null; });
		
		return $this.pluginName;
	},
	roundToN: function(num, n) { 
		return +(Math.round(num + "e+" + parseInt(n).toString()) + "e-" + parseInt(n).toString()); },
	roundToTwo: function(num) { 
		var $this = this;
		return $this.roundToN(num, 2); },
	setAnimation: function() {
		var $this = this;
		$this.$illuminateContainer.find(".illuminate-box").each(function() {
			var $box = $(this);
			if ($this.options.mouseOverElementId == $box.attr("id")) {
				var color = $this.options.boxColors.blue.gradientColorStop1;
				if ($box.hasClass("purple")) {
					color = $this.options.boxColors.purple.gradientColorStop1;
				} else if ($box.hasClass("orange")) {
					color = $this.options.boxColors.orange.gradientColorStop1;
				}
				
				$box.css("box-shadow", "");
				$box.css("background", "");
				$box.css("background-color", color);
			} else {
				var shadowXOffset = 0, shadowYOffset = 0, blurRadius = 0, distance = 0, distancCapped, spreadRadius = 0, opacity, gradientPercent, backgroundColor, backgroundColorDarker, shadowColor;

				var boxPosition = $box.offset();
				var boxWidth = $box.width();
				var boxHeight = $box.height();

				var boxCenter = { left:(boxPosition.left + boxWidth / 2), top:(boxPosition.top + boxHeight/2) };
				var angleDeg = Math.atan2($this.options.lightPosition.top - boxCenter.top, $this.options.lightPosition.left - boxCenter.left) * 180 / Math.PI;

				// get background-color for gradient
				backgroundColor = $this.options.boxColors.blue.gradientColorStop1;
				backgroundColorDarker = $this.options.boxColors.blue.gradientColorStop2;
				
				if ($box.hasClass("purple")) {
					backgroundColor = $this.options.boxColors.purple.gradientColorStop1;
					backgroundColorDarker = $this.options.boxColors.purple.gradientColorStop2;
				} else if ($box.hasClass("orange")) {
					backgroundColor = $this.options.boxColors.orange.gradientColorStop1;
					backgroundColorDarker = $this.options.boxColors.orange.gradientColorStop2;
				}

				// calculate the distance
				distance = Math.sqrt( (boxCenter.left-$this.options.lightPosition.left)*(boxCenter.left-$this.options.lightPosition.left) + (boxCenter.top-$this.options.lightPosition.top)*(boxCenter.top-$this.options.lightPosition.top) );

				// calculate spread radius
				spreadRadius = Math.round((distance - 100) / 10);

				// calculate shadow x offset
				shadowXOffset = Math.round(10 * (1 - Math.abs(Math.sin(angleDeg * Math.PI / 180))) + (spreadRadius * Math.abs(Math.cos(angleDeg * Math.PI / 180))));
				if ((Math.abs(angleDeg) > 0 && Math.abs(angleDeg) < 90)) { shadowXOffset = (-1) * shadowXOffset; }

				// calculate shadow y offset
				shadowYOffset = Math.round(10 * Math.abs(Math.cos(angleDeg * Math.PI / 180 + Math.PI / 2)) + (spreadRadius * Math.abs(Math.sin(angleDeg * Math.PI / 180))));
				if (angleDeg > 0) { shadowYOffset = (-1) * shadowYOffset; }

				blurRadius = spreadRadius;
				opacity = $this.roundToTwo(1 - (distance - 100) / 300);
				if (opacity < 0) { opacity = 0; }

				gradientPercent = ((distance - 100) / 300) * 100;
				if (gradientPercent > 100) { gradientPercent = 100; }
				if (gradientPercent < 0) { gradientPercent = 0; }

				if ($box.hasClass("blue")) {
					$box.css("box-shadow", shadowXOffset + "px " + shadowYOffset + "px " + blurRadius + "px " + spreadRadius + "px rgba(" + $this.options.boxColors.blue.shadowColorRGB.red + ", " + $this.options.boxColors.blue.shadowColorRGB.green + ", " + $this.options.boxColors.blue.shadowColorRGB.blue + ", " + opacity + ")");
				} else if ($box.hasClass("purple")) {
					$box.css("box-shadow", shadowXOffset + "px " + shadowYOffset + "px " + blurRadius + "px " + spreadRadius + "px rgba(" + $this.options.boxColors.purple.shadowColorRGB.red + ", " + $this.options.boxColors.purple.shadowColorRGB.green + ", " + $this.options.boxColors.purple.shadowColorRGB.blue + ", " + opacity + ")");
				} else if ($box.hasClass("orange")) {
					$box.css("box-shadow", shadowXOffset + "px " + shadowYOffset + "px " + blurRadius + "px " + spreadRadius + "px rgba(" + $this.options.boxColors.orange.shadowColorRGB.red + ", " + $this.options.boxColors.orange.shadowColorRGB.green + ", " + $this.options.boxColors.orange.shadowColorRGB.blue + ", " + opacity + ")");
				}
				
				// radial gradient for boxes
				var boxRadialX, boxRadialY;
				var angleRightTop, angleLeftTop, angleRightBottom, angleLeftBottom;

				angleRightBottom = Math.atan2(boxHeight, boxWidth) * 180 / Math.PI;
				angleRightTop = (-1) * angleRightBottom;
				angleLeftBottom = 180 - angleRightBottom;
				angleLeftTop = (-1) * angleLeftBottom;

				$box.find(".badge-left-top").text($this.roundToTwo(angleLeftTop) + "°");
				$box.find(".badge-right-top").text($this.roundToTwo(angleRightTop) + "°");
				$box.find(".badge-left-bottom").text($this.roundToTwo(angleLeftBottom) + "°");
				$box.find(".badge-right-bottom").text($this.roundToTwo(angleRightBottom) + "°");
				$box.find(".badge-center").text($this.roundToTwo(angleDeg) + "°");

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

				$box.css("background", "radial-gradient(circle at " + boxRadialX + "px " + boxRadialY + "px, " + backgroundColor + ", " + backgroundColorDarker + ")");
			}
		});
		
		$this.$illuminateContainer.find(".illuminate-text").each(function() {
			var $elem = $(this); // in-line element containing text
			if ($this.options.mouseOverElementId == $elem.attr("id")) {
				$elem.css("text-shadow", "");
			} else {
				var shadowXOffset = 0, shadowYOffset = 0, blurRadius = 0, distance = 0, distancCapped, spreadRadius = 0, opacity;

				var elemPosition = $elem.offset();
				var elemWidth = $elem.width();
				var elemHeight = $elem.height();

				var boxCenter = { left:(elemPosition.left + elemWidth / 2), top:(elemPosition.top + elemHeight/2) };
				var angleDeg = Math.atan2($this.options.lightPosition.top - boxCenter.top, $this.options.lightPosition.left - boxCenter.left) * 180 / Math.PI;

				// calculate the distance
				distance = Math.sqrt( (boxCenter.left-$this.options.lightPosition.left)*(boxCenter.left-$this.options.lightPosition.left) + (boxCenter.top-$this.options.lightPosition.top)*(boxCenter.top-$this.options.lightPosition.top) );

				// calculate spread radius
				blurRadius = Math.round(distance / 10);

				// calculate shadow x offset
				shadowXOffset = Math.round(blurRadius * Math.abs(Math.cos(angleDeg * Math.PI / 180)));
				if ((Math.abs(angleDeg) > 0 && Math.abs(angleDeg) < 90)) { shadowXOffset = (-1) * shadowXOffset; }

				// calculate shadow y offset
				shadowYOffset = Math.round(blurRadius * Math.abs(Math.sin(angleDeg * Math.PI / 180)));
				if (angleDeg > 0) { shadowYOffset = (-1) * shadowYOffset; }

				opacity = $this.roundToTwo(1 - (distance - 100) / 300);
				if (opacity < 0) { opacity = 0; }

				$elem.css("text-shadow", shadowXOffset + "px " + shadowYOffset + "px " + blurRadius + "px rgba(0, 0, 0, " + opacity + ")");
			}
		});
	},
	setBackgroundAnimation: function() {
		var $this = this;
		$("body").css("background", "radial-gradient(circle at " + $this.options.lightPosition.left + "px " + $this.options.lightPosition.top + "px, " + $this.options.bodyRadialGradientColorStop1 + ", " + $this.options.bodyRadialGradientColorStop2 + ")");
	}
}