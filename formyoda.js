// Dependencies: JQuery
if(document.readyState === "complete") {
  if(typeof JQuery === 'undefined')
    alert('JQuery is required for formyoda to work');
}
// constuctor
function Formyoda(){
  /*
  * Initialisation
  */
  // get reference to this for when we are nested and need ref to parent
  var that = this;
  // defaults to labels behind inputs
  this.labels = {inline : false};
  // validation initialization
  this.validation = {};
  // error messages for each validation function
  this.validation.errors = {
                             blank : 'Please fill out this field',
                             email : 'Invalid Email',
                             maxchars : 'Too many characters',
                             minchars : 'Too few characters',
                             numeric : 'Must be a number',
                             format : 'Invalid format'
                                                        };
  this.validation.unique_errors = {};

  /*
  * Validation functions
  */
  this.validation.blank = function(id, error){
    if($(id).val() == ''){
        if(error != 'default')
           $(id + '_yodalabel .yodalabel').html(error);
        else   
          $(id + '_yodalabel .yodalabel').html(that.validation.errors.blank);
        $(id + '_yodalabel .yodalabel').addClass('error');
        return false;
    }
    return true;
  }

  this.validation.email = function(id, error){
    var email = $(id).val();
    var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    if(!regex.test(email)){
      $(id).val('');
      if(error != 'default')
           $(id + '_yodalabel .yodalabel').html(error);
      else   
        $(id + '_yodalabel .yodalabel').html(that.validation.errors.email);
      $(id + '_yodalabel .yodalabel').addClass('error');
      return  false;
    }
    return true;
  }

  this.validation.max = function(id, error, max){
    if($(id).val().length > max){
      $(id).val('');
      if(error != 'default')
           $(id + '_yodalabel .yodalabel').html(error);
      else   
        $(id + '_yodalabel .yodalabel').html(that.validation.errors.maxchars);
      $(id + '_yodalabel .yodalabel').addClass('error');
      return false;
    }
    return true;
  }

  this.validation.min = function(id, error, min){
    if($(id).val().length < min){
      $(id).val('');
      if(error != 'default')
           $(id + '_yodalabel .yodalabel').html(error);
      else   
        $(id + '_yodalabel .yodalabel').html(that.validation.errors.minchars);
      $(id + '_yodalabel .yodalabel').addClass('error');
      return false;
    }
    return true;
  }

  this.validation.numeric = function(id, error){
    if(typeof $(id).val() != 'number'){
      $(id).val('');
      if(error != 'default')
           $(id + '_yodalabel .yodalabel').html(error);
      else   
        $(id + '_yodalabel .yodalabel').html(that.validation.errors.numeric);
      $(id + '_yodalabel .yodalabel').addClass('error');
      return false;
    }
    return true
  }

  this.validation.format = function(id, error, regex){
    if(!regex.test($(input).val())){
      $(id).val('');
      if(error != 'default')
        $(id + '_yodalabel .yodalabel').html(error);
      else   
        $(id + '_yodalabel .yodalabel').html(that.validation.errors.format);
      $(id + '_yodalabel .yodalabel').addClass('error');
      return false;
    }
    return true;
  }
  // validation master 
  this.validate = function(validation){
    errors = false;
        // loop through form fields
    for ( var field in validation ){
        // get input id   
        var elem_id = '#' + field;
        if(validation.hasOwnProperty(field)){
          var field_obj  = validation[field];
          // loop for validate methods for the form field  
          for ( var validation_method in field_obj.methods ){    
            if(field_obj.methods.hasOwnProperty(validation_method)){
              var validation_opts = field_obj.methods[validation_method];
              var params = [];
              params.push(elem_id);       
              // check if there is a custom error msg and if so bind it in the global object for use in validation function
              if(typeof validation_opts.error != 'undefined')
                params.push(validation_opts.error)
              else 
                params.push('default');
              // check if validation function has arguments and if so apply them
              if(typeof validation_opts.args != 'undefined') 
                params = params.concat(validation_opts.args);
                console.log(params);
                // execute validate method
                if(!this.validation[validation_method].apply(null, params)){
                    errors = true;
                    break;
                } // close if
              } // close for loop
            } // close if
          } // close if
        } // close for loop

    //if we have errors validation has failed
    if(errors)
      return false;
    else
      return true;
  } // close validate function

  /*
  * Function for adding labels to selected inputs with default placeholder
  */

  this.add_yodalabels = function(inputs){

    this.yodalabels = inputs;

    for(var propName in inputs){
      // get input id
      var id = '#' + propName;
      // create yoda label container id
      var yodaid = propName + '_yodalabel';
       // if not inline, labels are displayed behind the form inputs like placeholders
      if(this.labels.inline == false){
        // set css
        $(id).parent().css({'position': 'relative'});
        var topPos = $(id).position().top + 3;
        var leftPos = $(id).position().left + 5;
        $(id).css({'z-index' : 10, 'position' : 'relative',  'background' : 'none'});
        // add yoda label container div
        $(id).parent().append('<div id="' + yodaid + '"></div>');
        $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'z-index': 0});
        // add yodalabel
        $('#' + yodaid).append('<div class="yodalabel"></div>');
        // set initial input value
        $('#' +  yodaid + ' .yodalabel').html(inputs[propName]);
        // bind to input focus and blur
        $(id).focus(function(){
            var elem_id = '#' +  $(this).attr('id') + '_yodalabel .yodalabel';
            if($(this).val() == '')
              $(elem_id).html('');
            if($(elem_id).hasClass('error')){
                $(elem_id).removeClass('error');
               }
           });
        
        $(id).blur(function(){
            var elem_id = '#' +  $(this).attr('id') + '_yodalabel .yodalabel';
            if($(this).val() == '')
              $(elem_id).html(that.yodalabels[$(this).attr('id')]);
          });

      } else { // we are dealing with labels to be displayed inline with the inputs
        // set css
        $(id).parent().css({'position': 'relative'});
        var topPos = $(id).position().top;
        var leftPos = ($(id).width() + 20);
        // add the yodalabel container div
        $(id).parent().append('<div id="' + yodaid + '"></div>');
        $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'border' : 'none'});
        // append the label
        $('#' + yodaid).append('<div class="yodalabel"></div>');
        // set the initial input value
        $('#' + yodaid + ' .yodalabel').html(inputs[propName]);
        // bind focus and blur methods
        $(id).focus(function(){
            var  elem_id = '#' + $(this).attr('id') + '_yodalabel .yodalabel';
            if($(elem_id).hasClass('error'))
            $(elem_id).removeClass('error');
            $(elem_id).html(that.yodalabels[$(this).attr('id')]);
          });

        $(id).blur(function(){
          });
      }// end of else
    } // end of loop
  } // end of add function
}// end of constructor

// usage
$(document).ready(function(){

    var formyoda = new Formyoda();
    var validation = { username : { methods : { min : {args : [5], error : 'fuuuuuuuu'} } } };

    formyoda.labels.inline = true;
    formyoda.add_yodalabels({'username' : 'username...', 'mail' : 'email...'});

    $('form').submit(function(){ 
        if(!formyoda.validate(validation))
          return false;
        return false; // for testing purposes
        })
});

