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
            $.ajax({
                type: "POST",
                url: "filmdetails.php",
                data: "rfsdfsdf",
                cache: false,
                success: function (result) {
                   	alert(result);
                    var data = eval(result);
	                	$('#slo_naslov').val(data[0]);
	                	$('#ang_naslov').val(data[1]);
	                	$('#genre').val(data[2]);
	                	$('#duration').val(data[3]);
	                	$('#year').val(data[4]);
	                	$('#country').val(data[5]);
	                	$('#summary').val(data[6]);
	               
                },
                error: function (result) {
                    alert(result);
                }
            });
            
            $('.tabs #film_profile').show().siblings().hide();
        }
    });
    
});

