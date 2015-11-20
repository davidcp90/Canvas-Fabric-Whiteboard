var slides=new Array();
var images_s=new Array();
var titles=new Array();
var transcript=new Array();
var oncanvas=false;
var count_slides=1;
define( ['jquery','fabric','replacemath' ], function(){

	var RichAnswer = new function() {
	//Create canvas
	var canvas = this.__canvas = new fabric.Canvas('answer-canvas', {
		backgroundColor: 'rgb(255,255,255)',
		isDrawingMode: true
	});
	canvas.calcOffset();
	fabric.Object.prototype.transparentCorners = false;
	//Define Controls
	var drawingColorEl = $('#drawing-color'),
	fontEl = 'Arial',
	drawingLineWidthEl = $('#drawing-line-width'),
	clearEl = $('#clear-canvas');
	//Actions for controls
	clearEl.click(function(e){
		canvas.clear();
	});
	//colors
	$('.color-opt').click(function(e) {
		if($(this).hasClass('black')){
			$('#drawing-color').val('#181818');

		}
		else if($(this).hasClass('blue')){
			$('#drawing-color').val('#4ec4f6');
		}
		else if($(this).hasClass('orange')){
			$('#drawing-color').val('#ffa746');
		}
		$('.active-o').removeClass('active-o');
		$(this).addClass('active-o');
		canvas.freeDrawingBrush.color=$('#drawing-color').val();
	});


	$('.brush').click(function(e) {
		if($(this).is('#brush-small')){
			$('#drawing-line-width').val('2');

		}
		else if($(this).is('#brush-med')){
			$('#drawing-line-width').val('4');

		}
		else if($(this).is('#brush-lar')){
			$('#drawing-line-width').val('8');

		}
		$('.active-b').removeClass('active-b');
		$(this).addClass('active-b');
		canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.val(), 10) || 2;

	});

canvas.freeDrawingBrush.color = drawingColorEl.val();
canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.val(), 10) || 2;
canvas.freeDrawingBrush.lockMovementX= false;
canvas.freeDrawingBrush.lockMovementY= false;
canvas.freeDrawingBrush.selection= true;
	//Advanced functions
	function addText(texto,bold){
		canvas.isDrawingMode=false;
		var text = new fabric.IText(texto, {
			left: 100,
			top: 100,
			fontFamily: fontEl,
			fontSize: (parseInt(drawingLineWidthEl.val())*10),
			fill:  drawingColorEl.val()
		});
		if(bold){
			text.fontWeight='bold';
		}
		canvas.calcOffset();
		canvas.selection = true;
		canvas.renderAll();
		canvas.add(text);


	}
	//Save canvas
	function rasterizeJSON(){
		json_string=JSON.stringify(canvas);
		return json_string;
	}

	function oneSlide(){
		data_c=canvas.toJSON();
		console.log('canvas es '+data_c.objects[0]);
		object_canvas=data_c.objects[0];
		title_value=$('#title-step').val();
		if(typeof object_canvas === 'object' && title_value){
			slides[0]=(JSON.stringify(canvas));
		titles[0]=title_value;
		transcript[0]=extractText(JSON.stringify(canvas));


		}
		else{
			console.log('no one slide y titulo'+title_value);
		}

	}


	function prepareToSend(){
		var last_n=$('.slide-p:last-child').attr('data-slide-number');
		var title_factual=$('#title-step').val();
		if(title_factual){
			last_n=$('.slide-p:last-child').attr('data-slide-number');
		console.log(last_n);
		if(last_n){
			last_n--;
			slides[last_n]=(JSON.stringify(canvas));
			titles[last_n]=title_factual;
			transcript[last_n]=extractText(JSON.stringify(canvas));
			images_s[last_n]=canvas.toDataURL("image/png");
		}
		else{
			slides[0]=(JSON.stringify(canvas));
			titles[0]=title_factual;
			transcript[0]=extractText(JSON.stringify(canvas));
			images_s[0]=canvas.toDataURL("image/png");

		}
		var slides_list = [];
		var json_list = "";
		l=images_s.length;
		var transcript_list = [];
		var json_transcript = "";
		k=transcript.length;
		console.log(' LENGTH es'+l);
		for (var i = 0; i <l; i += 1){
			console.log('SLIDE EN POSICION'+i+'ES'+images_s[i]);
			var item = {
				"slide": i,
				"value": images_s[i]

			};

			slides_list.push(item);
		}
		for (j=0; j < k; j++) {
			console.log('TITLE EN POSICION'+j+'ES'+titles[j]);
			var trans={
				"titulo": titles[j],
				"texto": transcript[j]
			};
			transcript_list.push(trans);
		}
		json_list = JSON.stringify({slides_list: slides_list});
		json_transcript = JSON.stringify(transcript_list);
		$('#canvas-input').attr("value",json_list);
		$('#steps-trans').attr("value",json_transcript);
		$('#actual-slide-t').html('1');
		$('#count-slides-t').html('1');
		$('#delete-slide').css('visibility','hidden');
		resetVars();
		slides_list.length = 0;
		transcript_list.length=0;
	}
	else{
		alert('Debes ingresar una descripción para tu explicación');
	}
}
function resetVars(){
	slides.length=0;
		images_s.length=0;
		titles.length=0;
		transcript.length=0;
		new_count=0;
		count=0;
		count_slides=1;
}
$('#fake').click(function(){
	prepareToSend();
});
$('#createInitial').click(function(){
	oneSlide();
});
$('#reset-canvas').click(function(){
	slides.length=0;
	images_s.length=0;
	$( ".slide-p" ).each(function() {
		n=$( this ).attr('data-slide-number');
		if(n!=1){
			$(this).remove();
		}

	});
	activateDrawing();
	canvas.clear();
});
	//Interactions
	count=0;
	$('#add-slide').click(function(){

		console.log('al entrar a add transcript es'+transcript);
		var title_actual=$('#title-step').val();
		if(title_actual){

			if(count<10){
				count++;
				count_slides++;
				new_count=count+1;
				$('#actual-slide-t').html(new_count);
				$('#count-slides-t').html(count_slides);
				position=count-1;
				$('.active-s').removeClass('active-s');
				$('#slides ul').append('<li class="slide-p active-s" data-slide-number="'+new_count+'">'+new_count+'</li>');
				slides[position]=rasterizeJSON();
				images_s[position]=canvas.toDataURL("image/png");
				titles[position]=title_actual;
				transcript[position]=extractText(rasterizeJSON());
				canvas.clear();
				$('#title-step').val('');
				delvis=$('#delete-slide').css('visibility');
				console.log('delvis'+delvis);
				if(delvis=="hidden"){
					console.log('entra delvis');
					$('#delete-slide').css('visibility','visible');
				}

			}
			else{
				alert('No se puede crear otro slide. Maximo 10');
			}
		}
		else{
			alert('Debes ingresar una descripción para tu explicación');
		}
	});
$('#delete-slide').click(function(){

	var num_a=parseInt($('.active-s').attr('data-slide-number'));
	if(num_a==1){
	//pendiente por revisar
		$('#title-step').val('');
		canvas.clear();
	}
	else{
		canvas.clear();
		posi=num_a-1;
		$('#title-step').val('');
		console.log('Al entrar es'+titles);
		if(slides[posi]){
			slides.splice(posi,1);
		}
		if(images_s[posi]){
			images_s.splice(posi,1);
		}
		if(titles[posi]){
			titles.splice(posi,1);
		}
		if(transcript[posi]){
			transcript.splice(posi,1);
		}
		$('.active-s').removeClass('active-s');
		$('.slide-p:last-child').remove();
		$('.slide-p:last').addClass('active-s');
		var new_pos=parseInt($('.slide-p:last').attr('data-slide-number'));
		console.log('newpos'+new_pos);
		new_pos=new_pos-1;
		console.log('newpos'+new_pos);
		if(new_pos==0){
			$('#delete-slide').css('visibility','hidden');
		}
		var render_d=slides[new_pos];
		$('#title-step').val(titles[new_pos]);
		canvas.loadFromJSON(render_d);
		count_slides--;
		count--;
		new_count--;
		$('#actual-slide-t').empty().html(count_slides);
		$('#count-slides-t').empty().html(count_slides);
	}
});
function extractText(objeto){
	objson=$.parseJSON(objeto);
	var acumulate_trans='';
	$.each(objson, function(idx, obj) {
		objch=$.isArray(obj);
		console.log('OBJCH'+objch);
		if(objch){
			$.each(obj, function(id, ob) {

				if(ob.type=="i-text"){

					acumulate_trans=acumulate_trans+' '+ob.text;
				}
				else{
					if(acumulate_trans!=''){
						acumulate_trans='Grafico o ecuación matematica. Ver imagen para obtener el detalle';
					}
				}
			});
		}
		else{
			console.log(' No es array');
		}

	});
	return acumulate_trans;
}
$('#slides').on('click', '.slide-p', function () {

	var num_s=$(this).attr('data-slide-number');
	num_s--;
	$('#actual-slide-t').html(num_s+1);
	var num_a=$('.active-s').attr('data-slide-number');
	num_a--;
	slides[num_a]=rasterizeJSON();
	images_s[num_a]=canvas.toDataURL("image/png");
	titulo_a=$('#title-step').val();
	titles[num_a]=titulo_a;
	titulo=titles[num_s];
	$('#title-step').val(titulo);
	$('.active-s').removeClass('active-s');
	$(this).addClass('active-s');

	canvas.clear();
	var render_d=slides[num_s];
	canvas.loadFromJSON(render_d);
});

$('.close_eq').click(function(e){
	e.preventDefault();
	e.stopPropagation();
	$('.equation_modal').fadeOut('fast');
	$('.active').removeClass('active');
	$('#pencil-canvas').parent('.mode').addClass('active');
	activateDrawing();
});
$('#cancel_eq').click(function(e){
	e.preventDefault();
	e.stopPropagation();
	$('.equation_modal').fadeOut('fast');
	$('.active').removeClass('active');
	$('#pencil-canvas').parent('.mode').addClass('active');
	activateDrawing();
	$('#equation-result').empty();
});
$('#convert-eq').click(function(e){
	if($('#insert_eq').length>0 || $('#cancel_eq').length>0){
		$('#insert_eq').fadeOut(10);
					$('#cancel_eq').fadeOut(10);
	}
	var equ='',
	size_equ='';
	e.preventDefault();
	e.stopPropagation();
	equ=$('#equation-in').val();
	size_equ=equ.length;
	console.log(size_equ);
	if(equ.match('[á,é,í,ó,ú,ñ]|[Á,É,Í,Ó,Ú,Ñ]')){
			alert('No se permiten tildes ni la letra ñ');
			$('#equation-result').empty();
			equ='';
			size_equ='';
	}
	else{
	if(size_equ>1 && size_equ<200){
		var opa=$('#equation-result').css('opacity');
		if(opa=='1')
		{
			$('#equation-result').css('opacity','0');
			$('#equation-result').empty();
		}


			$('#equation-loader').fadeIn(100);
			equ="$$ "+equ+"$$";
			$('#equation-result').empty().append(equ);
			replaceMath( document.getElementById('equation-result'));
			$('#equation-loader').delay(5000).fadeOut(100,function(){
				if($('#equation-result span svg').length>0){
					$('#equation-result').css('opacity','1');
					$('#insert_eq').fadeIn('fast');
					$('#cancel_eq').fadeIn('fast');
				}
				else{
					alert('Tienes un error en tu ecuación, revisala con cuidado');
					$('#equation-result').empty();
					equ='';
					size_equ='';
				}

			});






	}
	else{
		alert('Tu ecuacion debe tener entre 1 y 200 caracteres. No intentes insertar texto aca.');
	}
	}
});
$('#insert_eq').click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	sourceSVG=$('.math').html();
	$('#equation-in').val('');
	$('#equation-result').empty();
	$('#insert_eq').fadeOut('fast');
	$('#cancel_eq').fadeOut('fast');
	$('.equation_modal').slideUp('fast');

		console.log(sourceSVG);
		var DOMURL = self.URL || self.webkitURL || self;
		var img = new Image();
		var svg = new Blob([sourceSVG], {type: "image/svg+xml;charset=utf-8"});
		var url = DOMURL.createObjectURL(svg);
		console.log(svg);
		console.log(url);


		img.onload = function() {
			var imgInstance = new fabric.Image(img, {
				left: 100,
				top: 100
			});
			canvas.add(imgInstance);
			//DOMURL.revokeObjectURL(url);
		};
		img.src = url;

	});
	function removeActive(e,el){
		e.preventDefault();
		e.stopPropagation();
		$('.active').removeClass('active');
		if(el!='no'){
			$(el).parent('.mode').addClass('active');
		}

	};

	$('.mode-icon').click(function(e){
		removeActive(e,'si');
		target='#'+$(this).attr('data-open');
		$(target).fadeIn(10);
	});
	$('#offset').click(function() {
		console.log('offset');
		canvas.calcOffset();
		if(!canvas.isDrawingMode){
			canvas.isDrawingMode=true;

		}

		canvas.freeDrawingBrush.color = drawingColorEl.val();
		console.log(canvas.freeDrawingBrush.color);

	});
	function activateDrawing(){
		if(!canvas.isDrawingMode){
			canvas.isDrawingMode=true;
		}
		canvas.freeDrawingBrush.color = drawingColorEl.val();
		canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.val(), 10) || 1;

	}
	function closeMenu(menu){

		if(menu=="draw"){
			$('#draw-opt').fadeOut(10);
			$('#pencil-canvas').parent('.mode').addClass('active');

		}
		else if(menu=="text"){
			$('#text-opt').fadeOut(10);
			$('#text-canvas').parent('.mode').addClass('active');

		}
		else if(menu=="media"){
			$('#media-opt').fadeOut(10);
			$('#media-canvas').parent('.mode').addClass('active');

		}
	}
	$('.close-opt').click(function(e){
		target='#'+$(this).attr('data-close');
		$(target).fadeOut(10);
	});

	$('#pencil-opt').click(function(e){
		activateDrawing();
		$('#draw-opt').fadeOut(10);

	});
	$('.upper-canvas').bind('mouseover', function(e) {
		oncanvas=true;

	});
	$('.upper-canvas').bind('mouseleave', function(e) {
		oncanvas=false;

	});
	//Options for text
	$('#stand-opt').click(function(e){
		texto="Tu texto";
		addText(texto,false);
		$('#text-opt').fadeOut(10);
	});
	$('#bold-opt').click(function(e){
		texto="Tu texto";
		addText(texto,true);
		$('#text-opt').fadeOut(10);

	});
	$('#equation-opt').click(function(e){
		canvas.isDrawingMode=false;
		$('#text-opt').fadeOut(10);
		$('.equation_modal').fadeIn('fast');
	});
	//Geometrical figures
	$('#circle-opt').click(function(e){
		canvas.isDrawingMode=false;
		var circle = new fabric.Circle({
		radius: parseInt(drawingLineWidthEl.val())*10, fill: 'rgba(0,0,0,0)',left: 200, top: 200,strokeWidth: 2, stroke: drawingColorEl.val()
		});
		$('#draw-opt').fadeOut(10);
		canvas.add(circle);
	});
	$('#square-opt').click(function(e){
		canvas.isDrawingMode=false;
		var rect = new fabric.Rect({
		width: parseInt(drawingLineWidthEl.val())*10, height: parseInt(drawingLineWidthEl.val())*10, fill: 'rgba(0,0,0,0)',left: 200, top: 200,strokeWidth: 2, stroke: drawingColorEl.val()
		});
		$('#draw-opt').fadeOut(10);
		canvas.add(rect);


	});
	$('#tri-opt').click(function(e){
		canvas.isDrawingMode=false;
		var triangle = new fabric.Triangle({
		width: parseInt(drawingLineWidthEl.val())*10, height: parseInt(drawingLineWidthEl.val())*10, fill: 'rgba(0,0,0,0)',left: 200, top: 200,strokeWidth: 2, stroke: drawingColorEl.val()
		});
		$('#draw-opt').fadeOut(10);
		canvas.add(triangle);

	});
	//Media

	$('#image-opt').click(function(e){
		canvas.isDrawingMode=false;
		$('#media-opt').fadeOut(10);
		$('.addimage_modal').fadeIn('fast');
	});
	function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      console.log('el tamaño es '+f.size);
      if (!f.type.match('image.*') || f.size>300000) {
      	alert('Formato invalido o imagen muy grande');
      	$('#files').val('');
	$('output#list').empty();
        	continue;
      }



      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img width="150px" class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        $('#insert_img_to_canvas').fadeIn('fast');
			$('#cancel_img_canvas').fadeIn('fast');
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);


	//document.getElementById('image-input').addEventListener('change', handleFileSelect, false);
	$('#insert_img_to_canvas').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		var url_img=$('output#list').find('img').attr('src');
		fabric.Image.fromURL(url_img, function(oImg) {
  			canvas.add(oImg);
		});
		$('#files').val('');
		$('output#list').empty();
		$('#insert_img_to_canvas').fadeOut('fast');
		$('#cancel_img_canvas').fadeOut('fast');
		$('.addimage_modal').slideUp('fast');
	});
	$('.close_img').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		$('#files').val('');
		$('output#list').empty();
		$('#insert_img_to_canvas').fadeOut('fast');
		$('#cancel_img_canvas').fadeOut('fast');
		$('.addimage_modal').slideUp('fast');
	});
	$('#cancel_img_canvas').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		$('#files').val('');
		$('output#list').empty();
		$('#insert_img_to_canvas').fadeOut('fast');
		$('#cancel_img_canvas').fadeOut('fast');
		$('.addimage_modal').slideUp('fast');
	});

	//delete by pressing suprva
	/*$(document).keydown(function(e){

		if(e.keyCode==46 && oncanvas){
			if(canvas.isDrawingMode ){
				canvas.isDrawingMode=false;
				alert('Selecciona el objeto a eliminar y haz click en borrar');
			}
			else{
				var activeObject = canvas.getActiveObject(),
				activeGroup = canvas.getActiveGroup();

				if (activeGroup) {
					var objectsInGroup = activeGroup.getObjects();
					canvas.discardActiveGroup();
					objectsInGroup.forEach(function(object) {
						canvas.remove(object);
					});
				}
				else if (activeObject) {
					canvas.remove(activeObject);
				}
			}

		}

	});*/
	$('.move-icon').click(function(e) {
		e.preventDefault();
		$('.active').removeClass('active');
		canvas.isDrawingMode=false;
	});
	$('#eraser-canvas').click(function(){

		if(canvas.isDrawingMode){
			canvas.isDrawingMode=false;
			alert('Selecciona el objeto a eliminar y haz click en el borrador. O utiliza la tecla supr.');
		}
		else{
			var activeObject = canvas.getActiveObject(),
			activeGroup = canvas.getActiveGroup();

			if (activeGroup) {
				var objectsInGroup = activeGroup.getObjects();
				canvas.discardActiveGroup();
				objectsInGroup.forEach(function(object) {
					canvas.remove(object);
				});
			}
			else if (activeObject) {
				canvas.remove(activeObject);
			}
			activateDrawing();
		}
	});



}


});