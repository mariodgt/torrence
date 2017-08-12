(function() {

	
	var $cuerpo = $('body');
	var element1 = $('#main'); //sección slider
	var element2 = $('#listings');
	var element3 = $('#section3');
	var element4 = $('#section4');
	
	$(window).on('load', function() {
		/*Al cargar la web debería ejecutarse lo siguiente*/
		//indice de section
		var $nSections = $cuerpo.find('.toload');
		for (var i = 0; i < $nSections.length ; i++ ) {
			//cargar la primera section
			$cuerpo.find('.toload').eq(0).removeClass('.toload').addClass('loaded').siblings().removeClass('loaded');

			console.log(i);
			switch (i) {
				case 0:
					get_section_active(element1);
					break;
				case 1:
					get_section_active(element2);
					var find_li_photos = $('#photos').find('li'); // array
                    var find_first_index_img = find_li_photos.eq(0).find('img'); 
                    //ecuentra el primer li y luego busca su respectivo img 
                    var find_attr = find_first_index_img.attr('data-img'); 
                    if ( find_attr != undefined ) {
                        find_first_index_img.attr('src', find_attr).removeAttr('data-img').css('opacity','1');
                    }
					break;
				case 2:
					get_section_active(element3);
					break;
				case 3:
					get_section_active(element4);
					break;
			}
		}
	});
	
	
	
	function seccion_visible(element) {
		var visible = true;
		var windowTop = $(document).scrollTop();
		var windowBottom = windowTop + window.innerHeight;            
		var elementPositionTop = element.offset().top;
		var elementPositionBottom = elementPositionTop + element.height();

		if( element.length ){
			if (elementPositionTop > windowBottom || elementPositionBottom < windowTop) {
				console.log('estoy fuera de la sección');
				//opciona: cuando ya no esté visible la sección quitarle la clase general active
				element.removeClass('loaded');
				return visible = false;
			}
			else{
				console.log('estoy dentro de la sección');
				//element.addClass('active').siblings().removeClass('active');
				element.addClass('loaded').removeClass('toload');
				
				aparecerImagenes(element);
				obtenerHash(element);

				return visible;
			}
			return visible;				
		}
		else{
			console.log('No se encontró la sección');
		}
	}

	function get_section_active(element) {
		$(window).on('scroll resize', function() {
			console.log(seccion_visible(element));
		});
	}

	function aparecerImagenes(element){
		var imagenes = element.find('img.lazy');
		var url = imagenes.attr('data-img');
		imagenes.each( function() {
			$(this).removeAttr('data-img').attr('src', url);
		});
	}

	function obtenerHash(element){
		var hash = window.location.hash;
		console.log(hash);


		var section = $.map($("section"), function (event) {
		    var $event = $(event);
		    var pos = $event.position();
		    return {
		        top: pos.top - 550,
		        bottom: pos.top - 550 + $event.height(),
		        hash: $event.attr('id')
		    };
		});
	}

}());