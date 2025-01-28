// JavaScript source code
//slider section
$(document).ready(function () {
    $('.carousel').carousel();
    $('.carousel').on('slide.bs.carousel', function () {
        $('.carousel-caption h3').animate({
            marginLeft: "+=20%",
            fontSize: "1px",
            opacity: 0
        }, 50);
    })
    $('.carousel').on('slid.bs.carousel', function () {
        $('.carousel-caption h3').animate({
            marginLeft: 0,
            fontSize: "30px",
            opacity: 0.8
        }, 600);
    })
});
//--------------------------------------------------------
jQuery("document").ready(function ($) {

    var nav = $('#custom-bootstrap-menu');

    $(window).scroll(function () {
        if ($(this).scrollTop() > 120) {
            nav.addClass("f-nav");
        } else {
            nav.removeClass("f-nav");
        }
    });

});
//-------------------------------------
function checkSizeSamples(){
    var size = $(window).width();
    //-------------------------------------------------------------
    if (size > 1200)
    {
        document.getElementById('sample1').setAttribute("style", "width:400px;height:450px");
        document.getElementById('sample2').setAttribute("style", "width:400px;height:450px");
        document.getElementById('sample3').setAttribute("style", "width:400px;height:450px");
        document.getElementById('smp1').setAttribute("style", "margin-right:0px;");
        document.getElementById('smp2').setAttribute("style", "margin-right:0px;");
        document.getElementById('smp3').setAttribute("style", "margin-right:0px;");
        document.getElementById('Descript1').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript2').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript3').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript4').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript5').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript6').setAttribute("style", "width:380px;font-size:21px;");
    }
    else if (size<1200 && size>750)
    {
        document.getElementById('sample1').setAttribute("style", "width:300px;height:350px");
        document.getElementById('sample2').setAttribute("style", "width:300px;height:350px");
        document.getElementById('sample3').setAttribute("style", "width:300px;height:350px");
        document.getElementById('smp1').setAttribute("style", "margin-right:0px;");
        document.getElementById('smp2').setAttribute("style", "margin-right:0px;");
        document.getElementById('smp3').setAttribute("style", "margin-right:0px;");
        document.getElementById('Descript1').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript2').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript3').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript4').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript5').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript6').setAttribute("style", "width:380px;font-size:21px;");
    }
    else if(size<=750 && size>420) {
        document.getElementById('sample1').setAttribute("style", "width:400px;height:450px;");
        document.getElementById('sample2').setAttribute("style", "width:400px;height:450px;");
        document.getElementById('sample3').setAttribute("style", "width:400px;height:450px;");
        var margright = (size - 400) / 2;//بدست آوردن عددی برای مارجین راست، طوری که وسط بیفته
        document.getElementById('smp1').setAttribute("style", "margin-right:" + margright + "px");
        document.getElementById('smp2').setAttribute("style", "margin-right:" + margright + "px");
        document.getElementById('smp3').setAttribute("style", "margin-right:" + margright + "px");
        document.getElementById('Descript1').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript2').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript3').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript4').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript5').setAttribute("style", "width:380px;font-size:21px;");
        document.getElementById('Descript6').setAttribute("style", "width:380px;font-size:21px;");

        
    }
    else if(size<=420)
    {
        document.getElementById('sample1').setAttribute("style", "width:400px;height:450px;");
        document.getElementById('sample2').setAttribute("style", "width:400px;height:450px;");
        document.getElementById('sample3').setAttribute("style", "width:400px;height:450px;");
        var margright = (size - 400) / 2;//بدست آوردن عددی برای مارجین راست، طوری که وسط بیفته
        document.getElementById('smp1').setAttribute("style", "margin-right:" + margright + "px");
        document.getElementById('smp2').setAttribute("style", "margin-right:" + margright + "px");
        document.getElementById('smp3').setAttribute("style", "margin-right:" + margright + "px");
        document.getElementById('Descript1').setAttribute("style", "width:300px;font-size:15px;");
        document.getElementById('Descript2').setAttribute("style", "width:300px;font-size:15px;");
        document.getElementById('Descript3').setAttribute("style", "width:300px;font-size:15px;");
        document.getElementById('Descript4').setAttribute("style", "width:300px;font-size:15px;");
        document.getElementById('Descript5').setAttribute("style", "width:300px;font-size:15px;");
        document.getElementById('Descript6').setAttribute("style", "width:300px;font-size:15px;");

    }
    //----------------------------------------------------------
    
};
window.onresize = checkSizeSamples;
window.onload = checkSizeSamples;
