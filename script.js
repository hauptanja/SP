/*global $, jQuery, alert*/
$(document).ready(function () {
    "use strict";
    
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

            if(result !== "Ni podatka") {
                $("#best_film_table").append(result);
            }
           
        },
        error: function (result) {
            alert(result);
        }
    });
    
    $.ajax({
        type: "POST",
        url: "filmdetails.php",
        data: 
        {
            method: "getMostWatched"
        },
        cache: false,
        success: function (result) {
            $("#most_watched_table").empty();

            if(result !== "Ni podatka") {
                $("#most_watched_table").append(result);
            }
           
        },
        error: function (result) {
            alert(result);
        }
    });
    
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
            	$("#najboljse_ocenjeni_filmi").hide();
            	$("#najvec_gledani_filmi").hide();
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
        $('body').scrollTo(currentAttrValue);
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
	                var data = JSON.parse(result);
	                $(".opcije_ul").empty();
	                    	
                	for (var i in data)
                	{
                    	$(".opcije_ul").append(data[i]);
                	}
                },
                error: function (result) {
                    alert(result);
                }
            });
            
            $('#opcije_list').show().siblings().hide();
            
        }
    });
    
    $("#back_to_list_button").click(function () {
        
        if ($("#film_list_table tbody").children().length == 0)
        	$('#main').show().siblings().hide();
        else 
        	$('#film_list').show().siblings().hide();
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
    });
    
    $("#back_to_start_button").click(function () {
        $('#main').show().siblings().hide();
        $("#ocena_filma").hide();
        $("#ocena_filma_p").hide();
        $('input').prop('checked', false);
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
    });
    
    $("#ocena_filma").hide();
    $("#ocena_filma_p").hide();
    
    $("#watched_button").click(function() {
        $("#ocena_filma").show();
    });
    
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
                
				if (data[3] < 7)
					var txt1 = "/10 <img class='thumbs' src='thumbs-down.png'/>";
				else if (data[3] > 8)
					var txt1 = "/10 <img class='thumbs' src='thumbs-up.png'/>";
				else 
					var txt1 = "/10 <img class='thumbs' src='thumbs-neutral.png'/>";
				$("#tomatoscore_d").html(data[3] + txt1);
				
				if (data[4] < 3)
					var txt2 = "/5 <img class='thumbs' src='thumbs-down.png'/>";
				else if (data[4] >= 4)
					var txt2 = "/5 <img class='thumbs' src='thumbs-up.png'/>";
				else 
					var txt2 = "/5 <img class='thumbs' src='thumbs-neutral.png'/>";
				$("#audience_d").html(data[4] + txt2);
				
				$("#spored_d").html(data[5]);
            }
        },
        error: function (result) {
            alert(result);
        }
    	});
    
    });
    
});

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
                $('#id_filma').val(data[9]);
                $('#slo_naslov').text(data[0]);
                $('#ang_naslov').text(data[1]);
                $('#genre').text(data[2]);
                if (data[3] !== "/") {
                    $('#duration').text("Dolžina: " + data[3]);
                }
                else 
                    $('#duration').text("");
                if (data[4] !== "/") {
                    $('#year').text("Leto: " + data[4]);
                }
                else 
                    $('#year').text("");
                if (data[5] !== "/") {
                    $('#country').text("Država: " + data[5]);
                }
                else 
                    $('#country').text("");
                $('#summary').text(data[6]);
                
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
                $('#ocena').html("Ocena kritikov: " + data[7] + "/10 " + txt1 + "<br>Ocena gledalcev: " + data[8] +"/5 "+ txt2);
                if (data[10] != "-"){
                	$('#poster').attr("src", data[10]);
                	$('#poster').show();
                }
                else 
                	$('#poster').hide();
                $('#sporedKino').html("<h4>Predvajano v kinu</h4>");
                $('#sporedKino').append("<table id='kinoSpored'>");
                $('#sporedKino').append("<tr><th>Datum</th><th>Kraj</th><th>Čas</th><th>Dvorana</th></tr>");
                var velikost=data[11];
                var s=12;
                while (s <= velikost){
                    $('#sporedKino').append("<tr><td>" + data[s+2] + "</td><td>" + data[s+3] + "</td><td>" + data[s] + "</td><td>" + data[s+1] + "</td></tr>");
                    s=s+4;
                }
                $('#sporedKino').append("</table>");
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
                
                if(data[1] !== "Film ni v bazi.") {
                    $("#film_list_table").append(data[1]);
                }
            },
            error: function (result) {
                alert(result);
            }
        });
		$(' #film_list').show().siblings().hide();
	
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
}
