$(function() {

    let result='';
    let userAns = 0;
    $("#headerText").text(headerText);
    $("#instruction").css({color:headerInstructionColor});
    $('body').css({'background-image':bg});
    generateContent();
    dragDrop();

    // function for drag and drop
  function dragDrop(){

      $('.drag').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            helper: 'clone'
      });

      $(".drop" ).droppable({
            accept:".drag",
            // tolerance: 'intersect',
            drop: function(event, ui) {
             $(this).append($(ui.draggable).clone());
             if($(this).children("span").length > 1){
                $(this).children("span:nth-child(1)").remove(); 
             }
            },
      }); 

  }  //end here drag and drop 

  function generateContent(){
        // generate random numbers
        let randA = Math.ceil(Math.random() * (max - min)+1) + min;
        let randB = Math.ceil(Math.random() * (lowerMax - lowerMin)+1) + lowerMin;
        $('#firstNo').html(randA);
        $('#secNo').html(randB);
        result = randA * randB;
        // console.log(result);

        // generate drop box 
        let dropTag='';
        for(let i = 0; i<result.toString().length; i++){
           let pTag = '<p class="drop"></p>';
           dropTag  += pTag;
        }
        $('.ansContainer').html(dropTag);
  }


  $('#next').click(function(){
     $(this).hide();
     $('#check').fadeIn();
     generateContent();
     dragDrop();
  });

  $('#reload').click(function(){
    window.location.href = 'main.html';
  })

  $('#check').click(function(){
     let dropTag = $('.ansContainer p');
     let userInput = '';
     $.each(dropTag , function(i, value){
        let userData = $(value).children().text();
        userInput += userData;
     });
     // console.log(parseInt(userInput));
     let output = $('.output');
     // console.log(output)
     if(userInput == ''){
        return false;
     }
     $(this).hide();
     $('#next').fadeIn();

     if(parseInt(userInput) === result){
       // console.log(true);
        $(output[userAns]).css("background-image", "url(" + 'img/happy.png' + ")");
        userAns++;
     }else{
       // console.log(false);
        $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
        userAns++;
     }
     if(userAns > 9){
        $('#next').hide();
        $('#reload').fadeIn();
     }
  })
  
});   // end document function 
