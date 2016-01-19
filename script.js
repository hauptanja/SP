/*global $, jQuery, alert*/
var ocenaFilma = 0 ;
$(document).ready(function () {
    "use strict";
    
    $.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results==null)
        return '';
    else
        return results[1];
    }

    if ($.urlParam('id_film') != '') {  // variable_name would be the name of your variable within your url following the ? symbol
        getDetails($.urlParam('id_film'),"");
    }
	$("#najvec_gledani_filmi").css("background-color", "white");
	$("#best_film_table").hide();
	$("#second_c").hide();
    $("#most_watched_table").hide();

	getUserData ();

    $.ajax({
        type: "POST",
        url: "filmdetails.php",
        data: 
        {
            method: "getBest"
        },
        cache: false,
        success: function (result) {
            $("#best_film_table").empty();
			var data = JSON.parse(result);
            $("#best_film_table").append(data[1]);
            $("#most_watched_table").append(data[2]);
			$("#best_film_table").hide();
            $("#most_watched_table").hide();
            
        },
        error: function (result) {
            alert(result);
        }
    });

    $("#prev6_button").hide();
    $("#next6_button").hide();
    
    $('.tab-links a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');
        if (currentAttrValue == "#log_out")
        {
            $.ajax({
                type: "POST",
                url: "checkLogin.php",
                data: {
                    operacija: "logout"
                },
                success:function() {
                    location.reload();
                }
            });
            $("#najboljse_ocenjeni_filmi").show();
            $("#najvec_gledani_filmi").show();
        }
        else
        {
	        if (currentAttrValue == "#user_profile")
			{
            	
            	$("#profil_menu_select").val("moj_profil");
            	$("#moj_profil").show();
            	$("#nastavitve_racuna").hide();
            	$("#ogledani_filmi").hide();
            	$.ajax({
			        type: "POST",
			        url: "filmdetails.php",
			        data: 
			        {
			            method: "getRandom"
			        },
			        cache: false,
			        success: function (result) {
				        $("#nakljucni_film_table").empty();
			            $("#nakljucni_film_table").append(result);
			        },
			        error: function (result) {
				        alert(result );
			        }
			    });

        	}
        	else
        	{
	        	$("#najboljse_ocenjeni_filmi").show();
	        	$("#najvec_gledani_filmi").show();
        	}
            // Show/Hide Tabs
            $( currentAttrValue).show().siblings().hide();

            // Change/remove current tab to active
            $(this).parent('li').addClass('active').siblings().removeClass('active');
        }
        e.preventDefault();
        //$('body').scrollTo(currentAttrValue);
    });
    
    $('.search-opt a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');
        
        if ($('.search-opt ' + currentAttrValue).hasClass('active') === false) {
            $('.search-opt ' + currentAttrValue).addClass('active');
            $('.search-opt ' + currentAttrValue).parent('li').toggleClass('active');
            //$('body').scrollTo('.search-opt ' + currentAttrValue);
        } else {
            $('.search-opt ' + currentAttrValue).removeClass('active');
            $('.search-opt ' + currentAttrValue).parent('li').toggleClass('active');
        }
        
        e.preventDefault();
    });
    
    $("#movieSearchBox").keypress(function (e) {
        if (e.which === 13) { // if is enter
            var text = $(this).val();
	            $.ajax({
	                type: "POST",
	                url: "filmdetails.php",
	                data: 
	                {
	                    movie_name: text,
	                    movie_id: "-",
	                    method: "getSearchResults"
	                },
	                cache: false,
	                success: function (result) {
		                if(data !== "Film ni v bazi.") 
		                {
	                    	var data = JSON.parse(result);
							if (data.length != 1)
							{
								$(".search-result-opt").empty();
	                    	
		                    	for (var i in data)
		                    	{
			                    	$(".search-result-opt").append(data[i]);
		                    	}
							}
							else 
							{
						        pokaziFilm ("-", text);
							}
	                    	
	                    }
	                    else 
	                    {
		                    alert("Filma s podobnim naslovom ni v bazi!");
	                    }
	                },
	                error: function (result) {
	                    alert(result);
	                }
	            }); 
        }
    });
    var id_prikazanega_filma;
    $(document).on("click", ".search-result-opt td", function() {
	    id_prikazanega_filma = $(this).attr("id"); 
        pokaziFilm (id_prikazanega_filma, "");
    });
    
    $("#wordSearchBox").keypress(function (e) {
        if (e.which === 13) { // if is enter
            var text = $(this).val();
            
            $.ajax({
                type: "POST",
                url: "filmdetails.php",
                data: 
                {
                    beseda: text,
                    method: "beseda->naslov"
                },
                cache: false,
                success: function (result) {
	                $("#opcije_list").empty();
	                $("#vpisane_besede").html("Ključne besede: " + text);	
					$("#opcije_list").append(result);
                	
                },
                error: function (result) {
                    alert(result);
                }
            });
            
            $('#opcije_table').show().siblings().hide();
            
        }
    });
    
	$(document).on("click", "#back_to_list_button", function() {
        if ($("#film_list_table tbody").children().length == 0)
        	$('#main').show().siblings().hide();
        else 
        	$('#film_list').show().siblings().hide();
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
    });
    
    $(document).on("click", "#back_to_start_button", function() {
        $('#main').show().siblings().hide();
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
        $('input').prop('checked', false);
         $('#facebookShare').empty();
    });
    
     $(document).on("click", ".starIMG", function(e) {
         ocenaFilma=$(this).parent().attr("id").slice(-1);
         $("#zvezdice").empty();
    });

    $(document).on("mousedown", "td.filmi", function() {
        var id = $(this).attr("data-movie-ID");

        $("#watched_button").removeClass("pressedB");
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
        
		getDetails(id, "");
		
		$.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
                    film: id,
                    method: "getKanal"
                },
                cache: false,
                success: function (result) 
				{
                    $("#kanal").html(result);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
			
		$(document).on("click", "button.btn", function() {
		var kanal = $(this).text();
		//alert(kanal);
			
	    $.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
		    spored: kanal,
                    film: id,
                    method: "getSpored"
                },
                cache: false,
                success: function (result) 
				{
                    $("#spored_prikaz").html(result);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
			
			$(' #spored_prikaz').show();
        });
		
		$(' #kanal').show();
    });
    
    $("#back_to_genre_button").click(function () {
        $(' #main').show().siblings().hide();
		$('input').prop('checked', false);
    });
	
	$(document).on("mousedown", "td.filmi", function() {
        var id = $(this).attr("data-movie-ID");

        $("#watched_button").removeClass("pressedB");
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
        
		getDetails(id, "");
		
		$.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
                    film: id,
                    method: "getLokacija"
                },
                cache: false,
                success: function (result) 
				{
                    $("#lokacija").html(result);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
			
			$(document).on("click", "button.btn", function() {
			var lokacija = $(this).text();
			//alert(kanal);
			
			$.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
					spored: lokacija,
                    film: id,
                    method: "getDatumSpored"
                },
                cache: false,
                success: function (result) 
				{
                    $("#datum").html(result);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
			
			$(document).on("click", "button.datum", function() {
			var datum = $(this).text();
			//alert(kanal);
			
			$.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
					spored: datum,
					l: lokacija,
                    film: id,
                    method: "getKinoSpored"
                },
                cache: false,
                success: function (result) 
				{
                    $("#kinoSpored").html(result);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
			
			$('#kinoSpored').show();
        });
			
			$('#datum').show();
        });
			
		$('#lokacija').show();
    });
    
    $("#back_to_genre_button").click(function () {
        $(' #main').show().siblings().hide();
		$('input').prop('checked', false);
    });
	
	$(document).on("click", "td.categories", function() {
		var text = "Žanr: " + $(this).text();
		var kategorija = $(this).text().substring(0, 4);
		$.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
                    genre_name: kategorija,
                    method: "getMovies"
                },
                cache: false,
                success: function (result) 
				{
					var data = JSON.parse(result);
					$("#naslov_zanra").text(text);
                    $("#filmi").html(data[0]);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
        
		$(' #filmi_list').show().siblings().hide();
    });
    
    $( "#registriraj" ).click(function() {
        if( $( "#username1" ).val().length==0 || $( "#username1" ).val()=="" || $( "#password" ).val().length==0 || $( "#password" ).val()=="" || $( "#email" ).val().length==0  || $( "#email" ).val()=="" || $( "#name" ).val().length==0  || $( "#name" ).val()=="" || $( "#lastname" ).val().length==0 || $( "#lastname" ).val().length==0 || $( "#gender" ).val().length==0 || $( "#gender" ).val().length==0 ){
            alert("Izpolnite vsa polja!");
        }
        else{
          $.ajax({
            type: "POST",
            url: "registration.php",
            data: {
                Username: $( "#username1" ).val(),
                Password: $( "#password" ).val(),
                Email: $( "#email" ).val(),
                Name: $( "#name" ).val(),
                Lastname: $( "#lastname" ).val(),
                Sex: $( "#gender" ).val()
            },
              success: function(){
                $(' #login').show().siblings().hide();
                $('a').parent('li').removeClass('active');
                $('a[href$="#login"]').parent('li').addClass('active');
              }
          });
        }
    });

    $( "#loginButton" ).click(function() {
        log_in ();
    });
    
    $("#ocena_filma").hide();
    $("#ocena_filma_p").hide();
    
    //$("#watched_button").click(function() {
       // $("#ocena_filma").show();
   // });
    
    $("#watched_button_p").click(function() {
    	$("#ocena_filma_p").show();
    });
    
    $(document).on("mousedown", "td#star1", function() {
        oceni(1);
    });
    $(document).on("mousedown", "td#star2", function() {
        oceni(2);
    });
    $(document).on("mousedown", "td#star3", function() {
        oceni(3);
    });
    $(document).on("mousedown", "td#star4", function() {
        oceni(4);
    });
    $(document).on("mousedown", "td#star5", function() {
        oceni(5);
    });
    
    //UPORABI ZA GRAFIKO OB KLIKU NA SLIKO
    var ocenaVzvezdicah = 0;
    var letoNastanka;
    $(document).on("mouseover", "#film_list_table td", function() {
        var id = $(this).attr("data-movie-ID");
        
        $.ajax({
        type: "POST",
        url: "filmdetails.php",
        data: 
        {
            movie_id: id,
            method: "getMiniData"
        },
        cache: false,
        success: function (result) {
            
            var data = JSON.parse(result);
            if (data != "no") {
                $('#slo_naslov_d').text(data[0]);
                $('#ang_naslov_d').text(data[1]);
                $('#genre_d').text(data[2]);
                
				if (data[3] === "NULL")
                	$("#tomatoscore_d").html("");
                else{
					if (data[3] < 7)
						var txt1 = "/10 <img class='thumbs' src='thumbs-down.png'/>";
					else if (data[3] > 8)
						var txt1 = "/10 <img class='thumbs' src='thumbs-up.png'/>";
					else 
						var txt1 = "/10 <img class='thumbs' src='thumbs-neutral.png'/>";
					$("#tomatoscore_d").html(data[3] + txt1);
				}
					
				//OCENA ZA PRIKAZ ZVEZDIC 	
				if (data[4] === "NULL") {
					$("#audience_d").html("");
					ocenaVzvezdicah = 0;
				}
				else {
					if (data[4] < 3)
						var txt2 = "/5 <img class='thumbs' src='thumbs-down.png'/>";
					else if (data[4] >= 4)
						var txt2 = "/5 <img class='thumbs' src='thumbs-up.png'/>";
					else 
						var txt2 = "/5 <img class='thumbs' src='thumbs-neutral.png'/>";
					$("#audience_d").html(data[4] + txt2);
					ocenaVzvezdicah = data[4];
				}

				$("#spored_d").html(data[5]);
				
				//LETO NASTANKA
				letoNastanka = data[6];
            }
        },
        error: function (result) {
            alert(result);
        }
    	});
    
    });
    
    $("#next6_button").click(function(){
	    $("#film_list_table tr.stran1").hide();
	    $("#film_list_table tr.stran2").show();
	    $("#next6_button").hide();
	    $("#prev6_button").show();
    });
    
    $("#prev6_button").click(function(){
	    $("#film_list_table tr.stran2").hide();
	    $("#film_list_table tr.stran1").show();
	    $("#prev6_button").hide();
	    $("#next6_button").show();
    });
    
    var film_linki;
    var film_ocene;
    var film_leta;
    var film_id;
    var film_angNaslov;
    var film_genre;
    var film_duration;
    var film_country;
    var film_summary;
    
    $(document).on("click", "#show_canvas_button", function() {
        $('#canvas_div').show();
        $("#film_list_data").hide();
        $("#next6_button").hide();
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
        $("#najboljse_ocenjeni_filmi").hide();
		$("#najvec_gledani_filmi").hide();
		$("#show_canvas_button").hide();
		$('#film_list').width(1000);
		$('#canvas_div').width(1000);
		$('body').scrollTo('#canvas_div');
		
		$.ajax({
            type: "POST",
            url: "filmdetails.php",
            data: 
            {
                movie_name: "",
                movie_id: id_prikazanega_filma,
                method: "getGrafikaList"
            },
            cache: false,
            success: function (result) { 
	            
                var data = JSON.parse(result);
                
                if(data[1] !== "Film ni v bazi.") {
	                var str = data[1];
					film_linki = str.split("#");
					
					str = data[2];
					film_leta = str.split("#");
					
					str = data[3];
					film_ocene = str.split("/10");

                    str = data[4];
                    //film_ID = str.split("#");
                    str = data[5];
                    film_angNaslov = str.split("#");
                    str = data[6];
                    film_genre = str.split("#");
                    str = data[7];
                    film_duration = str.split("#");
                    str = data[8];
                    film_country = str.split("#");
                    str = data[9];
                    film_summary = str.split("#");

					
					webGLStart();
                }
            },
            error: function (result) {
                alert(result);
            }
        });
        
    });
    
    var gl;
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }
    
    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    
    var shaderProgram;
    
    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        gl.useProgram(shaderProgram);
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
        shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
    }
	
	function createTextTexture(text) {
								
		// create a hidden canvas to draw the texture 
		var canvas = document.createElement('canvas');
		canvas.id     = "hiddenCanvas";
		canvas.width  = 512;
		canvas.height = 512;
		canvas.style.display = "none";
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(canvas);        

		// draw texture
		var textImage = document.getElementById('hiddenCanvas');
		var ctx = textImage.getContext('2d');
		ctx.beginPath();
		ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);       
		ctx.fillStyle="#EDFFFC";
		ctx.fill();
		ctx.fillStyle = 'black';
		ctx.font = "bold 215px Segoe UI";
		//ctx.font = "normal 215px Segoe UI";
		ctx.textAlign = 'center';
		ctx.shadowColor = "#76a3a3";
		ctx.shadowOffsetX = 20;
		ctx.shadowOffsetY = 20;
		ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height/1.7);
		ctx.restore();

		// create new texture
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		handleTextureLoaded1(textImage, texture) 
		
		return texture;
	}
	 
	function handleTextureLoaded1(image, texture) {
	  gl.bindTexture(gl.TEXTURE_2D, texture);
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	  gl.generateMipmap(gl.TEXTURE_2D);
	  gl.bindTexture(gl.TEXTURE_2D, null);
	}
    
    function handleLoadedTexture(texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    var film_textures = [];
    var texture_index = -1;
    function handleLoadedTextureWithIndex(index) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, film_textures[index]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, film_textures[index].image);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
	var textImage;
	var textTexture;
	var roofTexture;
	var cinemaTexture;
	var wallTexture;
	var dvdTexture;
	var cylinderTexture;
    var shelfTexture;
    var modra, zelena, rumena, rdeca, vijolicna, turkizna;
    var tmptexture;
	
    function initTextures() {
		texture_index = -1;
		for (var link in film_linki) {
			tmptexture = gl.createTexture();
	        tmptexture.image = new Image();
// 	        tmptexture.image.crossOrigin = "Anonymous";
			tmptexture.image.crossOrigin = '';			
	        tmptexture.image.onload = function () {
		        if (texture_index == 12)
		        	texture_index = -1;
		        texture_index++;
	            handleLoadedTextureWithIndex(texture_index) //??????
	        }
			tmptexture.image.src = film_linki[link];
			
			film_textures.push(tmptexture);
			
		}
		
		
		roofTexture = gl.createTexture();
        roofTexture.image = new Image();
        roofTexture.image.onload = function () {
            handleLoadedTexture(roofTexture)
        }
        roofTexture.image.src = "grafika/gold.gif";
		
		cinemaTexture = gl.createTexture();
        cinemaTexture.image = new Image();
        cinemaTexture.image.onload = function () {
            handleLoadedTexture(cinemaTexture)
        }
        cinemaTexture.image.src = "grafika/kamera.png";
		
		wallTexture = gl.createTexture();
        wallTexture.image = new Image();
        wallTexture.image.onload = function () {
            handleLoadedTexture(wallTexture)
        }
        wallTexture.image.src = "grafika/soba.png";
		
		dvdTexture = gl.createTexture();
        dvdTexture.image = new Image();
        dvdTexture.image.onload = function () {
            handleLoadedTexture(dvdTexture)
        }
        dvdTexture.image.src = "grafika/frozen.gif";
		
		cylinderTexture = gl.createTexture();
        cylinderTexture.image = new Image();
        cylinderTexture.image.onload = function () {
            handleLoadedTexture(cylinderTexture)
        }
        cylinderTexture.image.src = "grafika/cilinder.gif";

        shelfTexture = gl.createTexture();
        shelfTexture.image = new Image();
        shelfTexture.image.onload = function () {
            handleLoadedTexture(shelfTexture)
        }
        shelfTexture.image.src = "grafika/crate.gif";

        modra = gl.createTexture();
        modra.image = new Image();
        modra.image.onload = function () {
            handleLoadedTexture(modra)
        }
        modra.image.src = "grafika/modra.gif";

        rdeca = gl.createTexture();
        rdeca.image = new Image();
        rdeca.image.onload = function () {
            handleLoadedTexture(rdeca)
        }
        rdeca.image.src = "grafika/rdeca.gif";

         rumena = gl.createTexture();
        rumena.image = new Image();
        rumena.image.onload = function () {
            handleLoadedTexture(rumena)
        }
        rumena.image.src = "grafika/rumena.gif";

         zelena = gl.createTexture();
        zelena.image = new Image();
        zelena.image.onload = function () {
            handleLoadedTexture(zelena)
        }
        zelena.image.src = "grafika/zelena.gif";

         turkizna = gl.createTexture();
        turkizna.image = new Image();
        turkizna.image.onload = function () {
            handleLoadedTexture(turkizna)
        }
        turkizna.image.src = "grafika/turkizna.gif";


         vijolicna = gl.createTexture();
        vijolicna.image = new Image();
        vijolicna.image.onload = function () {
            handleLoadedTexture(vijolicna)
        }
        vijolicna.image.src = "grafika/vijolicna.gif";
    }
    
    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
    
    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }
    
    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }
    
    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }
    
    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    var cameraXPosition = 0;
    var cameraYPosition = 0;
    var cameraZPosition = -10;
    var cameraXAngle = 0;
    var cameraYAngle = 0;
    var cameraZAngle = 0;
    var cubeXAngle = 0;
    var cubeYAngle = 0;
    var cubeXPosition = 5;
    var cubeYPosition = 0;
    var cubeZPosition = 0;
    var cubeScale = 1;
    var currentlyPressedKeys = {};
    
    var meja = 7;
    
    var mouseDown = false;
	var lastMouseX = null;
	var lastMouseY = null;
	var newX = null;
	var newY = null;
    var clicked = false;
    var nadstropje = 0;
    var rect;
	
	var moonRotationMatrix = mat4.create();
	mat4.identity(moonRotationMatrix);
	
	function handleMouseDown(event) {
		mouseDown = true;
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
        rect = event.target.getBoundingClientRect();
        clicked = true;
        drawScene();
	}
	
	function handleMouseUp(event) {
		mouseDown = false;
		
		var diffX = lastMouseX - newX;
		var diffY = lastMouseY - newY;
		
		if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 20) {
			if (lastMouseY < newY) {
	            // gor
	            if (cameraYPosition > -10.5)
	            	cameraYPosition -= 10.5;
                nadstropje = 1;
	        }
	        if (lastMouseY > newY) {
	            // dol
	            if (cameraYPosition < 0)
	            	cameraYPosition += 10.5;
                nadstropje = 0;
	        }
	    }
	    else if (Math.abs(diffX) > 20){
	        //rotate camera
	        if (lastMouseX < newX) {
	            // left arrow
	            cameraYAngle -= 60;
	        }
	        if (lastMouseX > newX) {
		        //right arrow
		        cameraYAngle += 60;
	        }
		}
	}
	
	function handleMouseMove(event) {
		if (!mouseDown) {
		  return;
		}
		
		newX = event.clientX;
		newY = event.clientY;
		
		
// 		lastMouseX = newX
// 		lastMouseY = newY;
	}
    
    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }
    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }
    function handleKeys() {
	    //move camera
        if (currentlyPressedKeys[82]) {
            // R gor
            if (cameraYPosition > -10.5)
            	cameraYPosition -= 10.5;
            nadstropje = 1;
        }
        if (currentlyPressedKeys[70]) {
            // F dol
            if (cameraYPosition < 0)
            	cameraYPosition += 10.5;
            nadstropje = 0;
        }
        //rotate camera
        if (currentlyPressedKeys[37]) {
            // left arrow
            cameraYAngle += 1;
        }
        if (currentlyPressedKeys[39]) {
	        //right arrow
	        cameraYAngle -= 1;
        }
    }

    function getTexture4Picking(x){
        switch(x) {
            case 0:
                return rdeca;
                break;
            case 1:
                return zelena;
                break;
            case 2:
                return rumena;
                break;
            case 3:
                return modra;
                break;
            case 4:
                return turkizna;
                break;
            case 5:
                return vijolicna;
                break;
            default:
                return modra;
        }
    }
        
    var mesh_dvd, mesh_podstavek, mesh_cilinder, mesh_star;
	var mesh_kamera, mesh_skybox;
	var cubeVertexPositionBuffer;
    var cubeVertexNormalBuffer;
    var cubeVertexTextureCoordBuffer;
    var cubeVertexIndexBuffer;
    
    function initBuffers() {
	    //load objects
	    
	    var objStr = "";
	    objStr = document.getElementById('dvd').innerHTML; //SAMO ZA TESTIRANJE
	    /*
	    jQuery.get('dvd.obj', function(data) { //TU SE DA LINK DO OBJEKTA
			objStr = data;
			//alert(objStr);
		});
		*/
		mesh_dvd = new OBJ.Mesh(objStr);
		OBJ.initMeshBuffers(gl, mesh_dvd);
		
	    objStr = document.getElementById('podstavek').innerHTML; //SAMO ZA TESTIRANJE
	    /*
	    jQuery.get('dvd.obj', function(data) { //TU SE DA LINK DO OBJEKTA
			objStr = data;
			//alert(objStr);
		});
		*/
		mesh_podstavek = new OBJ.Mesh(objStr);
		OBJ.initMeshBuffers(gl, mesh_podstavek);
		
	    objStr = document.getElementById('cilinder').innerHTML; //SAMO ZA TESTIRANJE
	    /*
	    jQuery.get('dvd.obj', function(data) { //TU SE DA LINK DO OBJEKTA
			objStr = data;
			//alert(objStr);
		});
		*/
		mesh_cilinder = new OBJ.Mesh(objStr);
		OBJ.initMeshBuffers(gl, mesh_cilinder);
		
		objStr = document.getElementById('star').innerHTML; //SAMO ZA TESTIRANJE
	    /*
	    jQuery.get('dvd.obj', function(data) { //TU SE DA LINK DO OBJEKTA
			objStr = data;
			//alert(objStr);
		});
		*/
		mesh_star = new OBJ.Mesh(objStr);
		OBJ.initMeshBuffers(gl, mesh_star);
		
		objStr = document.getElementById('skybox').innerHTML; //SAMO ZA TESTIRANJE
	    /*
	    jQuery.get('dvd.obj', function(data) { //TU SE DA LINK DO OBJEKTA
			objStr = data;
			//alert(objStr);
		});
		*/
		mesh_skybox = new OBJ.Mesh(objStr);
		OBJ.initMeshBuffers(gl, mesh_skybox);
		
		objStr = document.getElementById('kamera').innerHTML; //SAMO ZA TESTIRANJE
	    /*
	    jQuery.get('dvd.obj', function(data) { //TU SE DA LINK DO OBJEKTA
			objStr = data;
			//alert(objStr);
		});
		*/
		mesh_kamera = new OBJ.Mesh(objStr);
		OBJ.initMeshBuffers(gl, mesh_kamera);
		
		cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        var vertices = [
            -2.0, -2.75,  1.0,
             2.0, -2.75,  1.0,
             2.0,  2.75,  1.0,
            -2.0,  2.75,  1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 4;
		
        cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
        var vertexNormals = [
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
        cubeVertexNormalBuffer.itemSize = 3;
        cubeVertexNormalBuffer.numItems = 4;
        cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        var textureCoords = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        cubeVertexTextureCoordBuffer.itemSize = 2;
        cubeVertexTextureCoordBuffer.numItems = 4;
        cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        var cubeVertexIndices = [
            0, 1, 2,      0, 2, 3
        ];
		
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
        cubeVertexIndexBuffer.itemSize = 1;
        cubeVertexIndexBuffer.numItems = 6;
    }
    
    var rttFramebuffer;
    var rttTexture;
    var lastCapturedColourMap;

    function initTextureFramebuffer() {
        rttFramebuffer = gl.createFramebuffer();
        lastCapturedColourMap = new Uint8Array(1 * 1 * 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        rttFramebuffer.width = gl.viewportWidth;
        rttFramebuffer.height = gl.viewportHeight;
        rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, rttTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    function getPickingID(r, g, b){
        (r==204)?r=1:r=0;
        (g==204)?g=2:g=0;
        (b==204)?b=4:b=0;
        if((r+g+b) == 0)
            return -1;
        else
            return (r + g + b - 1) + (nadstropje * 6);
    }

    var count = 0;
    function drawScene() {
         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            if(clicked == true)
                gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);
        var lighting = true;
        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                parseFloat(0.8),
                parseFloat(0.8),
                parseFloat(0.8)
            );
            gl.uniform3f(
                shaderProgram.pointLightingLocationUniform,
                parseFloat(5),
                parseFloat(6),
				parseFloat(8)
                //parseFloat(-5)
            );
            gl.uniform3f(
                shaderProgram.pointLightingColorUniform,
                parseFloat(0.5),
                parseFloat(0.5),
                parseFloat(0.5)
            );
        }
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [cameraXPosition, cameraYPosition, cameraZPosition]);
		mat4.rotate(mvMatrix, degToRad(cameraXAngle), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(cameraYAngle), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(cameraZAngle), [0, 0, 1]);
		
		//loaded skybox
		mvPushMatrix();
		mat4.translate(mvMatrix, [0, -5.5, 5]);
		mat4.scale(mvMatrix,[cubeScale+4, cubeScale+4, cubeScale+4]);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh_skybox.vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_skybox.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		if(!mesh_skybox.textures.length){
		  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
		}
		else{
		  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_skybox.textureBuffer);
		  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_skybox.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		  gl.activeTexture(gl.TEXTURE0);
		  gl.bindTexture(gl.TEXTURE_2D, wallTexture); //dodaj teksturo
		  gl.uniform1i(shaderProgram.samplerUniform, 0);
		}
		
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh_skybox.normalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_skybox.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_skybox.indexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, mesh_skybox.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		mvPopMatrix();
		
		//loaded cylinder
		mvPushMatrix();
		mat4.translate(mvMatrix, [0, -4.7, 0]);
		mat4.scale(mvMatrix,[cubeScale+0.3, cubeScale+0.3, cubeScale+0.3]);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh_cilinder.vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_cilinder.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		if(!mesh_cilinder.textures.length){
		  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
		}
		else{
		  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_cilinder.textureBuffer);
		  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_cilinder.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		  gl.activeTexture(gl.TEXTURE0);
		  gl.bindTexture(gl.TEXTURE_2D, cylinderTexture); //dodaj teksturo
		  gl.uniform1i(shaderProgram.samplerUniform, 0);
		}
		
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh_cilinder.normalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_cilinder.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_cilinder.indexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, mesh_cilinder.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		mvPopMatrix();
		
		//loaded kamera
		for(var x=0; x<2; x++)
		{
			mvPushMatrix();
			mat4.translate(mvMatrix, [0, (0+10.6)*x, 0]);
			mat4.rotate(mvMatrix, degToRad(cameraXAngle+30), [0, 1, 0]);
			mat4.scale(mvMatrix,[cubeScale-0.5, cubeScale-0.5, cubeScale-0.5]);
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh_kamera.vertexBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_kamera.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			if(!mesh_cilinder.textures.length){
			  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
			}
			else{
			  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
			  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_kamera.textureBuffer);
			  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_kamera.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
			  gl.activeTexture(gl.TEXTURE0);
			  gl.bindTexture(gl.TEXTURE_2D, cinemaTexture); //dodaj teksturo
			  gl.uniform1i(shaderProgram.samplerUniform, 0);
			}
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh_kamera.normalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_kamera.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_kamera.indexBuffer);
			setMatrixUniforms();
			gl.drawElements(gl.TRIANGLES, mesh_kamera.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			mvPopMatrix();
		}
        
        //loaded dvdji
        for(var j=0;j<2;j++){
            for(var i=0;i<4;i++){
                mvPushMatrix();
                mat4.rotate(mvMatrix, degToRad(cubeYAngle+(i*+60)), [0, 1, 0]);
                mat4.translate(mvMatrix, [cubeXPosition-5.77, (cubeYPosition -1)+(j*10.5), cubeZPosition -6]);
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_dvd.vertexBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_dvd.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
                
                if(!mesh_dvd.textures.length){
                  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
                }
                else{
                  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
                  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_dvd.textureBuffer);
                  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_dvd.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
                  gl.activeTexture(gl.TEXTURE0);
                  gl.bindTexture(gl.TEXTURE_2D, film_textures[count]); //dodaj teksturo
                  count++;
                  if (count == 12)
                  	count = 0;
                  gl.uniform1i(shaderProgram.samplerUniform, 0);
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_dvd.normalBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_dvd.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_dvd.indexBuffer);
                setMatrixUniforms();
                gl.drawElements(gl.TRIANGLES, mesh_dvd.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                mvPopMatrix();

                //loaded object podstavek2
                mvPushMatrix();
                mat4.rotate(mvMatrix, degToRad(cubeYAngle+(i*+60)), [0, 1, 0]);
                mat4.translate(mvMatrix, [cubeXPosition - 4.5,(cubeYPosition -1)+(j*10.5), cubeZPosition-6]);
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_podstavek.vertexBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_podstavek.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
                
                if(!mesh_podstavek.textures.length){
                  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
                }
                else{
                  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
                  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_podstavek.textureBuffer);
                  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_podstavek.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
                  gl.activeTexture(gl.TEXTURE0);
                  gl.bindTexture(gl.TEXTURE_2D, shelfTexture); //dodaj teksturo
                  gl.uniform1i(shaderProgram.samplerUniform, 0);
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_podstavek.normalBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_podstavek.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_podstavek.indexBuffer);
                setMatrixUniforms();
                gl.drawElements(gl.TRIANGLES, mesh_podstavek.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                
				//letnica
				/*mat4.scale(mvMatrix,[0.10, 0.05, 0.1]);
				mat4.translate(mvMatrix, [-0.8, -3, 14.2]);
				mat4.rotate(mvMatrix, degToRad(180), [0, 1, 0]);
				gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
				gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, textTexture);
				gl.uniform1i(shaderProgram.samplerUniform, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
				setMatrixUniforms();
				gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);*/
                mvPopMatrix();
            }

            for(var i=0;i<2;i++){
                mvPushMatrix();
                mat4.rotate(mvMatrix, degToRad(cubeYAngle +(-60*(i+1))), [0, 1, 0]);
                mat4.translate(mvMatrix, [cubeXPosition-5.77, (cubeYPosition -1)+(j*10.5), cubeZPosition -6]);
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_dvd.vertexBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_dvd.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
               
                if(!mesh_dvd.textures.length){
                  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
                }
                else{
                  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
                  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_dvd.textureBuffer);
                  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_dvd.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
                  gl.activeTexture(gl.TEXTURE0);
                  gl.bindTexture(gl.TEXTURE_2D, film_textures[count]); //dodaj teksturo
                  count++;
                  if (count == 12)
                  	count = 0;
                  gl.uniform1i(shaderProgram.samplerUniform, 0);
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_dvd.normalBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_dvd.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_dvd.indexBuffer);
                setMatrixUniforms();
                gl.drawElements(gl.TRIANGLES, mesh_dvd.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                mvPopMatrix();

                //loaded object podstavek2
                mvPushMatrix();
                mat4.rotate(mvMatrix, degToRad(cubeYAngle+(-60*(i+1))), [0, 1, 0]);
                mat4.translate(mvMatrix, [cubeXPosition - 4.5,(cubeYPosition -1)+(j*10.5), cubeZPosition-6]);
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_podstavek.vertexBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_podstavek.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
                
                if(!mesh_podstavek.textures.length){
                  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
                }
                else{
                  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
                  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_podstavek.textureBuffer);
                  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_podstavek.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
                  gl.activeTexture(gl.TEXTURE0);
                  gl.bindTexture(gl.TEXTURE_2D, shelfTexture); //dodaj teksturo
                  gl.uniform1i(shaderProgram.samplerUniform, 0);
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh_podstavek.normalBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_podstavek.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_podstavek.indexBuffer);
                setMatrixUniforms();
                gl.drawElements(gl.TRIANGLES, mesh_podstavek.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				
				//letnica
				/*mat4.scale(mvMatrix,[0.10, 0.05, 0.1]);
				mat4.translate(mvMatrix, [-0.8, -3, 14.2]);
				mat4.rotate(mvMatrix, degToRad(180), [0, 1, 0]);
				gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
				gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, textTexture);
				gl.uniform1i(shaderProgram.samplerUniform, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
				setMatrixUniforms();
				gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);*/
                mvPopMatrix();
            }
        }
		
		/*if(ocenaVzvezdicah != 0)
		{
			for(var j=0; j<ocenaVzvezdicah; j++)
			{
				mvPushMatrix();
				mat4.translate(mvMatrix, [-0.7, -1.2, -4.7]);
				mat4.scale(mvMatrix,[0.02, 0.02, 0.02]);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.vertexBuffer);
		        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_star.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
				
				if(!mesh_cilinder.textures.length){
				  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
				}
				else{
				  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
				  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.textureBuffer);
				  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_star.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
				  gl.activeTexture(gl.TEXTURE0);
				  gl.bindTexture(gl.TEXTURE_2D, roofTexture); //dodaj teksturo
				  gl.uniform1i(shaderProgram.samplerUniform, 0);
				}
				
		        gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.normalBuffer);
		        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_star.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_star.indexBuffer);
		        setMatrixUniforms();
		        gl.drawElements(gl.TRIANGLES, mesh_star.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				mvPopMatrix();
			}
		}*/
			
		//zvezdice kamera
		for(var j=0; j<2; j++)
		{
			for(i=0; i<5; i++){
				mvPushMatrix();
				mat4.rotate(mvMatrix, degToRad(cameraXAngle+30), [0, 1, 0]);
				mat4.translate(mvMatrix, [0.35*i-0.7, -0.2+j*10.6, -0.2]);
				mat4.scale(mvMatrix,[0.02, 0.02, 0.02]);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.vertexBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_star.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
				
				if(!mesh_cilinder.textures.length){
				  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
				}
				else{
				  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
				  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.textureBuffer);
				  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_star.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
				  gl.activeTexture(gl.TEXTURE0);
				  gl.bindTexture(gl.TEXTURE_2D, roofTexture); //dodaj teksturo
				  gl.uniform1i(shaderProgram.samplerUniform, 0);
				}
				
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.normalBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_star.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_star.indexBuffer);
				setMatrixUniforms();
				gl.drawElements(gl.TRIANGLES, mesh_star.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				mvPopMatrix();
			}
		}
		
		for(var j=0; j<2; j++)
		{
			for(i=0; i<5; i++){
				mvPushMatrix();
				mat4.rotate(mvMatrix, degToRad(cameraXAngle+30), [0, 1, 0]);
				mat4.translate(mvMatrix, [0.35*i-0.7, -0.2+j*10.6, -0.2+j*0.7]);
				mat4.scale(mvMatrix,[0.02, 0.02, 0.02]);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.vertexBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_star.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
				
				if(!mesh_cilinder.textures.length){
				  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
				}
				else{
				  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
				  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.textureBuffer);
				  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_star.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
				  gl.activeTexture(gl.TEXTURE0);
				  gl.bindTexture(gl.TEXTURE_2D, roofTexture); //dodaj teksturo
				  gl.uniform1i(shaderProgram.samplerUniform, 0);
				}
				
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.normalBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_star.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_star.indexBuffer);
				setMatrixUniforms();
				gl.drawElements(gl.TRIANGLES, mesh_star.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				mvPopMatrix();
			}
		}
		
		for(i=0; i<5; i++)
		{
			mvPushMatrix();
			mat4.rotate(mvMatrix, degToRad(cameraXAngle+30), [0, 1, 0]);
			mat4.translate(mvMatrix, [0.35*i-0.7, -0.2, -0.2+0.7]);
			mat4.scale(mvMatrix,[0.02, 0.02, 0.02]);
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.vertexBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh_star.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			if(!mesh_cilinder.textures.length){
			  gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
			}
			else{
			  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
			  gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.textureBuffer);
			  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh_star.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
			  gl.activeTexture(gl.TEXTURE0);
			  gl.bindTexture(gl.TEXTURE_2D, roofTexture); //dodaj teksturo
			  gl.uniform1i(shaderProgram.samplerUniform, 0);
			}
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh_star.normalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh_star.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh_star.indexBuffer);
			setMatrixUniforms();
			gl.drawElements(gl.TRIANGLES, mesh_star.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			mvPopMatrix();
			}

        if(clicked == true){
            for(var j=0;j<2;j++){
                for(var i=0;i<4;i++){
                    mvPushMatrix();
                    mat4.rotate(mvMatrix, degToRad(cubeYAngle+(i*+60)), [0, 1, 0]);
                    mat4.scale(mvMatrix,[cubeScale-1.3, cubeScale-0.7, cubeScale-0.5]);
                    mat4.translate(mvMatrix, [cubeXPosition-4.7, (cubeYPosition -0.3)+(j*35), cubeZPosition -9.8]);
                    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
                    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
                    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
                    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, getTexture4Picking(i));
                    gl.uniform1i(shaderProgram.samplerUniform, 0);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
                    setMatrixUniforms();
                    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                    mvPopMatrix();
                    if(i<2){
                        mvPushMatrix();
                        mat4.rotate(mvMatrix, degToRad(cubeYAngle+(-60*(i+1))), [0, 1, 0]);
                        mat4.scale(mvMatrix,[cubeScale-1.3, cubeScale-0.7, cubeScale-0.5]);
                        mat4.translate(mvMatrix, [cubeXPosition-4.7, (cubeYPosition -0.3)+(j*35), cubeZPosition -9.8]);
                        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
                        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
                        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
                        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
                        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, getTexture4Picking(5-i));
                        gl.uniform1i(shaderProgram.samplerUniform, 0);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
                        setMatrixUniforms();
                        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                        mvPopMatrix();
                    }
                }
            }
            var x_in_canvas=0, y_in_canvas=0;
            if (rect.left <= lastMouseX && lastMouseX < rect.right && rect.top <= lastMouseY && lastMouseY < rect.bottom) {
                // If pressed position is inside <canvas>, check if it is above object
                x_in_canvas = lastMouseX - rect.left, y_in_canvas = rect.bottom - lastMouseY;
                }
            gl.readPixels(x_in_canvas, y_in_canvas,1 ,1, gl.RGBA, gl.UNSIGNED_BYTE, lastCapturedColourMap);
            var id = getPickingID(lastCapturedColourMap[0], lastCapturedColourMap[1], lastCapturedColourMap[2], 0);
            console.log(lastMouseX + "  " + lastMouseY);
            if(id != -1){
                //alert("Kliknjen je film z ID-jem: " + id + "<br>");
                $("#dialog").html(film_leta[id] + "<br>" + film_angNaslov[id] + "<br>" + film_genre[id] + "<br>" + film_duration[id] + "<br>" + film_country[id] + "<br>" + film_summary[id]);
                $( "#dialog" ).dialog( "open" );
            }
            console.log(lastCapturedColourMap[0] + "," + lastCapturedColourMap[1] + "," + lastCapturedColourMap[2]);
        }
        clicked = false;
    }
	
    function tick() {
        requestAnimFrame(tick);
        handleKeys();
        drawScene();
    }
    function webGLStart() {
        var canvas = document.getElementById("canvas");
        initGL(canvas);
        initShaders();
        initTextureFramebuffer();
        initBuffers();
        initTextures();
		//textTexture = createTextTexture("2013"); //letoNastanka
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        
        canvas.onmousedown = handleMouseDown;
		document.onmouseup = handleMouseUp;
		document.onmousemove = handleMouseMove;
        
        tick();
    }
    
    $("#best_control").on("mousedown", function(){
	    if ($("#best_film_table").is(":visible")){
		    $("#best_film_table").hide();
			$("#most_watched_table").hide();
			$("#best_control").css("background-image", "url('arrow_left.png')");
			$("#second_c").hide();
			$("#najvec_gledani_filmi").css("background-color", "white");
			$("#website").css("height", "100%");
	    }
	    else {
		    $("#best_film_table").show();
			$("#most_watched_table").show();
			
			$("#best_control").css("background-image", "url('arrow_down.png')");
			$("#second_c").css("background-image", "url('arrow_down.png')");
			$("#second_c").show();
			$("#najvec_gledani_filmi").css("background-color", $("#najboljse_ocenjeni_filmi").css("background-color"));
			$("#website").css("height", "925px");
	    }
    });
    
    $("#userPass").keypress(function (e) {
        if (e.which === 13) { // if is enter
	        log_in ();
		}		
	});
	
	$("#profil_menu_select").change(function() {
		var izbrano =$("#profil_menu_select").val();
		if (izbrano == "moj_profil"){
			$.ajax({
		        type: "POST",
		        url: "filmdetails.php",
		        data: 
		        {
		            method: "getRandom"
		        },
		        cache: false,
		        success: function (result) {
			        $("#nakljucni_film_table").empty();
		            $("#nakljucni_film_table").append(result);
		        },
		        error: function (result) {
			        alert(result );
		        }
		    });
		}
		else if (izbrano == "nastavitve_racuna"){
			$.ajax({
		        type: "POST",
		        url: "filmdetails.php",
		        data: 
		        {
		            method: "getUserDetails"
		        },
		        cache: false,
		        success: function (result) {
		            var data = JSON.parse(result);
		            $("#spr_ime").val(data[1]);
		            $("#spr_priimek").val(data[2]);
		            $("#spr_email").val(data[3]);
		            $("#spr_spol").val(data[4]);
		        },
		        error: function (result) {
			        alert(result );
		        }
		    });
		}
		else if (izbrano == "ogledani_filmi"){
			$.ajax({
		        type: "POST",
		        url: "filmdetails.php",
		        data: 
		        {
		            method: "getWatched"
		        },
		        cache: false,
		        success: function (result) {
			        $("#seznam_gledanih").empty();
		            $("#seznam_gledanih").append(result);
		        },
		        error: function (result) {
			        alert(result );
		        }
		    });
		}
		$( "#" + izbrano).show().siblings().hide();
	});
    
    $("#spr_shrani").click(function(){

	    $.ajax({
	        type: "POST",
	        url: "filmdetails.php",
	        data: 
	        {
	            method: "sprUser",
	            ime: $("#spr_ime").val(),
	            priimek: $("#spr_priimek").val(),
	            email: $("#spr_email").val(),
	            spol: $("#spr_spol").val()
	        },
	        cache: false,
	        success: function (result) {
	            $( "#moj_profil").show().siblings().hide();
	        },
	        error: function (result) {
		        alert(result );
	        }
	    });
    });
    
    $(document).on("mousedown", ".seznam_gledani", function (){
	    var id = $(this).attr("data-movie-ID");
	    getDetails (id, "");
    });
    
    $(document).on("mousedown", ".random_filmi", function (){
	    var id = $(this).attr("data-movie-ID");
	    getDetails (id, "");
    });
    
    $(document).on("click", "#watched_button_z", function () {
        $('#zvezdice').empty();
         var htmlZvezdice = "<table id='ocenjeno'><tr>";
        if(ocenaFilma < 0){
            htmlZvezdice += "<td id='star1'><img src='star.png' class='starIMG'/></td><td id='star2'><img src='star.png' class='starIMG'/></td><td id='star3'><img src='star.png' class='starIMG'/></td><td id='star4'><img src='star.png' class='starIMG'/></td><td id='star5'><img src='star.png' class='starIMG'/></td>";
        }else{
            for(var ii = 0;ii < ocenaFilma; ii++)
                htmlZvezdice += "<td id='star"+(ii+1)+"'><img src='color-star.png' class='starIMG'/></td>";
            for(ii;ii < 5; ii++)
                 htmlZvezdice += "<td id='star"+(ii+1)+"'><img src='star.png' class='starIMG'/></td>";
        }
        htmlZvezdice += "</tr></table>";
        $('#zvezdice').append(htmlZvezdice);
    });
    
});

