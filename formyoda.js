
var formyoda = {};

formyoda.validation = {};

formyoda.validation.errors = {blank : 'Please fill out this field', email : 'Invalid Email'};

formyoda.validation.blank = function(input){
  if($(input).val() == ''){
      $(input + '_yodalay').val(formyoda.validation.errors.blank);
      return false;
  }
  return true;
}

formyoda.validation.email = function(input){
  var email = $(input).val();
  var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
  if(!regex.test(email)){
    $(input).val('');
    $(input + '_yodalay').val(formyoda.validation.errors.email);
    return  false;
  }
  return true;
}

formyoda.validate = function(inputs){

  errors = false;

  for(propName in inputs){
          
    var id = '#' + propName;
        
    for(validateMethod in inputs[propName]){
        if(!formyoda.validation[inputs[propName][validateMethod]](id)){
          errors = true;
          break;
          }
    }
  }
        if(errors)
          return false;
        else
          return true;
}

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

$(document).ready(function(){
    
    formyoda.add_yodalayers({'username' : 'username...', 'mail' : 'email...'})
    var validation = { 'username' : ['blank'],  'mail': ['blank', 'email'] };
        
    $('form').submit(function(){
        
        if(!formyoda.validate(validation))
          return false;
        
        })
});


	
	
