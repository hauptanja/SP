/*global $, jQuery, alert*/
$(document).ready(function () {
    "use strict";
    $('.tabs .tab-links a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');
 
        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
 
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
                    var data = eval(result);
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
        var naslov = $(this).text();
        alert(naslov);
        getDetails(naslov);
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
                alert(result);
                var data = JSON.parse(result);
                alert(data);
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
            alert("error" + result);
        }
    });
    
    $('.tabs #film_profile').show().siblings().hide();
}