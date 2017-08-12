(function() {
    /*SLIDER*/
	var slide = $('#slider'); // padre del slider

    var ulphotos = $('#photos ul');
    var numList = ulphotos.find('li').length;
	var numListSlide = slide.find('> li').length; // count Li
	var $navigation = $('#navigation');

    var find_li_photos = $('#photos').find('li'); // array
    
	ulphotos.css('width', numList * 100 + '%');
	slide.css('width', numList * 100 + '%');


	if ($navigation.length > 0) { /* If the element exits */
		$navigation.on('click', 'button', function(){
			var bclicked = $(this).index();
			$navigation.find('button').eq(bclicked).addClass('active').siblings().removeClass('active');
            
			if (bclicked != 0) {
				ulphotos.css('margin-left', '-' + (bclicked * 100) + '%');
				slide.css('margin-left', '-' + (bclicked * 100) + '%');
                
                var find_index_img = find_li_photos.eq(bclicked).find('img');
                var find_attr_bclicked = find_index_img.attr('data-img'); // captura el atributo - get 
                
                if(find_attr_bclicked != undefined ){
                    find_index_img.attr('src', find_attr_bclicked).removeAttr('data-img'); // asigna el atributo, set- Luego remueve el atributo
                    setTimeout( function() {
                        find_index_img.css('opacity','1');
                    }, 250);
                }
			} else {
				ulphotos.css('margin-left', '0');
				slide.css('margin-left', '0');
			}
		});
	};
	for (var i = 0 ;  i < numListSlide  ; i++){
		$navigation.append('<button></button>'); 
	}
	$navigation.find('button').eq('0').addClass('active');
    /*FIN SLIDER*/



}());