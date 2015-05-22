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
            alert(result);
            $("#best_film_table").empty();

            if(result !== "Ni podatka") {
                $("#best_film_table").append(result);
            }
        },
        error: function (result) {
            alert(result);
        }
    });
    
    $('.tabs .tab-links a').on('click', function (e) {
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
        }
        else
        {
            // Show/Hide Tabs
            $('.tabs ' + currentAttrValue).show().siblings().hide();

            // Change/remove current tab to active
            $(this).parent('li').addClass('active').siblings().removeClass('active');
        }
        e.preventDefault();
    });
    
    $('.search-opt a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');
        
        if ($('.search-opt ' + currentAttrValue).hasClass('active') === false) {
            $('.search-opt ' + currentAttrValue).addClass('active');
            $('.search-opt ' + currentAttrValue).parent('li').toggleClass('active');
        } else {
            $('.search-opt ' + currentAttrValue).removeClass('active');
            $('.search-opt ' + currentAttrValue).parent('li').toggleClass('active');
        }
        
        e.preventDefault();
    });
    
    $(document).delegate('input:text', 'keypress', function (e) {
        if (e.which === 13) { // if is enter
            var text = $('#movieSearchBox').val();
            $.ajax({
                type: "POST",
                url: "filmdetails.php",
                data: 
                {
                    movie_name: text,
                    method: "getList"
                },
                cache: false,
                success: function (result) { 
                    var data = JSON.parse(result);
                    $("#vpisan_film").html(data[0]);
                    
                    $("#film_list_table").empty();
                    
                    if(data[1] !== "Film ni v bazi.") {
                        $("#film_list_table").append(data[1]);
                    }
                },
                error: function (result) {
                    alert(result);
                }
            });
            
            $('.tabs #film_list').show().siblings().hide();
        }
    });
    
    $("#back_to_list_button").click(function () {
        $('.tabs #film_list').show().siblings().hide();
    });
    
    $("#back_to_start_button").click(function () {
        $('.tabs #main').show().siblings().hide();
    });
    
    $(document).on("mousedown", "td.filmi", function() {
        var id = $(this).attr("data-movie-ID");
        $("#watched_button").removeClass("pressedB");
        getDetails(id);
    });
    
    $("#back_to_genre_button").click(function () {
        $('.tabs #main').show().siblings().hide();
		$('input').prop('checked', false);
    });
	
	$("#back_to_genre").click(function () {
        $('.tabs #filmi_list').show().siblings().hide();
    });
	
	$("#back_to_list_button1").click(function () {
        $('.tabs #film_prikaz').show().siblings().hide();
    });
	
	$(document).on("click", "td.film", function() {
        var naslov_filma = $(this).text();
        //alert(naslov_filma);
		$.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
                    movie_name: naslov_filma,
                    method: "getFilm"
                },
                cache: false,
                success: function (result) 
				{
					//alert(result);
                    var data = JSON.parse(result);
                    $("#prikaz").html(data[0]);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
			
		$('.tabs #film_prikaz').show().siblings().hide();
    });
	
	$(document).on("click", "td.f", function() {
        var naslovFilm = $(this).text();
        //alert(naslovFilm);
        getDetails1(naslovFilm);
    });
	
	$(document).on("click", "h4.z", function() {
        var zanr = $(this).text().substring(0, 4);
        //alert(zanr);
		$.ajax({
                type: "POST",
                url: "connDatabase.php",
                data: 
                {
                    genre_movie: zanr,
                    method: "getZanrFilm"
                },
                cache: false,
                success: function (result) 
				{
					//alert(result);
                    var data = JSON.parse(result);
                    //$("#prikaz").html(data[0]);
                    
                    $("#film_prikaz_table").empty();
                    
                    if(data[0] !== "Ni podatkov!") 
					{
                        $("#film_prikaz_table").append(data[0]);
                    }
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
			
		$('.tabs #film_prikaz').show().siblings().hide();
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
					//alert(result);
                    $("#filmi").html(result);
                },
                error: function (result) 
				{
                    alert(result);
                }
            });
        
		$('.tabs #filmi_list').show().siblings().hide();
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
                $('.tabs #login').show().siblings().hide();
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
                     $('.tabs #user_profile').show().siblings().hide();
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
    
    $("#watched_button").click(function() {
        $("#ocena_filma").show();
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
    
});

function getDetails (naslov){
    $.ajax({
        type: "POST",
        url: "filmdetails.php",
        data: 
        {
            movie_name: naslov,
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

                $('#ocena').html("Ocena kritikov: " + data[7] + "/10<br>Ocena gledalcev: " + data[8] + "/5");
            }
        },
        error: function (result) {
            alert(result);
        }
    });
    
    $('.tabs #film_profile').show().siblings().hide();
}

function getDetails1(naslov1){
    $.ajax({
        type: "POST",
        url: "connDatabase.php",
        data: 
        {
            movie_name: naslov1,
            method: "getData"
        },
        cache: false,
        success: function (result) 
		{
            if (result != "Ni podatkov!") 
			{
                var data = JSON.parse(result);
				
                $('#slo_naslov1').text(data[0]);
                $('#ang_naslov1').text(data[1]);
                $('#genre1').text(data[2]);
                
				if (data[3] !== "/") 
				{
                    $('#duration1').text("Dolžina: " + data[3]);
                }
                
				else 
                    $('#duration1').text("");
                
				if (data[4] !== "/") 
				{
                    $('#year1').text("Leto: " + data[4]);
                }
                
				else 
                    $('#year1').text("");
                
				if (data[5] !== "/") 
				{
                    $('#country1').text("Država: " + data[5]);
                }
                
				else 
                    $('#country1').text("");
                
				$('#summary1').text(data[6]);
				$('#ocena1').html("Ocena kritikov: " + data[7] + "/10<br>Ocena gledalcev: " + data[8] + "/5");
            }
        },
        error: function (result) 
		{
            alert(result);
        }
    });
    
    $('.tabs #film_profile1').show().siblings().hide();
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
        },
        error: function (result) {
            alert(result);
        }
    });
}
