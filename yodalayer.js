
var yodalayer = {};

yodalayer.add = function(inputs){

  yodalayer.yodalayers = inputs;

  for(var propName in inputs){
    
    var id = '#' + propName;
    var yodaid = propName + '_yodalay';
    // this allows us to get the relative position of the inputs
    $(id).parent().css({'position': 'relative'});
    
    var topPos = $(id).position().top;
    var leftPos = $(id).position().left;

    $(id).css({'z-index' : 10, 'position' : 'relative',  'background' : 'none'});
    $(id).parent().append('<input id="' + yodaid + '"/>');
    $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'z-index': 0});

    // set initial input value
    $('#' + yodaid).val(inputs[propName]);
  
    // bind to input focus and blur
    $(id).focus(function(){
            elem_id = $(this).attr('id');
            if($(this).val() == '')      
              $('#' +  elem_id + '_yodalay').val('');
         });

    $(id).blur(function(){
            elem_id = $(this).attr('id');
            if($(this).val() == '')    
              $('#' +  elem_id + '_yodalay').val(yodalayer.yodalayers[elem_id]);
        });

  } // end of loop

} // end of add function


	
	
