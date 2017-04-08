
$(document).ready(function(){

smoothScroll(1000);              //for smooth scroll 
function smoothScroll(duration){    
$('a[href^="#"]').on('click',function(event){
  var target=$($(this).attr('href'));

  if(target.length){
    event.preventDefault();
    $('html, body').animate({
      scrollTop: target.offset().top},duration);
    }
  });
}

$('div[contenteditable]').keydown(function(e) {  //To insert a new paragraph whenever enter key is pressed
    // trap the return key being pressed
    if (e.keyCode === 13) {
      // insert closing tag </p> (another opering <p> is automatically inserted because of the presence of an unpaired closing tag)
      document.execCommand('insertHTML', false, '</p>');
      
          // prevent the default behaviour of return key pressed
      return false;
    }
  });
 

var ele = document.getElementById('tooltip');   
var sel = window.getSelection();   //to get the text selected by user
var rel1= document.createRange();  
rel1.selectNode(document.getElementById('cal1'));
var rel2= document.createRange();
rel2.selectNode(document.getElementById('cal2'));

window.addEventListener('mouseup', function () {   //when some text is selected, mouseup triggers the display of the tooltip
    if (!sel.isCollapsed) {
        
        var r= sel.getRangeAt(0).getBoundingClientRect();  //getBoundingClientRect() is used to get coordinates and height and width of the selected text.
        var rb1 = rel1.getBoundingClientRect();        
        var rb2 = rel2.getBoundingClientRect();
        ele.style.top = (r.bottom - rb2.top)*100/(rb1.top-rb2.top) + 'px'; //this will place ele below the selection
        ele.style.left = (r.left - rb2.left)*100/(rb1.left-rb2.left) + 'px'; //this will align the right edges together

        //code to set content
        if(sel.getRangeAt(0).length!=0)
        ele.style.display = 'flex';
        
    }
});
window.addEventListener('mousedown', function (event) {  //on mousedown, different events are triggered depending upon the target of mousedown
    if(event.target==document.getElementById("bold-text")|| event.target==document.getElementById("underline-text")||event.target==document.getElementById("red-text"))
    { var range=sel.getRangeAt(0);           //is target is 1 of the 3 icons on the tooltip
      var selectionContents=range.extractContents();
          if(event.target==document.getElementById("bold-text"))   
          {
            var strong=document.createElement("strong");  //a <strong> elements is created and appended to beginning of the range of selection

            strong.appendChild(selectionContents);
            range.insertNode(strong);
          }
          if(event.target==document.getElementById("underline-text"))
            {
              var ul=document.createElement("span");  //for making selected text underlined
              ul.style.textDecoration="underline";

              ul.appendChild(selectionContents);
              range.insertNode(ul);
            }
          if(event.target==document.getElementById("red-text"))
          { var redtext=document.createElement("span"); //for making selected text red-colored
            redtext.style.color="red";
 
            redtext.appendChild(selectionContents);
            range.insertNode(redtext);

          }
    }
    
    ele.style.display = 'none';  //for hiding the tooltip when mousedown takes place anywhere in the body
});


var color="red"; //for making alernate red and blue links
$('#done-button').click(function(event){  // on clicking done button, find each <p> element in the textbelt
    $('.ul-links').empty();
    $('.textbelt').find('p').each(function(){
      let textOfEachParagraph = $(this).text();
      if(textOfEachParagraph.split('<a>').length>1)   //extract the text in each element between the anchor tags (if present) and append it in the 'ul- links' section
      {                                                   
        var anchor = textOfEachParagraph.split('<a>').pop().split('</a>').shift();
        $('.links').show(); //unhide the links section
        if(color=="red")
        {$('.ul-links').append("<a href='#' style='color:#BA3B43;'>"+anchor+"</a><br>");
         color="blue";
        } 
        else if(color=="blue")
        {$('.ul-links').append("<a href='#' style='color:#254C60;'>"+anchor+"</a><br>");
         color="red";
        }
      }
     $('body').animate({scrollTop: $(document).height()});    //scroll to the bottom on clicking done button  
     });
});

$('#textbelt').sortable();   //for the drag and drop of paragraphs
$('#textbelt').sortable("disable"); //disable it by default

var editable="true";
$('#Re-order-button').click(function(){
   if(editable=="true")  //if the re-order button is clicked, enable sortable() which makes the paragraphs uneditable. 
    {  
      $('#textbelt').sortable("enable");
        $('p').css('border-left','10px solid #6E6E6F');
        $('#Re-order-button').css('background-color','#717171  ');
        $('#textbelt').css("background-color","#F4F5F6");
        $('p').css('background-color','white');
        $('#Re-order-button').html("Type");
        editable="false";
     }
   else 
    { $('#textbelt').sortable("disable"); //on clicking the re-order button again, sortable() is disabled and paragraphs become editable again
        $('p').css('border-left','10px solid white');
        $('#Re-order-button').css('background-color','#B8B8B9  ');
        $('#textbelt').css("background-color","white");
        $('p').css('background-color','white');
        $('#Re-order-button').html("Re-order");
        editable="true";     
    }

});
});
 //for randomization of four-letter words in textbelt 
function getText(){  //get the text of editor and convert it to an array
    var i = 0;
    var contenteditable = document.querySelector(".textbelt").textContent;
    RandomWordComplete($.trim(contenteditable).split(" "),i);
 }
 function computeNew(array){ //convert the array back to a string and display it back in the editor 
    $(".textbelt").empty();
    var newContent = array.join(" ");
    $('.textbelt').append(newContent);
 }
function RandomWordComplete(array,i) { //this function is called for every element of the array and it replaces all the four letter words
  
   if(i == array.length){
   
    computeNew(array);
   }
   if(array[i].length == 4){
      $.ajax({
          type: "GET",
          url: "http://randomword.setgetgo.com/get.php",
          dataType: 'jsonp',
          success: function(data){
            array[i] = data.Word;
            i++;
            if (i <= array.length){
              RandomWordComplete(array, i);
            } 
          }
      });
    }
   else{
      i++;
      if (i <= array.length){
         RandomWordComplete(array, i);
      } 
   }
 }  



