requirejs.config({
	paths:{
		//Componentes for views
		'jquery':'../../components/jquery/jquery',
		'underscore':'../../components/underscore/underscore',
		'backbone':'../../components/backbone/backbone',
		'swig':'../../components/swig/swig',
		'filtersView':'../../backbone/views/feed/filters',
		'route_feed':'../../backbone/routers/feed/feed',
		'view_aside':'../../backbone/views/feed/aside',
		'view_sec_my_balance':'../../backbone/views/feed/sec_my_balance',
		'replacemath':'../../components/replacemath/replacemath',
		'rich_answer':'RichAnswer',
		'text':'../../components/text/text',


		/*collections backbone*/
		'collection_applications':'../../backbone/collections/feed/applications',
		'collection_questions':'../../backbone/collections/feed/questions',
		'collections_questions_applications':'../../backbone/collections/feed/questions_applications',
		'collections_postulations':'../../backbone/collections/feed/postulations',

		//modals
		'modal_error':'../../backbone/views/modals/modal_error',
		'loaderSpinner':'../../backbone/views/globals/LoaderSpinner',

		//define bower plugins
		'select2':'../../components/select2/select2.min',
		'select2_locale':'../../components/select2/select2_locale_es',
		'hogan':'../../components/hogan/web/1.0.0/hogan.min',
		'parsley':'../../components/parsleyjs/dist/parsley.min',
		'parsley_langs':'../../components/parsleyjs/i18n/messages.es',
		'transit':'../../components/jquery.transit/jquery.transit',
		'placeholder':'../../components/jquery-placeholder/jquery.placeholder.min',
		'spinner':'../../components/spin.js/spin',
		'fabric':'../../components/fabric/dist/all.min',
		'moment':'../../components/momentjs/moment',

	},
	shim:{
		'jquery':{
			exports: 'jQuery'
		},
		'underscore':{
			'exports':'_',
		},
		'backbone':{
			'deps': [ 'jquery' , 'underscore' ],
			'exports':'Backbone'
		},

		'swig':{
			'exports':'swig'
		},
		'replacemath':{
			exports:'replacemath'
		},
		'placeholder': ['jquery'],
		'parsley': ['jquery'],
		'parsley_langs': [ 'jquery', 'parsley' ],
		'select2': ['jquery'],
		'select2_locale': ['jquery', 'select2'],
		'transit': ['jquery'],
		'hogan': {
			exports: 'hogan'
		},
		'fabric': {
			exports: 'fabric',
			deps: ['jquery']
		},
		'rich_answer':{
			'deps': [ 'jquery' , 'fabric' ,'parsley'],
			'exports':'rich_answer'
		},
		'moment':{
			exports:'moment'
		},
	}
});

