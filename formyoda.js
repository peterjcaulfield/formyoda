// Dependencies: JQuery
if(document.readyState === "complete") {
  if(typeof JQuery === 'undefined')
    alert('JQuery is required for yodaforms to work');
}

var formyoda = {};
formyoda.labels = {inline : false};
formyoda.validation = {};
formyoda.validation.errors = {blank : 'Please fill out this field', email : 'Invalid Email'};

formyoda.validation.blank = function(input){
  if($(input).val() == ''){
      if(formyoda.labels.inline == true){
        console.log('here');
        $(input + '_yodalay').html(formyoda.validation.errors.blank);
      }
      else
        $(input + '_yodalay').val(formyoda.validation.errors.blank);
        $(input + '_yodalay').addClass('error');
      return false;
  }
  return true;
}

formyoda.validation.email = function(input){
  var email = $(input).val();
  var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
  if(!regex.test(email)){
    $(input).val('');
    if(formyoda.labels.inline == true){
      console.log('here');
      $(input + '_yodalay').html(formyoda.validation.errors.blank);
    }
    else
      $(input + '_yodalay').val(formyoda.validation.errors.email);
      $(input + '_yodalay').addClass('error');
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

formyoda.add_yodalabels = function(inputs){

  formyoda.yodalabels = inputs;

  for(var propName in inputs){
    
    var id = '#' + propName;
    var yodaid = propName + '_yodalay';
    
    if(formyoda.labels.inline == false){
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
            if($('#' +  elem_id + '_yodalay').hasClass('error')){
                $('#' +  elem_id + '_yodalay').removeClass('error');
               }
         });

      $(id).blur(function(){
           var  elem_id = $(this).attr('id');
            if($(this).val() == '')    
              $('#' +  elem_id + '_yodalay').val(formyoda.yodalabels[elem_id]);
        });
      
   
    }else
    {
     
      $(id).parent().css({'position': 'relative'});
      var topPos = $(id).position().top;
      var leftPos = ($(id).width() + 20);
      $(id).parent().css({'position': 'relative'});
      $(id).parent().append('<div id="' + yodaid + '"></div>');
      $('#' + yodaid).html(inputs[propName]);
      $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'border' : 'none'});

      $(id).focus(function(){
            var  elem_id = $(this).attr('id');
            if($('#' + elem_id + '_yodalay').hasClass('error'))
            $('#' + elem_id + '_yodalay').removeClass('error');
            $('#' +  elem_id + '_yodalay').html(formyoda.yodalabels[elem_id]);
        });
    
      $(id).blur(function(){
        });
    }
  } // end of loop
} // end of add function

$(document).ready(function(){
   
    formyoda.labels.inline = true;
    formyoda.add_yodalabels({'username' : 'username...', 'mail' : 'email...'})
    var validation = { 'username' : ['blank'],  'mail': ['blank', 'email'] };
        
    $('form').submit(function(){
        
        if(!formyoda.validate(validation))
          return false;
        
        })
});


	
	
