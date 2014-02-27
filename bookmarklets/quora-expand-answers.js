/*
 * I'm pretty sure this isn't my code, but I've been using it as a bookmarklet nonetheless.
 */

(function(){
  window.setInterval(function(){
    $('.pager_next.action_button').click(); 
    scrollTo(0, document.body.scrollHeight);
  }, 2000);
})();