function getUserData (){
	$.ajax({
        type: "POST",
        url: "filmdetails.php",
        data: 
        {
            method: "getUser"
        },
        cache: false,
        success: function (result) {
            var data = JSON.parse(result);
            $("#p_name").html(data[1] + " <span style='font-style: italic;'>(" + data[2] + ")</span>");
        },
        error: function (result) {
	        alert(result );
        }
    });
}

function getDetails (id, naslov){
    $.ajax({
        type: "POST",
        url: "filmdetails.php",
        data: 
        {
            movie_name: naslov,
            movie_id: id,
            method: "getData"
        },
        cache: false,
        success: function (result) {
            if (result != "0 results") {
                var data = JSON.parse(result);
                
                if (data[7] < 7)
					var txt1 = "<img class='thumbs' src='thumbs-down.png'/>";
				else if (data[7] > 8)
					var txt1 = "<img class='thumbs' src='thumbs-up.png'/>";
				else 
					var txt1 = "<img class='thumbs' src='thumbs-neutral.png'/>";
					
				if (data[8] < 3)
					var txt2 = "<img class='thumbs' src='thumbs-down.png'/>";
				else if (data[8] >= 4)
					var txt2 = "<img class='thumbs' src='thumbs-up.png'/>";
				else 
					var txt2 = "<img class='thumbs' src='thumbs-neutral.png'/>";
					
                $('#id_filma').val(data[9]);
                $('#slo_naslov').html(data[0]);
                $('#ang_naslov').text(data[1]);
                $('#genre').text(data[2]);
                if (data[3] !== "/") {
                    $('#duration').text(data[3]);
                }
                else 
                    $('#duration').text("");
                
                $('#summary').text(data[6]);

				$('#facebookShare').empty();
                $('#facebookShare').append("<div class='fb-share-button' data-href='http://164.8.252.141/SP/mainPage.php?id_film="+data[9]+"' data-layout='button_count'></div>");
                FB.XFBML.parse();
                $('#ocenaRT').html("<span class = 'oc_span1'>" + data[7] + "</span>");
                $('#ocenaAU').html("<span class = 'oc_span2'>" + data[8] + "</span>");
                
                if (data[10] != "-"){
                	$('#poster').attr("src", data[10]);
                	$('#poster').show();
                }
                else 
                	$('#poster').hide();
                $('#button_gledano').empty();
                $('#button_gledano').append("<table id='detailTable'><tr id='ocena_f'><td><input type='button' value='Nazaj' id='back_to_list_button'/></td><td id='zvezdice' style='text-align: left;'></td><td id='watched'></td></tr></table>");
                
                if(data[12] == 1){
                    $('#watched').empty();
                    $('#watched').append("<input type='button' value='Gledano' id='watched_button_z'/>");
                }
                ocenaFilma=data[11];
				
            }
        },
        error: function (result) {
            alert(result);
        }
    });
    
    $(' #film_profile').show().siblings().hide();
}

