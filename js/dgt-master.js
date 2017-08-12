(function() {
    //alert('Ancho: ' + $(window).width() + ' | Alto: ' + $(window).height())
    // Variables Editables:
    var $textThComplet = 'Page % - LISTINGS % to %'; // Éste es el texto que aparecerá en el separador cuando se cargue más items en la vista mapa, de la página 'Search Results'. Ejm: Page 2 - LISTINGS 25 to 48
    //
    var $cuerpo = $('body');
    var $ventana = $(window);
    var $widthVentana = $ventana.width();
    var $htmlcuerpo = $('html, body');

    //alert('Ancho: ' + $ventana.width() + 'px - Alto: ' + $ventana.height() + 'px');
    $ventana.on('load', function() {
        $cuerpo.removeClass('loading');
    });
    // Seleccionador de clases en los filtros.
    var $viewFilter = $('#filter-views');
    if ($viewFilter.length) {
        var $wrapResult = $('#wrap-result');
        // Cambio de vista por SELECT NATIVO
        $viewFilter.on('change', 'select', function() {
            switch ($(this).find('option:selected').val()) {
                case 'grid':
                    $viewFilter.removeClass('list map').addClass('grid');
                    $wrapResult.removeClass('view-list view-map').addClass('view-grid');
                    $cuerpo.removeClass('view-list view-map');
                    break
                case 'list':
                    $viewFilter.removeClass('grid map').addClass('list');
                    $wrapResult.removeClass('view-grid view-map').addClass('view-list');
                    $cuerpo.addClass('view-list').removeClass('view-map');
                    break
                case 'map':
                    $viewFilter.removeClass('list grid').addClass('map');
                    $wrapResult.removeClass('view-list view-grid').addClass('view-map');
                    $cuerpo.removeClass('view-list').addClass('view-map');
                    break
            }
        });
        // Cambio de estado por select combertido a lista
        $viewFilter.on('click', 'li', function() {
            $(this).addClass('active').siblings().removeClass('active');
            switch ($(this).attr('class').split(' ')[0]) {
                case 'grid':
                    $wrapResult.removeClass('view-list view-map').addClass('view-grid');
                    $cuerpo.removeClass('view-list view-map hidden-header');
                    scrollResultados(false)
                    break
                case 'list':
                    $wrapResult.removeClass('view-grid view-map hidden-header').addClass('view-list');
                    $cuerpo.addClass('view-list').removeClass('view-map');
                    scrollResultados(false)
                    break
                case 'map':
                    $wrapResult.removeClass('view-list view-grid').addClass('view-map');
                    $cuerpo.removeClass('view-list').addClass('view-map hidden-header');
                    scrollResultados(true);
                    break
            }
        });

        var $wrapListResult = $('#wrap-list-result'); //seteo esto

        function scrollResultados(estado) {
                if (estado) { // creo slider
                    if ($ventana.width() >= 1024) {
                        if (!$wrapListResult.hasClass('ps-container')) {
                            $wrapListResult.perfectScrollbar({
                                suppressScrollX: true
                            });
                            $wrapListResult.on('ps-y-reach-end', function() {
                                if (!$wrapListResult.hasClass('loading-more')) {
                                    $wrapListResult.addClass('loading-more');
                                    console.log('Cargando más items...');
                                    // ajax ejecutandose....
                                    var $nuevaData = $('#result-search').html(); // guardo para reutilizar, esto no se necesita en ajax.

                                    $('#result-search').html(''); // simulo la limpieza del ajax

                                    // simulando q yá cargo el ajax, lo q sigue del 'succes'...
                                    setTimeout(function() {
                                        console.log('Imprimiendo nuevos items')
                                        $('#result-search').html($nuevaData);
                                        $('#wrap-list-result').scrollTop(0);
                                        $('#wrap-list-result').perfectScrollbar('update');
                                        $wrapListResult.removeClass('loading-more');
                                    }, 2000)
                                }
                            });

                        }
                    }
                } else { // lo destruyo
                    if ($wrapListResult.hasClass('ps-container')) {
                        $wrapListResult.perfectScrollbar('destroy');
                        /*
                        $wrapListResult.removeClass('ps-container ps-theme-default ps-active-y');
                        $wrapListResult.removeAttr('data-ps-id');
                        $wrapListResult.find('.ps-scrollbar-x-rail, .ps-scrollbar-y-rail').remove();
                        $wrapListResult.off('ontouchstart, touchend, touchmove, touchend');
                        */
                    }
                }
            }
            // touchend de select 'Vista grid, list y map' a lista con botones.
            // Por defecto compruebo para mutar.
        if ($ventana.width() >= 768) {
            mutaSelectViews(true); //,por defecto que mute
        }
        // Al redimencionar muto los selects o Ul si corresponde
        $ventana.on('resize', function() {
            var $widthVentana = $ventana.width();
            if ($widthVentana >= 768) {
                mutaSelectViews(true)
            } else if ($widthVentana < 768) {
                mutaSelectViews(false);
            }
        });

        function mutaSelectViews(estado) {
            if (estado) {
                if (!$viewFilter.find('ul').length) {
                    //console.log('muto a lista, el Ancho es: ' + $ventana.width());
                    var $optionActive = $viewFilter.find('option:selected').val();
                    $viewFilter.find('option').each(function() {
                        $(this).replaceWith('<li class="' + $(this).val() + '">' + $(this).text() + '</li>');
                    });
                    var $theSelect = $viewFilter.find('select');
                    $theSelect.replaceWith('<ul>' + $theSelect.html() + '</ul>');
                    $viewFilter.find('.' + $optionActive).addClass('active');
                    $viewFilter.removeClass($optionActive);
                }
            } else {
                if (!$viewFilter.find('select').length) {
                    //console.log('muto a select nativo, el Ancho es: ' + $ventana.width());
                    var $indexLiActive = $viewFilter.find('.active').index();
                    var $classLiActive = $viewFilter.find('.active').attr('class').split(' ')[0];
                    $viewFilter.find('li').each(function() {
                        $(this).replaceWith('<option value="' + $(this).attr('class').split(' ')[0] + '">' + $(this).text() + '</option>');
                    });
                    var $theUl = $viewFilter.find('ul');
                    $theUl.replaceWith('<select>' + $theUl.html() + '</select>');
                    $viewFilter.find('option').eq($indexLiActive).prop('selected', true).siblings().prop('selected', false);
                    $viewFilter.addClass($classLiActive);
                }
            }
        }
    }
    // Results Search

    var $resultSearch = $('.slider-generator');
    if ($resultSearch.length) {
        // Agregando a favoritos cada propiedad.
        $resultSearch.on('click', '.btn-check', function() {
            // Anclas para trabajar
            var $favoriteLink = $('#link-favorites > a');
            var $nFavorite = $favoriteLink.find('span:eq(1)');
            // Cambiando a active el check
            var $elCheck = $(this).find('span');
            if (!$elCheck.hasClass('active')) {
                $elCheck.addClass('active');
                // Agregando 1 más a 'favoritos'
                if ($favoriteLink.length) { // Habrá páginas en donde no exista el boton de 'favoritos, por eso compruebo su existencia'
                    if (Number($nFavorite.text()) == 0) {
                        $nFavorite.text('1');
                        $favoriteLink.addClass('active');
                    } else {
                        $nFavorite.text(Number($nFavorite.text()) + 1);
                    }
                }
            } else {
                $elCheck.removeClass('active');
                if ($favoriteLink.length) { // Habrá páginas en donde no exista el boton de 
                    var $nFavorite = $('#link-favorites a span:eq(1)');
                    var restaFavorite = Number($nFavorite.text()) - 1;
                    $nFavorite.text(restaFavorite);
                    // Quito el active al favorite
                    if (restaFavorite == 0) {
                        $favoriteLink.removeClass('active');
                    }
                }
            }
        });
        // Creando los mini sliders
        function creaMiniSliders() {
                var $properties = $resultSearch.find('.propertie');
                var nproperties = $properties.length;
                for (var p = 0; p < nproperties; p++) {
                    var $miniSlider = $properties.eq(p).find('.wrap-slider');
                    if ($miniSlider.length) {
                        var $ulSlider = $miniSlider.find('> ul');
                        var $lisSlider = $ulSlider.find('> li');
                        var nLisEx = $lisSlider.length;
                        if (nLisEx > 1) {
                            $ulSlider.css('width', (nLisEx * 100) + '%');
                            $lisSlider.css('width', (100 / nLisEx) + '%');
                        }
                        // activando el el primer frame
                        /* Se quita esto, por creación dinámica de ITEMS, (ajax).
                        else {
                          // No hay items para q sea slide
                          $miniSlider.find('.next').css('display', 'none');
                          $miniSlider.find('.prev').css('display', 'none');
                        }
                        */
                    };
                }
            }
            // creando el slider por defecto
            //creaMiniSliders();

        $resultSearch.find('.propertie').each(function() {
            apareceImagen($(this).find('.wrap-slider li:eq(0)'));
        });

        // Agregando función click a .next y .prev al slider interno, preparado para contenido creado dinámicamente
        $resultSearch.on('click', '.next', function() {
            var $wrapSlider = $(this).parent();
            var $ulSliderb = $wrapSlider.find('> ul');
            if (!$ulSliderb.hasClass('swiping')) {
                // variables a usar
                var $lisSliderb = $ulSliderb.find('> li');
                var nLisB = $lisSliderb.length;
                //
                var $marginLeftUl = $ulSliderb.css('margin-left');
                if ($marginLeftUl == '0px') {
                    $ulSliderb.addClass('swiping');
                    if ($ulSliderb.hasClass('created')) {
                        $ulSliderb.css('margin-left', '-100%');
                        var $liactive = $lisSliderb.eq(1);
                        apareceImagen($liactive);
                        $liactive.addClass('active');
                        $ulSliderb.removeClass('swiping');
                    } else {
                        $ulSliderb.css('margin-left', '-100%');
                        $wrapSlider.addClass('loading');
                        var $newImages = '';
                        $.each(getGallery($wrapSlider.parent().attr('data-mls'), $wrapSlider.parent().attr('data-counter')), function(i, m) {
                            $newImages = $newImages + '<li><img src="#" data-src="' + m + '" title="#" alt="#"></li>';
                        });
                        // Construyo el slider
                        $ulSliderb.append($newImages);
                        var $lisSlider = $ulSliderb.find('> li');
                        var nLisEx = $lisSlider.length;
                        setTimeout(function() {
                            // creo el slider
                            $ulSliderb.css('width', (nLisEx * 100) + '%');
                            $lisSlider.css('width', (100 / nLisEx) + '%');
                            var $segundoFrame = $lisSlider.eq(1);
                            $segundoFrame.addClass('active');
                            apareceImagen($segundoFrame);
                        }, 500)
                        setTimeout(function() {
                            $wrapSlider.removeClass('loading');
                        }, 1000)
                        $ulSliderb.addClass('created').removeClass('swiping');
                    }
                } else {
                    var nLiactive = itemActivo($lisSliderb);
                    if ((nLiactive + 1) !== nLisB) {
                        $ulSliderb.addClass('swiping');
                        $ulSliderb.css('margin-left', '-' + ((nLiactive + 1) * 100) + '%');
                        var $liactive = $lisSliderb.eq(nLiactive + 1);
                        apareceImagen($liactive);
                        $liactive.addClass('active').siblings().removeClass('active');
                        $ulSliderb.removeClass('swiping');
                        // Volteo la flecha para indicar que llegué al ultimo.
                        if (nLiactive == (nLisB - 2)) {
                            $(this).addClass('back');
                        }
                    } else {
                        $(this).removeClass('back');
                        $ulSliderb.addClass('swiping');
                        $ulSliderb.css('margin-left', '0');
                        $lisSliderb.eq(nLisB - 1).removeClass('active');
                        $ulSliderb.removeClass('swiping');
                    }
                }
            }
        });
        $resultSearch.on('click', '.prev', function() {
            // vuelve a un estado normal la flecha de 'next' si se tiene volteada.
            var $nextButton = $(this).next('button');
            if ($nextButton.hasClass('back')) {
                $nextButton.removeClass('back');
            }
            var $ulSliderb = $(this).parent().find('> ul');
            if (!$ulSliderb.hasClass('swiping')) {
                // variables a usar
                var $lisSliderb = $ulSliderb.find('> li');
                var nLisB = $lisSliderb.length;
                var $marginLeftUl = $ulSliderb.css('margin-left');
                if ($marginLeftUl != '0px') {
                    var nLiactive = itemActivo($lisSliderb);
                    $ulSliderb.addClass('swiping');
                    $ulSliderb.css('margin-left', '-' + ((nLiactive - 1) * 100) + '%');
                    var $liactive = $lisSliderb.eq(nLiactive - 1);
                    $liactive.addClass('active').siblings().removeClass('active');
                    $ulSliderb.removeClass('swiping');
                    if (nLiactive == 1) {
                        $lisSliderb.eq(0).removeClass('active');
                    }
                }
            }
        });

        // Para mover los mini sliders con touch,
        var xDown = null;
        var yDown = null;
        $resultSearch.on('touchstart', '.propertie', function(evt) {
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
        });
        $resultSearch.on('touchmove', '.propertie', function(evt) {
            if (!xDown || !yDown) {
                return;
            }
            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;
            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;
            if (Math.abs(xDiff) > Math.abs(yDiff)) { // si se mueve derecha o izquierda
                evt.preventDefault();
                if (xDiff > 0) { // izquierda
                    $(this).find('.next').click();
                } else { // derecha
                    $(this).find('.prev').click();
                }
            }
            xDown = null;
            yDown = null;
        });
    }

    // Actualizado el scroll de 'Choose cities' del 'All filter' al redimencionar la pantalla.
    var $citiesList = $('#cities-list');
    if ($citiesList.length) {
        $ventana.on('resize', function() {
            if ($citiesList.hasClass('ps-container')) {
                $citiesList.perfectScrollbar('update');
            }
        });
    };
    // Expande y contrae los mini filtros de 'all filters' en versión mobile de la web
    var $miniFilters = $('#mini-filters');
    if ($miniFilters.length) {
        // Expando y contrigo el filtro
        $miniFilters.find('h4').on('click', function() {
            var $theLi = $(this).parents('li');
            $theLi.toggleClass('expanded').siblings().removeClass('expanded');
            // ver si creo el slider de 'cities', si es que se clickeo el LI con clase CITIES
            if ($theLi.hasClass('cities') && !$citiesList.hasClass('ps-container')) {
                setTimeout(function() {
                    $citiesList.perfectScrollbar({
                        suppressScrollX: true,
                        minScrollbarLength: '42'
                    });
                }, ((Number($theLi.css('transition-duration').replace('s', '')) * 1000) * 2));
                creaScrollTemporal($theLi, $citiesList);
            }
        });
    }

    // Abre y cierra el 'All Filters'
    var $theFilters = $('#filters');
    if ($theFilters.length) {
        var $allFilters = $('#all-filters');
        var $wrapFilters = $('#wrap-filters');
        $theFilters.on('click', 'button', function() {

            var $bedsActive = $('#mini-filters .price').addClass('expanded');
            var $liClicked = $(this).parent();
            var $nameClass = $liClicked.attr('class').split(' ')[0];
            // [A] verifico si existe un LI de mini filter vinculado al LI de la cabezera de filtros que se acaba de crear. 
            var $miniFilter = $miniFilters.find('li.' + $nameClass);
            if (!$miniFilter.length) {
                //El LI clickeado no está vinculado a la visualizacion de un mini filtro, verifiquemos si se hizo click en "All Filter".
                if ($nameClass !== 'all') {
                    //console.log('no se hizo click en "All filters"');
                    return;
                } else {
                    $liClicked.toggleClass('active').siblings().removeClass('active'); // se hizo click en 'All Filter', activo su flecha
                }
            } else {
                //console.log('si hay vinculación');
                $liClicked.toggleClass('active').siblings().removeClass('active'); // activo su flecha, xq si hay vinculación y continuo.. apareciendo el mini filter.
                //return;
            }
            // [/A]
            switch ($nameClass) {
                case 'all': // Mostrar el 'All Filter'

                    // [B] Apareciendo y/o mutando
                    if (!$allFilters.hasClass('visible')) { // lo pongo asi, x siacaso yá esté visible individualmente y no se oculte, sino, muestre todos
                        $allFilters.addClass('visible');
                    } else {
                        if ($allFilters.hasClass('individual') && $allFilters.hasClass('visible')) { // Está visible, pero individualmente, le quitaré eso...
                            $allFilters.removeClass('individual');
                        } else {
                            if (!$allFilters.hasClass('individual') && $allFilters.hasClass('visible')) { // Está visible, y sin individual, lo ocultaré...
                                $allFilters.removeClass('visible');
                            }
                        }
                    }
                    // [/B]

                    // verifico la dimención de la pantalla, para mostrar en fixed o como modal.

                    // [C] si es menor o igual a 768 siempre se mostrará en pantalla completa, con el body fixeado,
                    if ($wrapFilters.width() <= 768) {
                        $cuerpo.toggleClass('fixed');
                        // Scrolleo si es necesario.
                        var $SetScrollTop = $wrapFilters.position().top - Number($wrapFilters.css('margin-top').replace('px', ''));
                        if ($ventana.scrollTop() !== $SetScrollTop) {
                            $htmlcuerpo.animate({
                                scrollTop: $SetScrollTop
                            }, 800);
                        }
                        // Creo el scroll interno invisible del 'all filter'.
                        if (!$allFilters.hasClass('ps-container')) {
                            setTimeout(function() {
                                $allFilters.perfectScrollbar({
                                    suppressScrollX: true,
                                    minScrollbarLength: '42'
                                });
                            }, ((Number($allFilters.css('transition-duration').replace('s', '')) * 1000) * 2));
                        }
                    }
                    // [/C]

                    // [D] Posiciono el 'All filter' dependiendo el ancho de la pantalla.
                    if ($wrapFilters.width() <= 640) {
                        $allFilters.css({ // porque la cabezera de los filtros están en una sola linea.
                            'top': ($wrapFilters.outerHeight() + $wrapFilters.position().top) + 'px',
                            'left': '0px',
                            'height': 'calc(100vh - ' + ($wrapFilters.outerHeight() + $theFilters.find('li.save').outerHeight()) + 'px)'
                        });
                    } else if ($wrapFilters.width() > 640 && $wrapFilters.width() <= 768) { // mayor a 640 pero menor a 768 pixeles de ancho.
                        if (!$allFilters.hasClass('neighborhood')) { // si no estoy en 'neighborhood' tengo todo el ancho de la pantalla.
                            $allFilters.css({ // porque la cabezera de los filtros están en 2 lineas.
                                'left': '0px',
                                'top': $wrapFilters.outerHeight() + 'px',
                                'height': 'calc(100vh - ' + ($wrapFilters.outerHeight() + $applyFilters.outerHeight()) + 'px)'
                            });
                        } else { // estoy en 'neighborhood', lo aparesco diferente;
                            $allFilters.removeAttr('style');
                            console.log('Widt all filter: ' + $allFilters.width() + ' | position left clicked: ' + $liClicked.position().left + ' | Li clicked widht: ' + $liClicked.width());
                            $allFilters.css({
                                'top': $wrapFilters.outerHeight() + 'px',
                                //'left': ($allFilters.width() - ($liClicked.position().left + $liClicked.width())) + 'px'
                                'right': '0',
                                'left': 'auto',
                                'transform': 'none'
                            });
                        }
                    } else { // cuando la cabezera de los filtros se muestran en 1 sola linea y el 'all filter' debe ser modal (de 960px para arriba).
                        $allFilters.removeAttr('style');
                        $allFilters.css('top', $wrapFilters.outerHeight() + 'px');
                        creaScrollTemporal($allFilters, $citiesList);
                    }
                    // [/D]
                    break
                default:
                    // Quito el fixed , ya que no es el LI 'ALL FILTER'
                    if ($cuerpo.hasClass('fixed')) {
                        $cuerpo.removeClass('fixed');
                    }
                    // Destruyo el 'perfect scroll bar' creado cuando era modal 'all filter'
                    if ($allFilters.hasClass('ps-container')) {
                        $allFilters.perfectScrollbar('destroy');
                    }
                    //  busco el mini filter vinculado al LI clickeado de la cabezera de filters
                    if ($liClicked.hasClass('active')) { // activo la flecha del LI clickeado
                        $miniFilter.addClass('visible').siblings().removeClass('visible'); //  aparesco el 'Mimi filter'
                        if (!$allFilters.hasClass('individual')) { // agrego la 'individualidad' solo si se viene de 'All filter', xq sino, yá la tiene.
                            $allFilters.addClass('individual');
                            $allFilters.css('height', 'auto');
                        }
                        if (!$allFilters.hasClass('visible')) { // agrego la 'individualidad' solo si se viene de 'All filter', xq sino, yá la tiene.
                            $allFilters.addClass('visible');
                        }
                        $allFilters.css({
                            'top': $wrapFilters.outerHeight() + 'px', // aparesco el filtro individual, justo abajito del boton LI que se hizo click
                            'left': (($liClicked.position().left + ($liClicked.outerWidth() / 2)) - 150) + 'px'
                        });
                    } else {
                        $allFilters.removeClass('visible');
                        $miniFilter.removeClass('visible');
                        $liClicked.removeClass('active');
                        setTimeout(function() {
                            $allFilters.removeClass('individual');
                        }, Number($allFilters.css('transition-duration').replace('s', '')) * 1000)
                    }
            }
        });
        // Escondo el 'All Filters' con el boton 'Apply filters', simulando click en 'All Filters'
        var $applyFilters = $('#apply-filters');
        if ($applyFilters.length) {
            $applyFilters.on('click', function() {
                $theFilters.find('.all button').trigger('click');
            });
        }

        // Click fuera de 'All filters', desaparece.
        $(document).on('mouseup', function(e) {
            if ($allFilters.hasClass('visible')) {
                if (!$wrapFilters.is(e.target) && $wrapFilters.has(e.target).length === 0) {
                    $theFilters.find('.active button').trigger('click');
                }
            }
        });
        $theFilters.find('.mini-search, .save').on('click', function() {
            if ($allFilters.hasClass('visible')) {
                $theFilters.find('.active button').trigger('click');
            }
        });
    }

    // Crea scroll para resultados , si es neighboorhood;
    var $neighborhood = $('.scrooll-neighborhood');
    if ($neighborhood.length) {
        if ($ventana.width() >= 1280) {
            $neighborhood.perfectScrollbar({
                suppressScrollX: true,
                minScrollbarLength: '42'
            });
        }
    }

    // Escoge en el menu de 'neighborhood-menu' de Neighboorhood Results
    var $neighborhoodMenu = $('#neighborhood-menu');
    if ($neighborhoodMenu.length) {
        // Desaparece el menu cuando se hizo click en un LI
        $neighborhoodMenu.on('click', 'li', function() {
            $neighborhoodMenu.toggleClass('active');
            $(this).addClass('active').siblings().removeClass('active');
        })
    }

    // Abre y cierra el mapa en los resultados de busqueda: (Botones, Open y close)
    var $buttonsMap = $('#map-actions');
    if ($buttonsMap.length) {
        $buttonsMap.on('click', 'button', function() {
            $wrapListResult.toggleClass('closed');
            $(this).addClass('hide').siblings().removeClass('hide');
        });
    }

    // Slider del menu de neighboorhood. pokemon
    // analizar, si se necesita convertir en funcion para luego anidar su ejecución permanente al evento .resize
    //if ($neighborhoodMenu.width() >= 700) { // no pongo 768, xq en MAC: (1280), el espacio para el '$neighborhoodMenu' es solo de 720
    // Dando ancho relativo al contenedor de los enlaces;
    setTimeout(function() {
        var $enlacesNbh = $neighborhoodMenu.find('li');
        var nEnlacesNbh = $enlacesNbh.length
        if (nEnlacesNbh) { // Compruebo que existan enlaces
            var anchoUlNbh = 0;
            $enlacesNbh.each(function() {
                anchoUlNbh = anchoUlNbh + $(this).outerWidth();
            });
            // Calculo el margen total de los items y luego doy ancho real al Ul
            var $anchoFinalUl = anchoUlNbh + (Number($enlacesNbh.eq(0).css('margin-right').replace('px', '')) * (nEnlacesNbh - 1))
            var $ulNbhMenu = $neighborhoodMenu.find('ul')
                // Si los enlaces no son muchos, escondo las flechas
            var $menuNbhWidth = Number($neighborhoodMenu.find('.gwr').width());
            if ($anchoFinalUl < $neighborhoodMenu.width()) {
                $neighborhoodMenu.find('button').addClass('hide');
                var $porcentaje = Math.floor(($anchoFinalUl * 100) / $menuNbhWidth);
                if ($porcentaje >= 65) { // si el porcentaje del ancho de los items sumados es mayor al 65%, damos flex
                    $ulNbhMenu.addClass('flex');
                }
            } else {
                $ulNbhMenu.css('width', $anchoFinalUl + 'px');
                var $nextItemNbh = $neighborhoodMenu.find('.next-item');
                var $prevItemNbh = $neighborhoodMenu.find('.prev-item');
                // Asignando el desplazamiento para la flecha 'NEXT'
                $nextItemNbh.on('click', function() { // Boton siguiente
                    var $lastItemMenuNbh = $enlacesNbh.eq(nEnlacesNbh - 1);
                    // Moviendo el menu
                    //$ulNbhMenu.css('margin-left', '-' + (($menuNbhWidth - $lastItemMenuNbh.position().left) + $lastItemMenuNbh.width()) + 'px');
                    $ulNbhMenu.css('margin-left', (($menuNbhWidth - $lastItemMenuNbh.position().left) + $lastItemMenuNbh.width()) + 'px');
                    // Desactivando el boton
                    $(this).addClass('hide');
                    $prevItemNbh.removeClass('hide')
                });
                $prevItemNbh.on('click', function() {
                    $ulNbhMenu.css('margin-left', '0');
                    $(this).addClass('hide');
                    $nextItemNbh.removeClass('hide');
                })
            }
        }
    }, 300);
    //}

    // Range de 'All Filters'
    dgt_rangeSlide('#range-price', 0, 50000000, 50000, '#price_from', '#price_to', '$', '', true, 1000000, 250000);
    dgt_rangeSlide('#range-living', 0, 10000, 50, '#living_from', '#living_to', '', 'SF', true);
    dgt_rangeSlide('#range-year', 1900, 2021, 1, '#year_from', '#year_to', '', '', false);
    dgt_rangeSlide('#range-land', 0, 10000, 50, '#land_from', '#land_to', '', 'SF', true);

    dgt_rangeSliderSnap('#range-baths', 0, 10);
    dgt_rangeSliderSnap('#range-beds', 0, 7);


    //Inicio de Funciones agregadas el 20/04/2017
    scrollFixed('#wrap-filters');
    scrollFixed('#fixed-wrap');
    widthTitleModal();
    $ventana.resize(function() {
        widthTitleModal();
    });

    $(".header-tab a").click(function() {
        var loginHeight = 0;
        $(".header-tab a").removeClass('active');
        $(this).addClass('active');
        var tabId = $(this).attr('data-tab');
        switch (tabId) {
            case 'tabLogin':
                $('#modal_login h2').text('Welcome Back');
                $(".text-slogan").text('Sign in below');
                break;
            case 'tabRegister':
                $('#modal_login h2').text('Register');
                $(".text-slogan").text('Join to save listings and receive updates');
                break;
            case 'tabReset':
                $('#modal_login h2').text('Welcome Back');
                $(".text-slogan").text('Sign in below');
                break;
        }
        $(".item_tab").removeClass('active');
        $("#" + tabId).addClass('active');
        loginHeight = $("#content-info-modal").height();
        $(".img_modal").css({
            'height': loginHeight + 'px'
        });
    });

    var $openCloseMap = $('.map-actions button');
    if (typeof($openCloseMap) != 'undefined') {
        $openCloseMap.on('click', function() {
            $openCloseMap.removeClass('no-show');
            $(this).addClass('no-show');
            $('#wrap-list-result').toggleClass('hidden-results');
        });
    }

    var $bodyHtml = $('html');

    $(document).on('click', '.close-div', function() {
        $('.modal-welcome-login').fadeOut();
    });

    $(document).on('click', '.btn-show', function() {
        $(this).parent().parent().find('.features').toggleClass('active-items');
        $(this).toggleClass('active');
    });

    $(document).on('click', '.select-chk', function() {
        var $fullSelect = $(this).attr('data-parent');
        if (!$(this).find('span').hasClass('active')) {
            $(this).find('span').addClass('active');
            if (typeof($fullSelect) != 'undefined') {
                $("#" + $fullSelect).find('.select-chk').each(function() {
                    $(this).find('span').addClass('active');
                });
            }
        } else {
            $(this).find('span').removeClass('active');
            if (typeof($fullSelect) != 'undefined') {
                $("#" + $fullSelect).find('.select-chk').each(function() {
                    $(this).find('span').removeClass('active');
                });
            }
        }
    });

    $(document).on('click', '.default-tab .item-tab', function() {
        var idTab = $(this).attr('data-tab');
        $('.default-tab .item-tab').removeClass('active');
        $(this).addClass('active');
        $('.default-body-tab .default-item-tab').hide();
        $('.default-body-tab ' + idTab).fadeIn();
    });

    $(document).on('click', '.register', function() {
        $(".header-tab li a").removeClass('active');
        $(".item_tab").removeClass('active');
        $(".header-tab li a[data-tab='tabRegister']").addClass('active');
        $("#tabRegister").addClass('active');
    });

    $(document).on('click', '.login', function() {
        $(".header-tab li a").removeClass('active');
        $(".item_tab").removeClass('active');
        $(".header-tab li a[data-tab='tabLogin']").addClass('active');
        $("#tabLogin").addClass('active');
    });

    $(document).on('click', '.close-message', function() {
        $(this).parent('.message-alert').fadeOut('fast');
    });

    $(document).on('click', '#btn-flight', function() {
        $('#full-slider .wrap-slider li:first-child').trigger("click");
    });

    $(document).on('click', '#print-btn', function(e) {
        e.preventDefault();
        var imgPrint = $('#full-slider .wrap-slider li:first-child').html();
        $("#imagen-print").html(imgPrint);

        $("#printMessageBox").fadeIn();
        setTimeout(function() {
            $("#printMessageBox").fadeOut("fast", function() {
                window.print();
            });
        }, 1000);
    });

    $(document).on('click', '.overlay_modal_closer', function() {
        var idModal = $(this).attr('data-id');
        var parentModal = $(this).attr('data-frame');
        $('#' + idModal).removeClass('active_modal');
        $bodyHtml.removeClass(parentModal);
    });

    $(document).on('click', '.close-modal', function() {
        var idModal = $(this).attr('data-id');
        var parentModal = $(this).attr('data-frame');
        $('#' + idModal).removeClass('active_modal');
        $bodyHtml.removeClass(parentModal);
    });

    $(document).on('click', '.show-modal', function() {
        var $idModal = $(this).attr('data-modal'); //Identificador del Modal a mostrar
        var $positionModal = $(this).attr('data-position'); //Posición en la que se encuentra el Modal
        var $modal = $('#' + $idModal);
        var $modalImg = $('#' + $idModal).find('.lazy-img').attr('data-src'); //Consultamos si existe una imagen para mostrar en el Modal
        if (typeof($modalImg) != 'undefined') {
            $('#' + $idModal).find('.lazy-img').attr('src', $modalImg).removeAttr('data-src');
        }
        if ($modal.hasClass('active_modal')) {
            $('.overlay_modal').removeClass('active_modal');
        } else {
            $modal.addClass('active_modal');
            if ($positionModal == 0) {
                $bodyHtml.addClass('modal_fmobile');
            } else {
                $bodyHtml.addClass('modal_mobile');
            }
        }

        var mapImg = $("#min-map").attr("data-map-img");
        if (typeof(mapImg) != 'undefined') {
            $("#min-map").css("background-image", "url('" + mapImg + "')").removeAttr("data-map-img");
        }
    });

    $(document).on('click', '.option-switch', function() {
        if ($(this).hasClass("active")) {
            return;
        }
        $(".option-switch").removeClass("active");
        $(this).addClass("active");
        var view = $(this).data('view');
        switch (view) {
            case 'gallery':
                $("#map-view").removeClass('active');
                $("#full-slider").removeClass('active');
                break;
            case 'map':
                showMap();
                break;
        }
    });

    $(document).on('click', '#min-map', function() {
        showMap();
    });

    $(document).on('click', '#show-shared', function() {
        $(".shared-content").toggleClass("active");
    });

    function showMap() {
        $("#map-view").addClass('active');
        $(".option-switch").removeClass("active");
        if (!$("#show-map").hasClass("active")) {
            $("#show-map").addClass("active");
            $("#full-slider").addClass('active');
        }

        //mini map
        var flex_map_mini_view = $("#map-result");
        var myLatLng2 = {
            lat: parseFloat(flex_map_mini_view.data('lat')),
            lng: parseFloat(flex_map_mini_view.data('lng'))
        };
        var miniMap = new google.maps.Map(document.getElementById('map-result'), {
            zoom: 16,
            center: myLatLng2
        });
        var marker = new google.maps.Marker({
            position: myLatLng2,
            map: miniMap
        });
    }

    /** FINAL ACTIVAR Y CERRAR LOS MODALES **/
    //if(typeof($elementx) != 'undefined'){
    function scrollFixed(conditional) {
        var $conditional = conditional;
        var $element = $($conditional + ".fixed-box");
        var $offset = $element.offset();
        if (typeof($offset) != 'undefined') {
            var $positionYelement = $offset.top + 100;
            $ventana.scroll(function() {
                var $scrollSize = $ventana.scrollTop();
                if ($scrollSize > $positionYelement) {
                    $cuerpo.addClass('fixed-active');
                } else {
                    $cuerpo.removeClass('fixed-active');
                }
            })
        }
    };

    function widthTitleModal() {
            var $titleModal = $('#md-title');
            if (typeof($titleModal) != 'undefined') {
                var widthSize = $("#md-body").width();
                $titleModal.css({
                    'width': widthSize + 'px'
                });
            }
        }
        //Final de Funciones agregadas el 20/04/2017

    // Funciones generales
    function apareceImagen(li) {
        var $laImagen = li.find('> img');
        var $srcOriginal = $laImagen.attr('data-src');
        if ($srcOriginal !== undefined) {
            $laImagen.attr('src', $srcOriginal).removeAttr('data-src');
            li.addClass('loading');
            $laImagen.on('load', function() {
                li.removeClass('loading');
            });
            /*
            .on('error', function(){
              console.log('No se pudo cargar la imagen del siguiente elemento:');
              console.log(li);
              li.removeClass('loading');
            });
            */
        }
    }

    function itemActivo(losLi) { // refactorizar esto (nueva idea para la función).
        var nLis = losLi.length;
        for (var s = 0; s < nLis; s++) {
            if (losLi.eq(s).hasClass('active')) {
                return s;
            }
        }
    }

    function getGallery(mls, counter) {
        // ejemplo: http://retsimages.s3.amazonaws.com/34/A10172834_2.jpg
        var cdn = 'http://retsimages.s3.amazonaws.com';
        var folder = mls.substring((mls.length) - 2); // 34
        var list = [];
        var img = '';
        if (counter <= 0) {
            list.push(dgtCredential.imgComingSoon);
        } else {
            for (var i = 1; i <= counter; i++) {
                img = cdn + '/' + folder + '/' + mls + '_' + i + '.jpg';
                list.push(img);
            }
        }
        return list;
    }

    function creaScrollTemporal(creador, objetivo) {
        if (!objetivo.hasClass('ps-container')) {
            setTimeout(function() {
                objetivo.perfectScrollbar({
                    suppressScrollX: true,
                    minScrollbarLength: '42'
                });
            }, ((Number(creador.css('transition-duration').replace('s', '')) * 1000) * 2));
        }
    }

    function dgt_rangeSlide(elementRange, minr, maxr, stepTo, pricefrom, priceto, typev1, typev2, boolComa, maxStep, newStep) {
        $(elementRange).slider({
            range: true,
            min: minr,
            max: maxr,
            values: [minr, maxr],
            step: stepTo,
            slide: function(event, ui) {
                if (ui.values[0] > maxStep) {
                    newSepTo(elementRange, newStep);
                    //console.log('soy mas que: ' + maxStep);
                } else {
                    //if (step != stepTo) {
                    newSepTo(elementRange, stepTo);
                    //console.log('soy menos que: ' + maxStep);
                    //}
                }

                if (boolComa == true) {
                    $(pricefrom).val(typev1 + separadorComa(ui.values[0]) + " " + typev2);
                    $(priceto).val(typev1 + separadorComa(ui.values[1]) + " " + typev2);
                } else {
                    $(pricefrom).val(typev1 + ui.values[0] + " " + typev2);
                    $(priceto).val(typev1 + ui.values[1] + " " + typev2);
                }
            },
            //Terminar de realizar la validaciÃ³n del Callback --------------------------
            /*
            change: function(){
               console.log('terminar de arrastrar');
               setTimeout( function() {
                  var rangefrom = $( pricefrom).val();
                  var rangeto = $( priceto).val();
                  if( $( pricefrom).val() == rangefrom || $(priceto).val() == rangeto ) {
                     console.log('Daniel: ya cambie');
                  }
               }, 2000);
            }
            */
        });
    };

    function newSepTo(elementRange, newStep) {
        $(elementRange).slider({
            step: newStep
        });
    };

    function separadorComa(valor) {
        var nums = new Array();
        var simb = ","; //Éste es el separador
        valor = valor.toString();
        valor = valor.replace(/\D/g, ""); //Ésta expresión regular solo permitira ingresar números
        nums = valor.split(""); //Se vacia el valor en un arreglo
        var long = nums.length - 1; // Se saca la longitud del arreglo
        var patron = 3; //Indica cada cuanto se ponen las comas
        var prox = 2; // Indica en que lugar se debe insertar la siguiente coma
        var res = "";
        while (long > prox) {
            nums.splice((long - prox), 0, simb); //Se agrega la coma
            prox += patron; //Se incrementa la posición próxima para colocar la coma
        }
        for (var i = 0; i <= nums.length - 1; i++) {
            res += nums[i]; //Se crea la nueva cadena para devolver el valor formateado
        }
        return res;
    };

    function dgt_rangeSliderSnap(elementRange, minr, maxr) {
        $(elementRange).slider({
            min: minr,
            max: maxr,
            animate: true,
            range: true,
            values: [minr, maxr]
        });
    };

    (function($) {
        var extensionMethods = {
            pips: function(settings) {
                options = {
                    first: "number",
                    last: "number",
                    rest: "pip"
                };
                $.extend(options, settings);
                this.element.addClass('ui-slider-pips').find('.ui-slider-pip').remove();
                var pips = this.options.max - this.options.min;
                for (i = 0; i <= pips; i++) {
                    var s = $('<span class="ui-slider-pip"><span class="ui-slider-line"></span><span class="ui-slider-number">' + i + '</span></span>');
                    if (0 == i) {
                        s.addClass('ui-slider-pip-first');
                        if ("number" == options.first) {
                            s.addClass('ui-slider-pip-number');
                        }
                        if (false == options.first) {
                            s.addClass('ui-slider-pip-hide');
                        }
                    } else if (pips == i) {
                        s.addClass('ui-slider-pip-last');
                        if ("number" == options.last) {
                            s.addClass('ui-slider-pip-number');
                        }
                        if (false == options.last) {
                            s.addClass('ui-slider-pip-hide');
                        }
                    } else {
                        if ("number" == options.rest) {
                            s.addClass('ui-slider-pip-number');
                        }
                        if (false == options.rest) {
                            s.addClass('ui-slider-pip-hide');
                        }
                    }
                    if (this.options.orientation == "horizontal")
                        s.css({
                            left: '' + (100 / pips) * i + '%'
                        });
                    else
                        s.css({
                            top: '' + (100 / pips) * i + '%'
                        });
                    this.element.append(s);
                }
            }
        };
        $.extend(true, $['ui']['slider'].prototype, extensionMethods);
    })(jQuery);

    //FULL SLIDER
    var lisATomar = 0;

    function framesPorSwipe() {
        switch (true) {
            case ($widthVentana < 768):
                lisATomar = 1;
                break
            case ($widthVentana >= 768 && $widthVentana < 1024):
                lisATomar = 2;
                break
            case ($widthVentana >= 1024):
                lisATomar = 3;
                break
        }
    }
    framesPorSwipe();
    // Dando funcionalidad a los botones de next y prev
    $('body').on('click', '#full-slider .wrap-slider button', function() { // BOTON NEXT
        var $wrapperSlide = $(this).parent().find('ul');
        var $dataFrame = Number($('#full-slider .wrap-slider ul').data('frame'));
        var $frames = $wrapperSlide.find('li');
        var nframes = $frames.length;
        //console.log('Aca ta inicial: ' + $dataFrame);
        if ($(this).hasClass('next')) { // CLICK EN NEXT
            switch (lisATomar) {
                case 1:
                    if ($dataFrame !== ((nframes - 1) * 100)) {
                        $wrapperSlide.css('margin-left', '-' + ($dataFrame + 100) + '%');
                        $wrapperSlide.data('frame', ($dataFrame + 100));
                        //console.log('Despues de sumar: ' + $wrapperSlide.data('frame'));
                    } else {
                        $wrapperSlide.css('margin-left', '0');
                        $wrapperSlide.data('frame', 0);
                    }
                    break
                case 2:
                    if ($dataFrame !== ((nframes * 50) - 100)) {
                        $wrapperSlide.css('margin-left', '-' + ($dataFrame + 50) + '%');
                        $wrapperSlide.data('frame', $dataFrame + 50);
                        //console.log('Despues de sumar: ' + $wrapperSlide.data('frame'));
                    } else {
                        $wrapperSlide.css('margin-left', '0');
                        $wrapperSlide.data('frame', 0);
                    }
                    break
                case 3:
                    if ($dataFrame <= ((nframes * 33.33) - 100)) {
                        $wrapperSlide.css('margin-left', '-' + ($dataFrame + 33.33) + '%');
                        $wrapperSlide.data('frame', $dataFrame + 33.33);
                        //console.log('Despues de sumar: ' + $wrapperSlide.data('frame'));
                    } else {
                        $wrapperSlide.css('margin-left', '0');
                        $wrapperSlide.data('frame', 0);
                    }
                    break
            }
        } else if ($(this).hasClass('prev')) {
            switch (lisATomar) {
                case 1:
                    if ($dataFrame !== 0) {
                        $wrapperSlide.css('margin-left', '-' + ($dataFrame - 100) + '%');
                        $wrapperSlide.data('frame', '' + ($dataFrame - 100) + '');
                        //console.log('Luego de restar prev: ' + $wrapperSlide.data('frame'));
                    }
                    break
                case 2:
                    if ($dataFrame !== 0) {
                        $wrapperSlide.css('margin-left', '-' + ($dataFrame - 50) + '%');
                        $wrapperSlide.data('frame', $dataFrame - 50);
                        //console.log('Luego de restar prev: ' + $wrapperSlide.data('frame'));
                    }
                    break
                case 3:
                    if ($dataFrame !== 0) {
                        $wrapperSlide.css('margin-left', '-' + ($dataFrame - 33.33) + '%');
                        $wrapperSlide.data('frame', $dataFrame - 33.33);
                        //console.log('Luego de restar prev: ' + $wrapperSlide.data('frame'));
                    }
                    break
            }
        }
    });
    // Click sobre el LI
    $('body').on('click', '#full-slider .wrap-slider li', function() {
        // Insertando los datos de la propiedad en el modal
        var $modalImagePropertie = $('#modal_img_propertie');
        var $modalTitle = $modalImagePropertie.find('.title');
        if (!$modalTitle.hasClass('worked')) {
            var $fullMain = $('#full-main');
            var $lisPI = $fullMain.find('.property-information li');
            var datesPropertie = [];
            datesPropertie.push($lisPI.eq(0).text().split(' ')[0], $lisPI.eq(1).text().split(' ')[0], $lisPI.eq(2).text().split(' ')[0], $lisPI.eq(4).text().split(' ')[0]);
            var $titleModalPD = $modalTitle.find('span').text();
            for (var d = 0; d < datesPropertie.length; d++) {
                $titleModalPD = $titleModalPD.replace('%', datesPropertie[d]);
            }
            $modalImagePropertie.find('.title span').text($titleModalPD);
            $modalTitle.addClass('worked');
        }
        // Insertando numeración e imagen clickeada
        var $wrapperImg = $modalImagePropertie.find('.wrapper-img');
        // Poniendo la numeración
        var $numeration = $wrapperImg.find('.numeration');
        var $indexClicked = $(this).index();
        $numeration.find('span').eq(0).text($indexClicked + 1);
        $numeration.find('span').eq(1).text($(this).parent().find('li').length);
        // Insertando url de imagen
        $wrapperImg.find('.img').attr('src', $(this).find('img').attr('src'));
        // Quitando o poniendo el opacity dependiendo del index del LI al que se hizo click
        var $buttonPrevMDP = $modalImagePropertie.find('.prev');
        if ($indexClicked >= 1) { // 
            if ($buttonPrevMDP.hasClass('opacity')) {
                $buttonPrevMDP.removeClass('opacity');
            }
        } else {
            if (!$buttonPrevMDP.hasClass('opacity')) {
                $buttonPrevMDP.addClass('opacity');
            }
        }
        // Mostrando modal
        $modalImagePropertie.fadeIn();
    });
    // Cierra modal de imagen de detalle de propiedad
    $('body').on('click', '#modal_img_propertie .close-modal, #modal_img_propertie .bg-black', function() {
        $('#modal_img_propertie').fadeOut();
    });
    // Navegamos por el Slide creado, botones, NEXT y PREV.
    $('body').on('click', '#modal_img_propertie .nav', function() {
        // Cosas con las que trabajaremos
        var $fullSlider = $('#full-slider .wrap-slider');
        var $modalImagePropertie = $('#modal_img_propertie');
        var $wrapperImg = $modalImagePropertie.find('.wrapper-img');
        var $numeration = $wrapperImg.find('.numeration');
        var $actualindex = $numeration.find('span').eq(0);
        var $totalItems = $numeration.find('span').eq(1);
        if ($(this).hasClass('next')) { // click en NEXT
            var $buttonPrevtMDP = $(this).parent().find('.prev');
            if ($buttonPrevtMDP.hasClass('opacity')) {
                $buttonPrevtMDP.removeClass('opacity');
            }
            // Condicional para saber si yá se llegó al final
            if (Number($totalItems.text()) !== Number($actualindex.text())) {
                $actualindex.text(Number($actualindex.text()) + 1); // Sumando un numero más a la numeración;
                // Dando la nueva imagen
                $wrapperImg.find('.img').attr('src', $fullSlider.find('li').eq(Number($actualindex.text()) - 1).find('img').attr('src'));
                // Bolteo la flecha de NEXT para indicar que yá se llegó al final
                if (Number($actualindex.text()) == Number($totalItems.text())) {
                    $(this).addClass('back');
                }
            } else {
                $actualindex.text('1'); // Sumando un numero más a la numeración;
                // Dando la nueva imagen
                $wrapperImg.find('.img').attr('src', $fullSlider.find('li').eq(0).find('img').attr('src'));
                $(this).removeClass('back'); // quitando el back del boton next
                // Dando opacity al boton prev
                var $buttonPrevtMDP = $(this).parent().find('.prev');
                if (!$buttonPrevtMDP.hasClass('opacity')) {
                    $buttonPrevtMDP.addClass('opacity');
                }
            }
        } else { // Click en PREV
            // Volteamos la flecha de NEXT si está volteada 
            var $buttonNextMDP = $(this).parent().find('.next');
            if ($buttonNextMDP.hasClass('back')) {
                $buttonNextMDP.removeClass('back');
            }
            // Restamos un numero al Index y traemos la imagen anterior
            var $nActualindex = Number($actualindex.text());
            if ($nActualindex !== 1) {
                $actualindex.text($nActualindex - 1); // Sumando un numero más a la numeración;
                // Dando la nueva imagen
                $wrapperImg.find('.img').attr('src', $fullSlider.find('li').eq($nActualindex - 2).find('img').attr('src'));
                // Le agrego la opacidad al boton si se llega al último
                if ($nActualindex == 2) {
                    $(this).addClass('opacity');
                }
            }
        }
    });

    var $contentMs = $('#content-ms');
    if ($contentMs.length) {
        // construyendo el MS
        var $mSResultSearch = $contentMs.find('.result-search');
        var $mSPropertie = $mSResultSearch.find('.propertie');
        var nMsPropertie = $mSPropertie.length;
        if (nMsPropertie > 1) {

            if ($widthVentana < 640) { // cuando el slider multiple es de solo 1 item
                $mSResultSearch.css('width', (nMsPropertie * 100) + '%');
                $mSPropertie.css('width', (100 / nMsPropertie) + '%');
            } else {
                $mSResultSearch.css('width', ((nMsPropertie * 100) / 2) + '%');
                $mSPropertie.css('width', ((100 / nMsPropertie) - (((Number($mSPropertie.eq(0).css('margin-right').replace('px', '')) * 100) / $mSResultSearch.width()) / 2)) + '%');
            }
        }
        $mSResultSearch.data('frame', 0);
        // Dando evento siguiente y anterior a los botones .nav
        $contentMs.find('.nav').on('click', function() {
            var $dataFrame = $mSResultSearch.data('frame');
            if ($widthVentana < 640) { // cuando el slider multiple es de solo 1 item
                if ($(this).hasClass('next')) { // boton prev
                    if ($dataFrame !== ((nMsPropertie * 100) - 100)) {
                        var $sumaDataFrame = $dataFrame + 100;
                        $mSResultSearch.css('margin-left', '-' + $sumaDataFrame + '%')
                        $mSResultSearch.data('frame', $sumaDataFrame);
                    }
                } else { // boton prev
                    if ($dataFrame !== 0) {
                        var $restaDataFrame = $dataFrame - 100;
                        $mSResultSearch.css('margin-left', '-' + $restaDataFrame + '%')
                        $mSResultSearch.data('frame', $restaDataFrame);
                    }
                }
            } else { // cuando yá es de 2 items

                if ($(this).hasClass('next')) { // boton prev
                    var calculator = ((nMsPropertie / 2) * 100) - 100;
                    console.log(calculator);
                    if ($dataFrame !== calculator && $dataFrame < calculator) {
                        var $sumaDataFrame = $dataFrame + 100;
                        $mSResultSearch.css('margin-left', '-' + $sumaDataFrame + '%')
                        $mSResultSearch.data('frame', $sumaDataFrame);
                        console.log('Suma: ' + $sumaDataFrame);
                    }
                } else { // boton prev
                    if ($dataFrame !== 0) {
                        var $restaDataFrame = $dataFrame - 100;
                        $mSResultSearch.css('margin-left', '-' + $restaDataFrame + '%')
                        $mSResultSearch.data('frame', $restaDataFrame);
                    }
                }

            }
        });
    }

    var items = $('.scroll-tab-list').width();
    if (typeof(items) != 'undefined') {
        var itemSelected = document.getElementsByClassName('scroll-item');
        countriesPointerScroll($(itemSelected));
        $(".scroll-tab-list").scrollLeft(200).delay(200).animate({
            scrollLeft: "-=200"
        }, 2000, "easeOutQuad");

        $('.paddle-right').click(function() {
            $(".scroll-tab-list").animate({
                scrollLeft: '+=' + items
            });
        });
        $('.paddle-left').click(function() {
            $(".scroll-tab-list").animate({
                scrollLeft: "-=" + items
            });
        });

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var scrolling = false;

            $(".paddle-right").bind("mouseover", function(event) {
                scrolling = true;
                scrollContent("right");
            }).bind("mouseout", function(event) {
                scrolling = false;
            });

            $(".paddle-left").bind("mouseover", function(event) {
                scrolling = true;
                scrollContent("left");
            }).bind("mouseout", function(event) {
                scrolling = false;
            });

            function scrollContent(direction) {
                var amount = (direction === "left" ? "-=3px" : "+=3px");
                $(".scroll-tab-list").animate({
                    scrollLeft: amount
                }, 1, function() {
                    if (scrolling) {
                        scrollContent(direction);
                    }
                });
            }
        }

        $('.scroll-tab-list .scroll-item').click(function() {
            $('.scroll-tab-list').find('.active').removeClass('active');
            $(this).addClass("active");
            countriesPointerScroll($(this));
        });
    }

    function countriesPointerScroll(ele) {
        var parentScroll = $(".scroll-tab-list").scrollLeft();
        var offset = ($(ele).offset().left - $('.scroll-tab-list').offset().left);
        var totalelement = offset + $(ele).outerWidth() / 2;
    }

    function activeScroll() {
        var widthItem, sumaItem = 0;
        $(".scroll-tab-list .scroll-item").each(function() {
            widthItem = $(this).innerWidth();
            sumaItem = sumaItem + widthItem;
        });
        var widthWrapperScroll = $(".wrapper-scroll-tab").width();
        if (sumaItem > widthWrapperScroll) {
            $(".wrapper-scroll-tab").addClass('active');
        } else {
            $(".wrapper-scroll-tab").removeClass('active');
        }
    }

    activeScroll();
    $(window).resize(function() {
        activeScroll()
    });

    // COSAS DEL QUICK SEARCH

    var $buildingsFilters = $('#buildings-filters');
    if ($buildingsFilters.length) {
        var $resultBuildings = $('#result-filters');
        var $theBuilding = $resultBuildings.find('.building');
        // Tomando valores por defecto para usarlos luego
        var $defaultH2 = $theBuilding.find('h2').text();
        var $defaultSrc = $theBuilding.find('.img-building img').attr('src');
        var $defaultTitle = $theBuilding.find('.view-buildings').text();
        var $defaultHref = $theBuilding.find('.view-buildings').attr('href');
        var $newText = $theBuilding.find('.view-buildings').data('text');
        //
        var $listAreas = $('#list-areas');
        var $buildingsList = $('#list-building');
        // Seleccionando un area, y filtrando las que se mostrarán
        $listAreas.on('click', 'li', function() {
            var $wrapperList = $buildingsList.find('.wrapper-list');
            if (!$(this).hasClass('active')) {
                // Activo y desactivo el LI
                $(this).parent().find('.active').removeClass('active'); // desactivo el activado.
                $(this).addClass('active'); // activo el clickeado
                // Tratando la DATA
                var $metaData = $(this).data('meta'); // Se obtiene un objeto con: id, title, img, area, keyword
                $theBuilding.find('h2').text($metaData.title);
                $theBuilding.find('.img-building img').attr('src', $metaData.img);
                $theBuilding.find('.view-buildings').attr('href', $metaData.keyword);
                $theBuilding.find('.view-buildings').text($newText)
                    // Escondiendo y apareciendo los los buildings correspondientes.
                $wrapperList.addClass('hidden');
                var $areasList = $wrapperList.find('li');
                $('#list-building .wrapper-list li.appeared').removeClass('appeared');
                $('#list-building .wrapper-list li[data-id="' + $(this).data('id') + '"]').addClass('appeared');
                $buildingsList.find('.wrapper-list').perfectScrollbar('update');
            } else {
                quitaActivedeLis($(this));
                $wrapperList.removeClass('hidden');
                $('#list-building .wrapper-list li.appeared').removeClass('appeared');
                $buildingsList.find('.wrapper-list').perfectScrollbar('update');
            }
        });
        // Seleccionando un building, y mostrando la data pertinente
        $buildingsList.on('click', 'li', function() {
            if (!$(this).hasClass('active')) {
                // Activo y desactivo el LI
                $(this).parent().find('.active').removeClass('active'); // desactivo el activado.
                $(this).addClass('active'); // activo el clickeado
                //
                var $buildingMeta = $(this).data('meta');
                // Diseño de PRE: 1 o 0;
                Number($buildingMeta.pre) ? $theBuilding.removeClass('v2') : $theBuilding.addClass('v2')
                    //
                $theBuilding.find('.img-building img').attr('src', $buildingMeta.img);
                $theBuilding.find('header h2 > span').text($buildingMeta.title);
                $theBuilding.find('.view-buildings').attr('href', $buildingMeta.url);
                $theBuilding.find('.address-building span').text($buildingMeta.address);
                if (!Number($buildingMeta.pre)) { // si no es pre, muestro todo.
                    // Dando rango de 'Sale'
                    var $rangeSale = $theBuilding.find('.range-sales .price-range');
                    $rangeSale.find('.from').text($rangeSale.data('coin') + $buildingMeta.ranges[0].sale[0].from + ' ');
                    $rangeSale.find('.to').text($rangeSale.data('coin') + $buildingMeta.ranges[0].sale[0].to);
                    // Dando rango de 'Rent'
                    var $rangeRent = $theBuilding.find('.range-rent .price-range');
                    $rangeRent.find('.from').text($rangeRent.data('coin') + $buildingMeta.ranges[0].rent[0].from + ' ');
                    $rangeRent.find('.to').text($rangeRent.data('coin') + $buildingMeta.ranges[0].rent[0].to);
                    // Dando enlaces de 'Rent' y 'sales'
                    var $accessBuilding = $theBuilding.find('.access-building');
                    $accessBuilding.find('.for-sale').attr('href', $buildingMeta.url + '#tab-sale');
                    $accessBuilding.find('.for-rent').attr('href', $buildingMeta.url + '#tab-rent');
                }
            } else {
                quitaActivedeLis($(this));
                $theBuilding.removeClass('v2');
            }
        });
    }

    function quitaActivedeLis(theLi) {
        theLi.removeClass('active');
        // Volviendo a todo por default
        $theBuilding.find('h2').text($defaultH2)
        $theBuilding.find('.view-buildings').text($defaultTitle);
        $theBuilding.find('.img-building img').attr('src', $defaultSrc);
        $theBuilding.find('.view-buildings').text($defaultTitle);
        $theBuilding.find('.view-buildings').attr('href', $defaultHref);
        $theBuilding.find('.address-building span').text('');
    }

    // Acciones de los botones q abren y cierra el Quick search y más.
    $('body').on('click', '.btn-modal', function() {
        // Condicionales de atributos dependientes
        var $dataAction = $(this).data('action');
        if ($dataAction == undefined) {
            alert('No se determinó ninguna acción a realizar.')
            return;
        }
        var $dataTarget = $(this).data('target');
        if ($dataTarget == undefined) {
            alert('No se determinó un objeto.')
            return;
        }
        if ($('#' + $dataTarget).length) { // verifico si existe el elemento, para abrirlo o cerrarlo
            switch ($dataAction) {
                case 'open':
                    $('#' + $dataTarget).fadeIn(function() {
                        switch ($dataTarget) {
                            case 'quick-search.v3':
                            case 'quick-search.v2':
                            case 'quick-search':
                                if (!$citiesList.hasClass('ps-container')) {
                                    $citiesList.perfectScrollbar({
                                        suppressScrollX: true,
                                        minScrollbarLength: '42'
                                    });
                                }
                                break
                            case 'buildings':
                                $('#' + $dataTarget).find('.wrapper-list').each(function() {
                                    if (!$(this).hasClass('ps-container')) {
                                        $(this).perfectScrollbar({
                                            suppressScrollX: true,
                                            minScrollbarLength: '42'
                                        });
                                    }
                                });
                                break
                            default:
                                console.log('el ID del modal abierto es: ' + $dataTarget);
                                break
                        }
                    });
                    break
                case 'close':
                    $('#' + $dataTarget).fadeOut();
                    break
                default:
                    alert('no se a determinado una acción para éste boton');
            }
        } else {
            alert('No existe el elemento con ID: "' + $dataTarget + '"');
        }
    });
    // TERMINA LAS COSAS DEL QUICK SEARCH


    /* Scroll para lista de ciudades en la página interna de Advance Search */
    var $advance_search = $('.property-search');
    var $cities = $('#cities-list');
    if ($advance_search.length) {
        $cities.perfectScrollbar({
            suppressScrollX: true,
            minScrollbarLength: '42'
        });
    }
}());