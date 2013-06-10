/*
 * Name:    formyoda.js
 * About:   Form helper with state based labelling, and validation utilities
 * Author:  Peter J. Caulfield, peterjcaulfield [at] gmail [dot] com
 *
 */

// Dependencies: JQuery
if(document.readyState === "complete") {
  if(typeof JQuery === 'undefined')
    alert('JQuery is required for formyoda to work');
}
// constuctor
function Formyoda(){
  /* Initialisation
  =====================================================================================
  */

  // get reference to this for when we are nested and need ref to parent
  var that = this;
  // create an object to cache jquery input elements
  this.jquery_input_elements = {};
  // create object to cache jquery overlay elements
  this.jquery_overlay_elements = {};
  // create object to cache validation elements
  this.jquery_validate_elements = {};
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

  /* Validation Functions
  =======================================================================================
  */

   // on validation failure
  this.validation.failed = function(field, elem, yodalabel,  error, method){
    if(that.labels.inline == false)
        elem.val('');
    if (error != 'default')
          yodalabel.html(error);
      else   
          yodalabel.html(that.validation.errors[method]);
    yodalabel.addClass('error');
  }
  
  /*
   Text fields
   ==============================================================================================
   */

  // check for blank string
  this.validation.blank = function(value){
    if(value == '')
      return false;
    else
    return true;
  }
  // checck if valid email
  this.validation.email = function(value){
    var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    if(!regex.test(value))
      return false
    else
      return true;
  }
  // check against max character count
  this.validation.max = function(value, max){
    if(typeof max == 'undefined' || typeof max != 'number'){
       console.error('Invalid argument type to max validation function. Expected: int -> Received \"' +  typeof max + '\"');
       return false;
    }
    if(value.length > max)
      return false;
    else
      return true;
  }
  // check against minimum character count
  this.validation.min = function(value, min){
    if(typeof min == 'undefined' || typeof min != 'number'){
       console.error('Invalid argument type to min validation function. Expected: int -> Received \"' +  typeof min + '\"');
       return false;
    }
    if(value.length < min)
      return false;
    else
      return true;
  }
  // check if its numeric
  this.validation.numeric = function(value){
    if(typeof value != 'number')
      return false;
    else
      return true
  }
  // check against arbitrary regex pattern
  this.validation.format = function(value, regex){
    if(typeof regex == 'undefined' || typeof regex != 'string'){
       console.error('Invalid argument type to format validation function. Expected: string -> Received \"' +  typeof regex + '\"');
       return false;
    }
    if(!regex.test(value))
      return false;
    else
      return true;
  }

  /* Check boxes and radiobuttons
  ======================================================================================================
  */

  // check if a a checkbox/radiobutton is checked
  this.validation.checked = function(elem){
    if(elem.is(':checked')){
      return true;
    }
    else{
      return false;
    }
  }
  /* Radiobuttons
  =====================================================================================================
 */

  this.validation.selected = function(selector){
    if($(selector).index() != 0)
      return true;
    else
      return false;
  }


  /* Validation loop of execution
  ======================================================================================================
  */
  
  // validation master 
  this.validate = function(){
    var params = null;
    errors = false;
    // loop through form fields
    for ( var field in this.validation.fields ){
        // get input id   
        var elem_id = '#' + field;
        // store user input
        this.user_input[field] = $(elem_id).val(); 
        // check if we were passed a valid form element id
        if(!$(elem_id).length){
          console.error('The form element id: \"' + field + '\" is not a valid id. Check your validation.fields settings');
          return false; 
        }
        // we have a valid element so we can cache it
        this.jquery_validate_elements[field] = $(elem_id);
        
        if(this.validation.fields.hasOwnProperty(field)){
          var field_obj  = this.validation.fields[field];
          if(typeof field_obj != 'object'){
            console.error('Invalid type given for field: \"' + field +  '\". Expected: "object" -> received: \"' + typeof field_obj + '\". Check your validation.fields settings');
            return false;
          }
          // loop for validate methods for the form field  
          for ( var validation_method in field_obj ){    
            // reset params array
            params = [];
            // build first param arg based on form element type
            var element = this.jquery_validate_elements[field];
            switch(true){
            
              case element.is('input:text'):
                    params.push(element.val());
                    break;
              case element.is('input:checkbox'):
                     params.push(element);
                    break;
              case element.is('select'):
                    params.push(elem_id + ' option:checked');
                    break;
            }

            if(field_obj.hasOwnProperty(validation_method)){
              var validation_opts = field_obj[validation_method];
              if(typeof validation_opts != 'object'){
                console.error('Invalid type given for field: \"' + field +  '\". Expected: "object" -> received: \"' + typeof validation_opts + '\". Check your validation.fields settings');
                return false;
              }else if(validation_opts instanceof Array){
                console.error('Invalid type given for field: \"' + field +  '\". Expected: "object" -> received: "Array". Check your validation.fields settings');
                return false;
              }
              // check if validation function exists
             if(typeof this.validation[validation_method] != 'function'){
                console.error("Validation method: \"" +   validation_method +  '\" specified for form field: \"' + field + ' \"   does not exist. Check your validation.fields settings');
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
                  console.error('Argument: \"' + validation_opts.args + '\" to validate method: \"' + validation_method +  '\" for form field: \"' + field + '\"  must be wrapped in an array. Check your validation.fields settings');
                  return false;
                }
                else
                  params = params.concat(validation_opts.args);
              }
              // execute validation method
              if(!this.validation[validation_method].apply(null, params)){
                this.validation.failed(field, this.jquery_validate_elements[field], this.jquery_overlay_elements[field], error, validation_method);
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

  /* Add yodalabels method
  ===========================================================================================
   Function for adding labels to selected inputs with default placeholder
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
    // store the inputs 
    this.yodalabels = inputs;
  
    for(var field in inputs){
      if(typeof inputs[field].placeholder != 'string'){
        console.error('Invalid type given for label for field: \"' + field + '\" in call to add_yodalabels function. Expected: "string" -> received: \"' + typeof inputs[field].placeholder + '\"' );
        return false;
      }
      // get element id
      var elem_id = '#' + field;
      // check if we were passed a valid form element id
      if(!$(elem_id).length){
        console.error('Invalid form element id given for field: \"' + field + '\" in call to add_yodalabels function.');
        return false; 
      }
      // we have a valid element so we can cache it
      var the_input =  this.jquery_input_elements[field] = $(elem_id);
      // create yoda label container id
      var yodaid = field + '_yodawrapper';
       // if not inline, labels are displayed behind the form inputs like placeholders
      if(inputs[field].position == 'behind' && this.jquery_input_elements[field].is(':input')){
        // set css
        the_input.parent().css({'position': 'relative'});
        var topPos = the_input.position().top + 3;
        var leftPos = the_input.position().left + 5;
        the_input.css({'z-index' : 10, 'position' : 'relative',  'background' : 'none'});
        // add yoda label container div
        the_input.parent().append('<div id="' + yodaid + '"></div>');
        $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'z-index': 0});
        // add yodalabel
        $('#' + yodaid).append('<div id="' + field + '_yodalabel"  class="yodalabel"></div>');
        // cache yoda overlay
        this.jquery_overlay_elements[field] = $('#' + field + '_yodalabel');
        // set initial input value
        $('#' +  yodaid + ' .yodalabel').html(inputs[field].placeholder);
        
        // bind to input keydown, focus and blur
        
        // first we create function that declares all
        // the variables the event handler needs and
        // then returns a function to handle the actual
        // event. Most important is that we are caching 
        // jquery objects via closures :)
        var create_keydown_handler = function(){
            var input = that.jquery_input_elements[field];
            var overlay = that.jquery_overlay_elements[field];
            var id = field;
            return function(){
              setTimeout(function(){ // settimeout allows us to get input value on keydown rather than key up
                if(input.val() == '')
                  overlay.html(that.yodalabels[id].placeholder);
                else
                  overlay.html('');
              }, 1)
            }
          }
          // we bind the event to the anonymous function returned by our cached function creater
          this.jquery_input_elements[field].on('keydown', create_keydown_handler());
        
          // create cache based focus handler        
          var create_focus_handler = function(){
          var input = that.jquery_input_elements[field];
            var overlay = that.jquery_overlay_elements[field];
            var id = field;
            return function(){
              if(overlay.hasClass('error')){
                if(that.user_input[id] != ''){
                  overlay.html('');
                  input.val(that.user_input[id]);
                  that.user_input[id] = '';
                  overlay.removeClass('error');
                  return;
                }
                overlay.html(that.yodalabels[id].placeholder);
                overlay.removeClass('error');
              }
            }
          }
          // bind to focus 
          this.jquery_input_elements[field].on('focus', create_focus_handler());
        
      } else { // we are dealing with labels to be displayed inline with the inputs
        // set css
        the_input.parent().css({'position': 'relative'});
        var topPos = the_input.position().top;
        var leftPos = the_input.width() + 20;
        // add the yodalabel container div
        the_input.parent().append('<div id="' + yodaid + '"></div>');
        $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'border' : 'none'});
        // append the label
        $('#' + yodaid).append('<div id="' + field + '_yodalabel"  class="yodalabel"></div>');
        // cache yoda overlay
        this.jquery_overlay_elements[field] = $('#' + field + '_yodalabel');
        // set the initial input value
        $('#' + yodaid + ' .yodalabel').html(inputs[field].placeholder);
          // create cache friendly focus handler
        var create_focus_handler = function(){
          var overlay = that.jquery_overlay_elements[field];
          var id = field;
          return function(){
            if(overlay.hasClass('error')){
              overlay.removeClass('error');
              overlay.html(that.yodalabels[id].placeholder);
            }
          }
        }
        
        if( this.jquery_input_elements[field].is('input:text') || this.jquery_input_elements[field].is('select')) {
          // bind focus and blur methods
          this.jquery_input_elements[field].on('focus', create_focus_handler()); 
        } else {
          this.jquery_input_elements[field].on('change', create_focus_handler());   
        } // end of if/else
      }// end of else
    } // end of loop
  } // end of add function
}// end of constructor

/* Usage
 ================================================================================
 */
$(document).ready(function(){
    // create the formyoda
    var formyoda = new Formyoda();
    // add input labels
    formyoda.labels.inline = false;
    formyoda.add_yodalabels( { username : { placeholder : 'username...', position : 'inline' }, 
                               mail : { placeholder: 'email...', position : 'behind' }, 
                               terms : { placeholder: 'Terms', position : 'inline'}, 
                               select : { placeholder : 'quantity', position : 'inline' } });
    // set up validation of username field
    formyoda.validation.fields.username = {   // validation methods applied to username field
                                              blank : { error : 'Blank, username cannot be' }, // method without an argument but unique error
                                              min :   { error : 'Less than five characters this cannot be',  args : [5] } }; // method with unique error and argument to min function
    
    formyoda.validation.fields.mail =     { 
                                              blank : { }, // method with no specified error will use the default error for that method
                                              email : { error : 'Email this is not' } }; 
                                                        
    
    formyoda.validation.fields.terms = { checked : { error : 'this needs to be checked' }  };

    formyoda.validation.fields.select = { selected : { error : 'please select an option' } };

    $('form').submit(function(){ 
        if(!formyoda.validate())
          return false;
    });
    console.log($('#select option:selected').index());
});

