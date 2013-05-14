
var formyoda = {};

formyoda.validation.blank = function(input){
  if($(input).val() == ''){
      $(input + '_yodalay').val(formyoda.validation.errors.blank);
      return false;
  }
}

formyoda.validation.email = function(input){
  console.log(input);
  return false;
}

formyoda.validate = function(inputs){

  $('form').submit(function(){
        
        for(propName in inputs){
          
          var error = false;
          var id = '#' + propName;
        
          for(validateMethod in inputs[propName]){
           if(!formyoda[inputs[propName][validateMethod]](id));
              break;
          }
        }
        return false;
      })
};

formyoda.validation.errors = {blank : 'Please fill out this field', email : 'Invalid Email'};

formyoda.add_yodalayers = function(inputs){

  formyoda.yodalayers = inputs;

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
            var elem_id = $(this).attr('id');
            if($(this).val() == '')      
              $('#' +  elem_id + '_yodalay').val('');
         });

    $(id).blur(function(){
           var  elem_id = $(this).attr('id');
            if($(this).val() == '')    
              $('#' +  elem_id + '_yodalay').val(formyoda.yodalayers[elem_id]);
        });

  } // end of loop

} // end of add function

/*$(document).ready(function(){
    
    formyoda.add_yodalayers({'username' : 'username...', 'mail' : 'email...'})
    formyoda.validate( { 'username' : ['blank'],  'mail': ['blank', 'email'] } );
  
});*/


	
	
