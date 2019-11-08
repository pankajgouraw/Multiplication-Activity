$(function() {

    let result = '';
    let userAns = 0;
    var chance = 0;

    let trueLength = 0;

    $("#headerText").text(headerText);
    $("#instruction").css({color: headerInstructionColor});
    $('.carryContainer .dragCarry').css({'color':carryColor})
    $('body').css({'background-image': bg});
    $('#firstNo, #secNo, .sign').css({color: questColor});
    $('.options p span').css({color: numColor});

    generateContent();
    dragDrop();
    dragCarry();


    // function for drag and drop
    function dragDrop() {

        $('.drag').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            helper: 'clone'
        });

        $(".drop").droppable({
            accept: ".drag",
            // tolerance: 'intersect',
            drop: function(event, ui) {
                $(this).append($(ui.draggable).clone().css({
                    color: ansColor
                }));

                $(event.target).attr('data-user',ui.draggable.text());
                console.log(event.target)

                if ($(this).children("span").length > 1) {
                    $(this).children("span:nth-child(1)").remove();
                }
            }
        });

    } //end here drag and drop 

    // drag carry value
    function dragCarry() {
        $('.dragCarry').draggable({
            revert: 'invalid',
            helper:'clone'
        })

        $('.carryDropContainer').droppable({
            accept: '.dragCarry',
            drop: function(event, ui) {
                $(this).append($(ui.draggable).clone());
                if ($(this).children("span").length > 1) {
                    $(this).children("span:nth-child(1)").remove();
                }
                $('#clearCarry').show();
            }
        })
    } // end function drag carry
 


    // generate multiplication quiz question
    function generateContent() {
        $('.randBox').remove();
        // generate random numbers
       let randA = Math.ceil(Math.random() * (maxA - minA) + 1) + minA;
       let randB = Math.ceil(Math.random() * (maxB - minB) + 1) + minB;       

        // let randA = 120
        // let randB = 120

        // convert random number into array
        carryRandA = Array.from(randA.toString(), Number);
        carryRandB = Array.from(randB.toString(), Number);

        //generate span tag for numbers
        carrySpanA = '';
        carrySpanB = '';


        //add span tag to the number
        $.each(carryRandA, function(i, value) {
            var spanA = `<span>${value}</span>`
            carrySpanA += spanA;
        });

        // add span tag to second number
        $.each(carryRandB, function(i, value) {
            var spanB = `<span>${value}</span>`
            carrySpanB += spanB;
        });


        $('#firstNo').html(carrySpanA);
        $('#secNo').html(carrySpanB);

        // append carried value
        result = randA * randB;
        
       // create drop container for carry
        for(let i=carryRandA.length-1; i>=0; i--){
          let sum =  carryRandA[i] + carryRandB[i];
            let x =$('#firstNo span')[i];
            $(x).append(`<span class='carryDropContainer'></span>`);
        }

        // generate drop box for ans container
        let dropTag = '';
        $.each(Array.from(result.toString(),Number), function(index, value){
                let pTag = `<p class="drop" data-original="${value}" data-user=' '></p>`;
                dropTag += pTag;
        })
        $('.ans').html(dropTag);


        // generate multiple box for multiple row
        for (let index = 0; index < carryRandB.length; index++) {
            let innerPTag = ''
            let generateBox = '';
            let singleBox = randA * carryRandB[index];
            console.log('multiply with each number', singleBox)
            if (singleBox == 0) {
                // generate multiple zero 
                let = zeroInString = '';
                $.each(Array.from(randA.toString(), Number), function(index,value){
                  let numZero = "0";
                   zeroInString += numZero;
                })
                singleBox=zeroInString;
            }

            singleBox = Array.from(singleBox.toString(), Number);
            $.each(singleBox, function(index,value){
                let pTag = `<p class="drop" data-original="${value}" data-user=' '></p>`;
                innerPTag += pTag;
            })

            if (index == carryRandB.length - 1) {
                generateBox = `<div class='ansContainer randBox'>${innerPTag}</div>`;
            } else {
                generateBox = `<div class='ansContainer marginRight randBox'>${innerPTag}</div>`;
            }
            $('.generateBox').prepend(generateBox);

        } // end for loop for multiple box

        // generate boxes for zero at end position
        let marginRight = $('.marginRight');
        let zeroPTag ='';
        let zeroIndex = 1;
        $.each(marginRight, function(index, value) {
             for(var i=0; i < zeroIndex; i++){
                let ZeroTag = '<p class="drop" data-original="0" data-user=" "></p>';
                zeroPTag += ZeroTag;
                // console.log('zeroIndex inside the loop', zeroIndex)
             }
             zeroIndex++;
             // console.log('zeroIndex',zeroIndex)
             $(value).append(zeroPTag);
             zeroPTag = '';
        }) // generate boxes for zero end

    } // end generate multiplication quiz function



    // next test function
    $('#next').click(function() {
        chance = 0;
        $(this).hide();
        $('#check').fadeIn();
        $('#showAns').hide();
        $('.dragCarry').removeAttr('style');
        generateContent();
        dragDrop();
        $('#firstNo > span > span').hide();
    }) // end next function



    $('#reload').click(function() {
        window.location.href = 'main.html';
    })



    // check the answer is correct or not

    $('#check').click(function() {
        // console.log('chance', chance)
        let dropTag = $('.ans p');
        let userInput = '';
        $.each(dropTag, function(i, value) {
            let userData = $(value).children().text();
            userInput += userData;
        });
        // console.log(parseInt(userInput));
        let output = $('.output');
        // console.log(output)
        if (userInput == '') {
            return false;
        }
        $(this).show();
        // $('#next').fadeIn();


        if (parseInt(userInput) === result) {
            // console.log(true);
            wellDone();
            $(output[userAns]).css("background-image", "url(" + 'img/happy.png' + ")");
            $('#next').show();
            $('#check').hide();
            chance = 0;
            userAns++;
        } else {

            if (chance == 0) {
                oopsTryAgain();
                $('#reset').show();
                showError()
                chance++;
                return false;
            }else{
              $('#reset').hide();
            }
            showError();
            // $('#reset').show();
            $(this).hide();
            $('#showAns').show();
            $('#next').show();
            $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
            userAns++;
        }

        if (userAns > 9) {
            $('#next').hide();
            $('#reload').fadeIn();
        }
    }) // end check answer function



    // try again message
    function oopsTryAgain() {
        $('.oops').removeClass('zoomOut');
        $('.oops').addClass('animated zoomIn oopsHW');

        setTimeout(function() {
            $('.oops').removeClass('zoomIn');
            $('.oops').addClass('zoomOut')
            setTimeout(function() {
                $('.oops').removeClass('oopsHW');
            }, 500);
        }, 2000)
    } // end try again function


    // well done message
    function wellDone() {
        $('.wellDone').removeClass('zoomOut');
        $('.wellDone').addClass('animated zoomIn oopsHW');
        setTimeout(function() {
            $('.wellDone').removeClass('zoomIn');
            $('.wellDone').addClass('zoomOut')
            setTimeout(function() {
                $('.wellDone').removeClass('oopsHW');
            }, 500);
        }, 2000)
    };

    // end well done function


    //show the correct answer
    $('#showAns').click(function() {
        // generate answer
        $(this).hide();
        $('#reset').hide();
        // $('#firstNo > span > span').show();
        let dropTag = '';
        let ansArray = Array.from(result.toString(), Number);
        for (let i = 0; i < ansArray.length; i++) {
            let pTag = `<p class="drop"><span style='color:${ansColor}'>${ansArray[i]}</span></p>`;
            dropTag += pTag;
        }
        $('.ans').html(dropTag);
    }) //end show answer function


// clear carry function
$('#clearCarry').click(function(){
  $('.carryDropContainer').empty();
  $(this).hide();
});
// end clear carry function


// reset all user input
$('#reset').click(function(){
  $('.drop').empty();
  $(this).hide();
  $('.drop').css({'borderColor':'#fff'})
}) // end all user input field

//function to show error

function showError(){
  let dataAttr = $('.drop');
  $.each(dataAttr, function(index, value){
    let dataUser = $(value).attr('data-user');
    let dataOriginal = $(value).attr('data-original');
    if(dataUser == dataOriginal){
    }else{
      $(value).css({'borderColor':errorColor})
    }
  })
}

}); // end document ready function 