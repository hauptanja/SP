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
            var text = $('#movieSearchBox').text();
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
                    $("#film_list_table").empty();
                    $("#film_list_table").append("<tr><th></th><th>Naslov filma</th><th>Ocena kritikov</th><th>Ocena gledalcev</th></tr>");
                    $("#film_list_table").append(result);
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
    
    $(document).on("mousedown", "tr.filmi", function() {
        var naslov = $(this).children('td.naslovFilma').text();
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
                    var data = eval(result);
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
                },
                error: function (result) {
                    alert(result);
                }
            });
            
            $('.tabs #film_profile').show().siblings().hide();
    });
    
});