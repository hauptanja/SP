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
    
    $(document).on("click", ".search-result-opt li", function() {
	    var id = $(this).attr("id"); 
        pokaziFilm (id, "");
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
	                $(".opcije_ul").empty();
	                    	
					$(".opcije_ul").append(result);
                	
                },
                error: function (result) {
                    alert(result);
                }
            });
            
            $('#opcije_list').show().siblings().hide();
            
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
		var naslov = $(this).text().replace(/F.+|.\.\d+.[\d+]|..\d+[\d+]*$/g, '');
		//alert(naslov);
        $("#watched_button").removeClass("pressedB");
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
        
		getDetails(id, "");
			
		$.ajax({
	        type: "POST",
	        url: "connDatabase.php",
	        data: 
	        {
	            film: naslov,
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
	                    film: naslov,
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
	
	$(document).on("click", "input.categories", function() {
		var kategorija = $(this).next('label').text().substring(0, 4);
		//alert(kategorija);
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
    
    $("#best_control").on("mousedown", function(){
	    if ($("#best_film_table").is(":visible")){
		    $("#best_film_table").hide();
			$("#most_watched_table").hide();
			$("#best_control").css("background-image", "url('arrow_left.png')");
			$("#second_c").hide();
			$("#najvec_gledani_filmi").css("background-color", "white");
	    }
	    else {
		    $("#best_film_table").show();
			$("#most_watched_table").show();
			
			$("#best_control").css("background-image", "url('arrow_down.png')");
			$("#second_c").css("background-image", "url('arrow_down.png')");
			$("#second_c").show();
			$("#najvec_gledani_filmi").css("background-color", $("#najboljse_ocenjeni_filmi").css("background-color"));
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
                $('#slo_naslov').html(data[0] + " (" + txt1 + " / " + txt2+ ")");
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
                $('#button_gledano').append("<table><tr id='ocena_f'><tr><td><input type='button' value='Nazaj' id='back_to_list_button'/></td><td id='zvezdice' style='text-align: left;'></td><td id='watched'></td></tr></table>");
                 if(data[12] == 1){
                    $('#watched').empty();
                    $('#watched').append("<input type='button' value='Gledano' id='watched_button_z'/>");
                }
                ocenaFilma=data[11];
                $("#watched_button_z").click(function() {

                    $('#zvezdice').empty();
                     var htmlZvezdice = "<table id='ocenjeno'><tr>";
                    if(ocenaFilma < 0){
                        htmlZvezdice += "<td id='star1'><img src='star.png' class='starIMG'/></td><td id='star2'><img src='star.png' class='starIMG'/></td><td id='star3'><img src='star.png' class='starIMG'/></td><td id='star4'><img src='star.png' class='starIMG'/></td><td id='star5'><img src='star.png' class='starIMG'/></td>";
                    }else{
                        for(ii = 0;ii < ocenaFilma; ii++)
                            htmlZvezdice += "<td id='star"+(ii+1)+"'><img src='color-star.png' class='starIMG'/></td>";
                        for(ii;ii < 5; ii++)
                             htmlZvezdice += "<td id='star"+(ii+1)+"'><img src='star.png' class='starIMG'/></td>";
                    }
                    htmlZvezdice += "</tr></table>";
                    $('#zvezdice').append(htmlZvezdice);
                });
                
                $('#sporedKino').html("<h4>PREDVAJANO V KINU</h4>");
                var velikost=data[13];
                if(velikost > 13){
                    $('#sporedKino').append("<table id='kinoSpored'>");
                    $('#sporedKino').append("<tr><th class='centerK'>Čas</th><th class='centerK'>Dvorana</th><th class='centerK'>Datum</th><th class='centerK'>Kraj</th></tr>");
                    var s=14;
                    while (s <= velikost){
                        $('#sporedKino').append("<tr><td class='centerK'>" + data[s] + "</td><td class='centerK'>" + data[s+1] + "</td><td class='centerK'>" + data[s+2] + "</td><td class='centerK'>" + data[s+3] + "</td></tr>");
                        s=s+4;
                    }
                    $('#sporedKino').append("</table>");
                }
                else{
                     $('#sporedKino').append("<h5>Film se ne predvaja v kinu!</h5>");
                }
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
                $('#button_gledano_n').append("<table><tr id='ocena_f'><tr><td><input type='button' value='Nazaj' id='back_to_start_button'/></td><td id='zvezdice' style='text-align: left;'></td><td id='watched'></td></tr></table>");
                if(data[3] == 1){
                    $('#watched').empty();
                    $('#watched').append("<input type='button' value='Gledano' id='watched_button_z'/>");
                }
                ocenaFilma=data[4];
                $("#watched_button_z").click(function() {
                    $('#zvezdice').empty();
                     var htmlZvezdice = "<table id='ocenjeno'><tr>";
                    if(ocenaFilma < 0){
                        htmlZvezdice += "<td id='star1'><img src='star.png' class='starIMG'/></td><td id='star2'><img src='star.png' class='starIMG'/></td><td id='star3'><img src='star.png' class='starIMG'/></td><td id='star4'><img src='star.png' class='starIMG'/></td><td id='star5'><img src='star.png' class='starIMG'/></td>";
                    }else{
                        for(ii = 0;ii < ocenaFilma; ii++)
                            htmlZvezdice += "<td id='star"+(ii+1)+"'><img src='color-star.png' class='starIMG'/></td>";
                        for(ii;ii < 5; ii++)
                             htmlZvezdice += "<td id='star"+(ii+1)+"'><img src='star.png' class='starIMG'/></td>";
                    }
                    htmlZvezdice += "</tr></table>";
                    $('#zvezdice').append(htmlZvezdice);
                });
                
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