function oceni(ocena_f){
    var id_filma = $("#id_filma").val();
    
    $.ajax({
        type: "POST",
        url: "filmdetails.php",
        data: 
        {
            id: id_filma,
            ocena: ocena_f,
            method: "oceni"
        },
        cache: false,
        success: function (result) {
            $("#ocena_filma").hide();
            $("#watched_button").addClass("pressedB");
            $("#ocena_filma_p").hide();
            $("#watched_button_p").addClass("pressedB");
        },
        error: function (result) {
            alert(result);
        }
    });
}

function pokaziFilm (id, ime) {
		
        $.ajax({
            type: "POST",
            url: "filmdetails.php",
            data: 
            {
                movie_name: ime,
                movie_id: id,
                method: "getList"
            },
            cache: false,
            success: function (result) { 
	            
                var data = JSON.parse(result);
                $("#vpisan_film").html(data[0]);
                $('#id_filma').val(data[2]);
                $("#film_list_table").empty();
                
                $("#okvir_list").css("background-color", "#e9e9e9");
                
                if(data[1] !== "Film ni v bazi.") {
                    $("#film_list_table").append(data[1]);
                    $("#film_list_table tr.stran2").hide();
                }
                $('#button_gledano_n').empty();
                $('#button_gledano_n').append("<table id='detailTable2'><tr id='ocena_f'><td><input type='button' value='Nazaj' id='back_to_start_button'/></td><td id='zvezdice' style='text-align: left;'></td><td id='watched'></td></tr></table>");
                if(data[3] == 1){
                    $('#watched').empty();
                    $('#watched').append("<input type='button' value='Gledano' id='watched_button_z'/>");
                }
                ocenaFilma=data[4];
                
                
                
                
                id = data[2];
                //alert(data[3]);
        
		        $.ajax({
		        type: "POST",
		        url: "filmdetails.php",
		        data: 
		        {
		            movie_id: id,
		            method: "getMiniData"
		        },
		        cache: false,
		        success: function (result) {
		            
		            var data = JSON.parse(result);
		            if (data != "no") {
		                $('#slo_naslov_d').text(data[0]);
		                $('#ang_naslov_d').text(data[1]);
		                $('#genre_d').text(data[2]);
		                
		                if (data[3] === "NULL")
		                	$("#tomatoscore_d").html("-");
		                else{
							if (data[3] < 7)
								var txt1 = "/10 <img class='thumbs' src='thumbs-down.png'/>";
							else if (data[3] > 8)
								var txt1 = "/10 <img class='thumbs' src='thumbs-up.png'/>";
							else 
								var txt1 = "/10 <img class='thumbs' src='thumbs-neutral.png'/>";
							$("#tomatoscore_d").html(data[3] + txt1);
						}
							
							
						if (data[4] === "NULL")
							$("#audience_d").html("");
						else {
							if (data[4] < 3)
								var txt2 = "/5 <img class='thumbs' src='thumbs-down.png'/>";
							else if (data[4] >= 4)
								var txt2 = "/5 <img class='thumbs' src='thumbs-up.png'/>";
							else 
								var txt2 = "/5 <img class='thumbs' src='thumbs-neutral.png'/>";
							$("#audience_d").html(data[4] + txt2);
						}
							
						$("#spored_d").html(data[5]);
		            }
		        },
		        error: function (result) {
		            alert(result);
		        }
		    	});
		    	$("#next6_button").show();

            },
            error: function (result) {
                alert(result);
            }
        });
		$(' #film_list').show().siblings().hide();
	
}

function log_in (){
	
	$.ajax({
        type: "POST",
        url: "checkLogin.php",
        data: {
            U: $( "#userName" ).val(),
            Geslo: $( "#userPass" ).val(),
            operacija: "login"
        },
        success:function(data) {
            if(data==true){
                 $(' #user_profile').show().siblings().hide();
                $('a').parent('li').removeClass('active');
                $('a[href$="#user_profile"]').parent('li').addClass('active');
                location.reload();
            }
            else
                alert("Napačno geslo ali uporabniško ime");
      }
    });
}

/* source: http://lions-mark.com/jquery/scrollTo/ */

$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
};