require(['jquery','backbone','filtersView','route_feed','view_aside',
	'select2', 'select2_locale',
	'hogan', 'parsley', 'parsley_langs', 'transit', 'placeholder', 'RichAnswer','moment'],
	function  ($,Backbone,filtersView,route_feed,aside_feed) {
		var feed = function(){
			var f;
			this.init = function(){
				var name_menu= $('#user-prefer');
				var name_side= $('.card h4');
				function replaceEllipsis(nm){
					st=nm.html();
					fi=st.replace("...","");
					nm.html(fi);
				}
			}
			this.interactive = function(){
				$('.close-modal').click(function() {
					$('.overlay_mask').transition({ opacity: 0 }).fadeOut(50);
					$('.overlay_question').transition({ opacity: 0}).fadeOut(50);

				});
				$('.questions-msg .icon-close').click(function() {
					$('.overlay_mask').transition({ opacity: 0 }).fadeOut(50);
					$('.questions-msg').slideUp("fast");

				});
				function prevalidate(ta,form){
				if ($(form).parsley('validate')) {
					if(ta=="Canvas"){

						var title_valid=titles.length;
						var canvas_valid=slides.length;

						if(title_valid!=0){
							console.log('dif a 0');
							$('#createInitial').click();
							canvas_valid=slides.length;
							if(canvas_valid!=0){
								return true;
							}
							else{
								alert('debes ingresar la respuesta a la pregunta en la pizarra');
								return false;
							}
						}
						else{

							var required_t=$('#title-step').parsley();
							console.log(required_t);
							if(required_t){
								console.log('valido tiutulo');

								if(canvas_valid!=0){
									return true;
								}
								else{
									$('#createInitial').click();
									canvas_valid=slides.length;
									if(canvas_valid!=0){
										return true;
									}
									else{
										alert('debes ingresar la respuesta a la pregunta en la pizarra');
										return false;
									}

								}
							}
							else{
								alert('debes ingresar el titulo de este slide');
								return false;
							}
							console.log('igualde 0');
						}
						console.log('titles length'+title_valid);
					}
					else if(met=="Video"){
						console.log('video');
						var video_check=$('#video-r').parsley('validate');
						if(video_check){
							return true;
						}
						else{
							return false;

						}

					}
					else{
						return false;
					}
				}
				else{
					return false;
				}
			}

				function checkAndSend(form,action,fid){
					$('.overlay_processing').fadeIn(10);

						$.ajax({
							type:'POST',
							url: action,
							data:$(form).serialize(),
							dataType:'JSON'
						}).done(function(data){

							if(data.success){
								$('.overlay_processing').delay(5000).fadeOut(10,function(){
									$('.overlay_question').transition({ opacity: 0}).fadeOut(50);
									$(form).each (function(){this.reset();});
									$( "#reset-canvas" ).trigger( "click" );
									$('#question-ok').slideDown("fast");
									$('#question-'+fid).slideUp("fast");
								});


							}else{
								$('.overlay_processing').delay(5000).fadeOut(10,function(){
								var error=data.errors;
								$('.overlay_question').transition({ opacity: 0}).fadeOut(50);
								$(form).each (function(){this.reset();});
								$( "#reset-canvas" ).trigger( "click" );
								$('#question-wrong').slideDown("fast");

								setTimeout(function(){
									if(error.user)
										$("#question-wrong").find(".text-2").html(error.user);
								},60);
								});

							}
						});

				}
				$('#send-answer').click(function(e){
					e.preventDefault();
					e.stopPropagation();
					var form='.answer-form';
					//console.log('Al entrar TRANSCRIPT es'+transcript);
					var action=$(form).attr('action');
					var fid=$(form).attr('data-id');
					////console.log(fid);
					var met=$('#answer_method').val();
					if(prevalidate(met,form)){
						if(met=="Canvas"){
							$( "#fake" ).trigger( "click" );
						}
						checkAndSend(form,action,fid);
					}
				});


};


this.filters = function(){
	function checkVis(ele){
		elem='#'+ele;
					//console.log('ele es'+ele+'elem es'+elem);
					var isVisible = $(elem).is(':visible');
					return isVisible;
				}
				$('#select_subject').select2({
					width: '200',
					placeholder: 'Mis especialidades'
				});
				$('#answer_method').select2({
					width: '230',
					placeholder: 'Herramientas de Respuesta'
				});
				$('#answer_method').change(function(){
					var method=$(this).val();
					//console.log(method);
					if(method=="Canvas"){

						if(!checkVis('canvas-container')){
							$('#canvas-container').slideDown('fast');
							$('#typical').slideUp('fast');
						}
						if(!checkVis('answer-form')){
							$('.answer-form').slideDown('fast');
						}
						if(!checkVis('video-r')){
							$('#video-r').slideDown('fast');
							$('.full-w').slideUp('fast');
						}
					}
					else if(method=="Video"){
						if(!checkVis('typical')){
							$('#typical').slideDown('fast');
						}
						if(!checkVis('answer-form')){
							$('.answer-form').slideDown('fast');
						}
						if(!checkVis('video-r')){
							$('#video-r').slideDown('fast');
							$('.full-w').slideUp('fast');
							$('#canvas-container').slideUp('fast');
						}

					}

				})


};
this.nav = function(){
			$('#user-prefer').click(function(e) {

				if($(this).hasClass('open')){

					$('#dropdown-top').slideUp(100);
					$(this).removeClass('open');
					
				}else{

					$('#dropdown-top').slideDown(100);
					$(this).addClass('open');

				}
				e.stopPropagation();
			});

			$("body").click(function () {

				$('#dropdown-top').slideUp(100);
				$('#user-prefer').removeClass('open');
			
			});
			
};
};
$(document).ready(function  () {
	var fObj = new feed();
	fObj.init();
	fObj.filters();
	fObj.interactive();
	fObj.nav();

	$('#section-activity').transition({ opacity: 1, delay: 500 });
	$('.overlay_question').slideUp(40);
	window.views.aside_feed=new aside_feed($("aside#sidebar"));
	window.views.filters=new filtersView($("nav.filters"));
	});
});


