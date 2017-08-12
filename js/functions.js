var $cuerpo = $('body');
var $ventana = $(window);
var $widthVentana = $ventana.width();
var $htmlcuerpo = $('html, body');



function touchSlider(ulSlider, botonesNav) {
    var xDown = null;
    var yDown = null;
    ulSlider.on('touchstart', function(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    });
    ulSlider.on('touchmove', function(evt) {
        if (!xDown || !yDown) {
            return;
        }
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if (Math.abs(xDiff) > Math.abs(yDiff)) { // si se mueve derecha o izquierda
            evt.preventDefault();
            ulSlider.trigger('mouseenter');
            var nLis = botonesNav.length;
            var $elLiActivo = itemActivo(botonesNav);
            if (xDiff > 0) { // izquierda
                if (($elLiActivo + 1) !== nLis) {
                    botonesNav.eq($elLiActivo + 1).trigger('click');
                    ulSlider.trigger('mouseleave');
                } else {
                    botonesNav.eq(0).trigger('click');
                    ulSlider.trigger('mouseleave');
                }
            } else { // derecha
                if ($elLiActivo !== 0) {
                    botonesNav.eq($elLiActivo - 1).trigger('click');
                    ulSlider.trigger('mouseleave');
                }
            }
        }
        xDown = null;
        yDown = null;
    });
}

function itemActivo(losLi) { // refactorizar esto (nueva idea para la función).
    var nLis = losLi.length;
    for (var s = 0; s < nLis; s++) {
        if (losLi.eq(s).hasClass('active')) {
            return s;
        }
    }
}

function creaBullets(numeroLis, contentBullets) {
    if (contentBullets.length) {
        // borro los botones previos que existan.
        if (contentBullets.find('> *').length) {
            contentBullets.empty();
        }
        // Creo los botones
        var b = 0;
        while (b < numeroLis) {
            contentBullets.append('<button></button>');
            b++
        }
    } else {
        console.log('Error, Nav no found. You need put nav');
    }
}



function creaIframeVideo(elBoton) {
    var $urlVideo = elBoton.attr('data-video');
    if ($urlVideo !== undefined) {
        var $urlVideo = $urlVideo.toString();
        if ($urlVideo.indexOf('youtube') !== -1) { // es un video de Youtube, EJM: https://www.youtube.com/watch?v=9RBSH7Xvn3Q
            var srcVideo = 'https://www.youtube.com/embed/' + $urlVideo.substring($urlVideo.length - 11, $urlVideo.length) + '?autoplay=1';
        } else if ($urlVideo.indexOf('vimeo') !== -1) { // es un video de Vimeo, EJM: https://vimeo.com/206418873
            var srcVideo = 'https://player.vimeo.com/video/' + $urlVideo.substring(($urlVideo.indexOf('.com') + 5), $urlVideo.length).replace('/', '');
        } else {
            alert('El video asignado no es de Youtuve ni de Vimeo, recuerda ingresar el enlace completo del video en el formato correcto.\n - Youtube: https://www.youtube.com/watch?v=9RBSH7Xvn3Q\n - Vimeo: https://vimeo.com/206418873');
            return false;
        }
        return '<iframe src="' + srcVideo + '" frameborder="0" allowfullscreen></iframe>';
    } else {
        alert('No se tiene un video asignado.');
        return false;
    }
}
    

/* video in modal */


// 2.- Boton cerrar 'modal video'
$cuerpo.on('click', '#close-video', function() { 
    var $elParent = $(this).parent();
    $elParent.fadeOut();
    setTimeout(function() {
        $elParent.remove();
    }, 1200)
});

mostrar_fullvideo( '#slideHome' , '.open-video' );

function mostrar_fullvideo( wrapper , button ){
    var $videoseox = $( wrapper );
    if ($videoseox.length) {
        $videoseox.find( button ).on('click', function() {
            var $iframeVideo = creaIframeVideo($(this));
            if ($iframeVideo) {
                $cuerpo.append('<div id="modal-video">' + $iframeVideo + '<button id="close-video"><span class="icon-close2">x</span></button></div>');
            }
        });
    }
}

function mostrar_video( wrapper , button ){
    var $videoseox = $( wrapper );
    if ($videoseox.length) {
        $videoseox.find( button ).on('click', function() {
            var $iframeVideo = creaIframeVideo($(this));
            if ($iframeVideo) {
                if ($cuerpo.width() < 768) {
                    $(this).parent().append('<div class="video-inside">' + $iframeVideo + '<button class="close-vi"><span class="icon-close"></span></button></div>');
                } else {
                    $cuerpo.append('<div id="modal-video">' + $iframeVideo + '<button id="close-video"><span class="icon-close2"></span></button></div>');
                }
            }
        });

        // Boton cerrar
        $videoseox.find('.video').on('click', '.close-vi', function() {
            var $elParent = $(this).parent();
            $elParent.fadeOut();
            setTimeout(function() {
                $elParent.remove();
            }, 1200)
        });
    }
}




/***/

function next_section( section_name ){
    // Boton 'Next Section'
    var $nextSection = $( section_name );
    if ($nextSection.length) {
        $nextSection.on('click', function() {
            $htmlcuerpo.animate({
                scrollTop: ($(this).offset().top + 60)
            }, 800);
        });
    }
    
}