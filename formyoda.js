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
                             blank : 'Blank this cannot be',
                             email : 'Invalid Email this is',
                             max : 'Too many characters you have',
                             min : 'Too few characters you have',
                             numeric : 'A number this must be',
                             format : 'Invalid format this is'
                                                                    };
  this.validation.unique_errors = {};
  // stores user validation options
  this.validation.fields = {};
  // stores user input on text fields so it's not wiped in validation when we have labels behind inputs
  this.user_input = {};

  /*
  * Validation functions
  */

   // on validation failure
  this.validation.failed = function(id, error){
   
    if(that.labels.inline == false)
        $(id).val('');

    if (error != 'default')
          $(id + '_yodawrapper .yodalabel').html(error);
      else   
          $(id + '_yodawrapper .yodalabel').html(that.validation.errors.blank);
    $(id + '_yodawrapper .yodalabel').addClass('error');
  }

  this.validation.blank = function(id){
    if($(id).val() == '')
      return false;
    else
    return true;
  }

  this.validation.email = function(id){
    var email = $(id).val();
    var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    if(!regex.test(email))
      return false
    else
      return true;
  }

  this.validation.max = function(id, max){
    if(typeof max == 'undefined' || typeof max != 'number'){
       console.error('Invalid argument type to max validation function. Expected: int -> Received \"' +  typeof max + '\"');
       return false;
    }
    if($(id).val().length > max)
      return false;
    else
      return true;
  }

  this.validation.min = function(id, min){
    if(typeof min == 'undefined' || typeof min != 'number'){
       console.error('Invalid argument type to min validation function. Expected: int -> Received \"' +  typeof min + '\"');
       return false;
    }
    if($(id).val().length < min)
      return false;
    else
      return true;
  }

  this.validation.numeric = function(id){
    if(typeof $(id).val() != 'number')
      return false;
    else
      return true
  }

  this.validation.format = function(id, regex){
    if(typeof regex == 'undefined' || typeof regex != 'string'){
       console.error('Invalid argument type to format validation function. Expected: string -> Received \"' +  typeof regex + '\"');
       return false;
    }
    if(!regex.test($(input).val()))
      return false;
    else
      return true;
  }
  // validation master 
  this.validate = function(){
    errors = false;
        // loop through form fields
    for ( var field in this.validation.fields ){
        // get input id   
        var elem_id = '#' + field;
        // store user input
        this.user_input[field] = $(elem_id).val(); 
        // check if we were passed a valid form element id
        if(!$(elem_id).length){
          console.error('The form element id: \"' + field + '\" is not a valid id. Check your validation object');
          return false; 
        }
        if(this.validation.fields.hasOwnProperty(field)){
          var field_obj  = this.validation.fields[field];
          if(typeof field_obj != 'object'){
            console.error('this.validation.fields is malformed for field: \"' + field +  '\". Expected: "object" -> received: ' + typeof field_obj);
            return false;
          }
          // loop for validate methods for the form field  
          for ( var validation_method in field_obj ){    
            if(field_obj.hasOwnProperty(validation_method)){
              var validation_opts = field_obj[validation_method];
              var params = [];
              params.push(elem_id);       
              // check if validation function exists
             if(typeof this.validation[validation_method] != 'function'){
                console.error("Validation method: \"" +   validation_method +  '\" specified for form field: \"' + field + ' \"   does not exist. Check your validation object');
                return false;
             }
              // check if there is a custom error msg and if so bind it in the global object for use in validation function
             var error = 'default'; 
             if(typeof validation_opts.error != 'undefined'){
                if(typeof validation_opts.error == 'string')
                  error = validation_opts.error;
                else
                  console.error('Error message for field: ' + field + 'Expected: string -> recieved \"' + typeof validation_opts.error + '\"');
              }
              // check if there are arguments to validation method
              if(typeof validation_opts.args != 'undefined') { 
                if(!(validation_opts.args instanceof Array)) {
                  console.error('Argument: \"' + validation_opts.args + '\" to validate method: \"' + validation_method +  '\" for form field: \"' + field + '\"  must be wrapped in an array. Check your validation object');
                  return false;
                }
                else
                  params = params.concat(validation_opts.args);
              }
              // execute validation method
              if(!this.validation[validation_method].apply(null, params)){
                this.validation.failed(elem_id, error);
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
      
    if(typeof inputs != 'object'){
      console.error('Invalid type passed to add_yodalabels function. Expected: "object" -> received: \"' + typeof inputs + '\"');
      return false
    }
    else if(inputs instanceof Array){
      console.error('Invalid type passed to the add_yodalabels function. Expected: "object" -> received: \"Array\"');
      return false;
    }
    this.yodalabels = inputs;

    for(var field in inputs){
      // get element id
      var elem_id = '#' + field;
      // check if we were passed a valid form element id
      if(!$(elem_id).length){
        console.error('The form element id: \"' + field + '\" is not a valid id. Check your labels object');
        return false; 
      }
      // create yoda label container id
      var yodaid = field + '_yodawrapper';
       // if not inline, labels are displayed behind the form inputs like placeholders
      if(this.labels.inline == false){
        // set css
        $(elem_id).parent().css({'position': 'relative'});
        var topPos = $(elem_id).position().top + 3;
        var leftPos = $(elem_id).position().left + 5;
        $(elem_id).css({'z-index' : 10, 'position' : 'relative',  'background' : 'none'});
        // add yoda label container div
        $(elem_id).parent().append('<div id="' + yodaid + '"></div>');
        $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'z-index': 0});
        // add yodalabel
        $('#' + yodaid).append('<div class="yodalabel"></div>');
        // set initial input value
        $('#' +  yodaid + ' .yodalabel').html(inputs[field]);
        // bind to input focus and blur
        $(elem_id).focus(function(){
            var id = $(this).attr('id');
            var elem_id = '#' +  $(this).attr('id') + '_yodawrapper .yodalabel';
            $(elem_id).html('');
            if($(elem_id).hasClass('error')){
              $(this).val(that.user_input[id]);
              that.user_input[id] = '';
            }
            if($(elem_id).hasClass('error')){
                $(elem_id).removeClass('error');
               }
           });
        
        $(elem_id).blur(function(){
            var elem_id = '#' +  $(this).attr('id') + '_yodawrapper .yodalabel';
            if($(this).val() == '')
              $(elem_id).html(that.yodalabels[$(this).attr('id')]);
          });

      } else { // we are dealing with labels to be displayed inline with the inputs
        // set css
        $(elem_id).parent().css({'position': 'relative'});
        var topPos = $(elem_id).position().top;
        var leftPos = ($(elem_id).width() + 20);
        // add the yodalabel container div
        $(elem_id).parent().append('<div id="' + yodaid + '"></div>');
        $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'border' : 'none'});
        // append the label
        $('#' + yodaid).append('<div class="yodalabel"></div>');
        // set the initial input value
        $('#' + yodaid + ' .yodalabel').html(inputs[field]);
        // bind focus and blur methods
        $(elem_id).focus(function(){
            var id = $(this).attr('id');
            var  elem_id = '#' + $(this).attr('id') + '_yodawrapper .yodalabel';
            
            if($(elem_id).hasClass('error')){
            $(elem_id).removeClass('error');
            $(elem_id).html(that.yodalabels[$(this).attr('id')]);
            }
          });

        $(elem_id).blur(function(){
          });
      }// end of else
    } // end of loop
  } // end of add function
}// end of constructor

// usage
$(document).ready(function(){
    // create the formyoda
    var formyoda = new Formyoda();
    // add input labels
    formyoda.labels.inline = true;
    formyoda.add_yodalabels({username : 'username...', mail : 'email...'});
    // set up validation of username field
    formyoda.validation.fields.username = {   // validation methods applied to username field
                                              blank : { error: 'Blank, username cannot be'}, // method without an argument but unique error
                                              min :   { error: 'Less than five characters this cannot be',  args : [5] } } // method with unique error and argument to min function
    
    formyoda.validation.fields.mail = { 
                                              blank : { }, // method with no specified error will use the default error for that method
                                              email : { error: 'Email this is not' } } 
                                                        

    $('form').submit(function(){ 
        if(!formyoda.validate())
          return false;
    })
});

