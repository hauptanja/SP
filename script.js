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
                data: text,
                cache: false,
                success: function (result) {
                    var data = eval(result);
                    $('#slo_naslov').text(data[0]);
                    $('#ang_naslov').text(data[1]);
                    $('#genre').text(data[2]);
                    if (data[3] !== null) {
                        $('#duration').text("Dolžina: " + data[3]);
                    }
                    if (data[4] !== null) {
                        $('#year').text("Leto: " + data[4]);
                    }
                    if (data[5] !== null) {
                        $('#country').text("Država: " + data[5]);
                    }
                    $('#summary').text(data[6]);
                },
                error: function (result) {
                    alert(result);
                }
            });
            
            $('.tabs #film_profile').show().siblings().hide();
        }
    });
    
    $("#back_to_list_button").click(function () {
        window.location.href="http://164.8.252.141/SP/mainPage.php";
    });
    
});

