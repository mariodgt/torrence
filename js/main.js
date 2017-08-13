/***/
(function() {
    //@prepros-prepend functions.js
    //@prepros-prepend home/sliderprincipal.js
    //@prepros-prepend home/exclusive-listing.js
    //@prepros-prepend home/scroolltoload.js
    
	$(document).on('click', '#nextSection', function() {
		$('html, body').animate({
			scrollTop: $('#exclusiveListing').offset().top
		}, 900);
	});

}());