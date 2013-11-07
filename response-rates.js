/**
 * Usage:
 *  Go on a question, click on 'Ask to Answer' if there are already some
 *  answers, expand the suggestions list as far as you want/can, then
 *  copy/paste this piece of code in the JS console and execute it. It'll
 *  generate an array of people. On Chrome, the JSON version of the array
 *  will be copied in your clipboard.
 **/
var a = $('.wanted_answer_suggestion').map(function(_, e) {
    var $e = $(e),
        $n = $e.find('.name .user').first();
    return {
        pic: $e.find('.profile_photo_img').first().attr('src'),
        name: $n.text(),
        url: $n.attr('href'),
        rate: $e.find('.response_rate_row').first().text()
    };
}).toArray();
try { copy(JSON.stringify(a,undefined,2)); } catch(e) {
    console.log('cannot copy', e);
}
console.log(a);

