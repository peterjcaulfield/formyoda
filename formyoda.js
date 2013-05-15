// Dependencies: JQuery
if(document.readyState === "complete") {
  if(typeof JQuery === 'undefined')
    alert('JQuery is required for formyoda to work');
}

function Formyoda(){
  // get reference to this for when we are nested and need ref to parent
  var that = this;
  
  this.labels = {inline : false};
  this.validation = {};
  this.validation.errors = {blank : 'Please fill out this field', email : 'Invalid Email', maxchars : 'Too many characters'};

  this.validation.blank = function(input){
    if($(input).val() == ''){
        $(input + '_yodalay').html(that.validation.errors.blank);
        $(input + '_yodalay').addClass('error');
        return false;
    }
    return true;
  } 

  this.validation.email = function(input){
    var email = $(input).val();
    var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    if(!regex.test(email)){
      $(input).val('');
      $(input + '_yodalay').html(that.validation.errors.email);
      $(input + '_yodalay').addClass('error');
      return  false;
    }
    return true;
  }

  this.validation.max = function(array){
    if($(array[0]).val().length > array[1]){
      $(array[0]).val('');
      $(array[0] + '_yodalay').html(that.validation.errors.maxchars);
      $(array[0] + '_yodalay').addClass('error');
      return false;
    }
    return true;
  }



  this.validate = function(inputs){
    errors = false;

    for(propName in inputs){
          
      var id = '#' + propName;
  
      for(var i = 0; i < inputs[propName].length; i++){
        // check if validate property is an object. If so we have array of function name + arguments
        if(typeof inputs[propName][i] === 'object'){
            // params array includes id of form inputs and the function arguments 
            params = Array();
            params.push(id);
            for(var j = 1; j < inputs[propName][i].length;j++){ 
              params.push(inputs[propName][i][j]);
            } 
         
            if(!this.validation[inputs[propName][i][0]](params)){  
              errors = true;
              break;
           }
          // else we are dealing with a string representing name of validate function
          }else
          {
            if(!this.validation[inputs[propName][i]](id)){
              errors = true;
               break;
             }
          }
      }
    }
    //if we have errors validation has failed
    if(errors)
      return false;
    else
      return true;
  }

  this.add_yodalabels = function(inputs){
    this.yodalabels = inputs;
    for(var propName in inputs){
    
      var id = '#' + propName;
      var yodaid = propName + '_yodalay';
    
      if(this.labels.inline == false){
         // if not inline, labels are displayed behind the form inputs like placeholders
      
        // this allows us to get the relative position of the inputs
        $(id).parent().css({'position': 'relative'});
      
        var topPos = $(id).position().top + 3;
        var leftPos = $(id).position().left + 5;
    
        $(id).css({'z-index' : 10, 'position' : 'relative',  'background' : 'none'});
        $(id).parent().append('<div id="' + yodaid + '"></div>');
        $('#' + yodaid).css({'position' : 'absolute', 'top' : topPos, 'left' : leftPos, 'z-index': 0});
        // set initial input value
        $('#' + yodaid).html(inputs[propName]);
  
        // bind to input focus and blur
        $(id).focus(function(){
            var elem_id = $(this).attr('id');
            if($(this).val() == '')      
              $('#' +  elem_id + '_yodalay').html('');
            if($('#' +  elem_id + '_yodalay').hasClass('error')){
                $('#' +  elem_id + '_yodalay').removeClass('error');
               }
           });

        $(id).blur(function(){
          
           var  elem_id = $(this).attr('id');
            if($(this).val() == '')
              $('#' +  elem_id + '_yodalay').html(that.yodalabels[elem_id]);
          });
      
   
      }else
      { // we are dealing with labels to be displayed inline with the inputs 
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
            $('#' +  elem_id + '_yodalay').html(that.yodalabels[elem_id]);
          });
    
        $(id).blur(function(){
          });
      }
    } // end of loop
  } // end of add function
}
// usage
$(document).ready(function(){

    //    formyoda.labels.inline = false;
    var formyoda = new Formyoda();
    formyoda.add_yodalabels({'username' : 'username...', 'mail' : 'email...'})
    
    var validation = { 'username' : [ ['max', 10] , 'blank' ], 'mail' : ['blank', 'email']  };     
    $('form').submit(function(){
        
        if(!formyoda.validate(validation))
          return false;
        })
});


	
	
