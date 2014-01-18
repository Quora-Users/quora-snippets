/*
 * This is a little script that will send an invite to follow your bog on Quora to everyone on the invite page.
 */
 
 var elms = document.getElementsByClassName("submit_button"); 
 for(var elm in elms){ 
  elms[elm].click(); 
 }
