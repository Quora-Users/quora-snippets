/**
 * Usage:
 *  Go on a question, click on 'Ask to Answer' if there are already some
 *  answers, expand the suggestions list as far as you want/can, then
 *  copy/paste this piece of code in the JS console and execute it. It'll
 *  generate an array of people. On Chrome, the JSON version of the array
 *  will be copied in your clipboard.
 **/
var re = /has answered (\d+) of (\d+)/,
    a;

function parse_price(t) {
    t = t.split(' ')[0];
    return t && t.toLocaleLowerCase() == 'free' ? 0 : +t;
}

function parse_raw(t, s) {
    if (!t) { return []; } 
    re.lastIndex = -1;
    s = re.exec(t);
    if (s && s.length == 3) {
        return [+s[1], +s[2]];
    }
    return [];
}

var a = $('.wanted_answer_suggestion').map(function(_, e) {
    var $e = $(e),
        $r = $e.find('.response_rate_row').first(),
        $n = $e.find('.name .user').first(), r;

    $r.mouseover();
    r = $r.text();

    return {
        //pic: $e.find('.profile_photo_img').first().attr('src'),
        name: $n.text(),
        url: $n.attr('href'),
        rate: r.split(' ', 1)[0],
        price: parse_price($e.find('.action_button').first().text()),
        raw: parse_raw(r)
    };
}).toArray();
try { copy(JSON.stringify(a,undefined,2)); } catch(e) {
    console.log('cannot copy', e);
}
console.log(a);

/*
more_please = true;
(function up() {
    if (!more_please) { return; }
    $('.pager_next_link.e_col').click();
    setTimeout(up, 3000);
})();
*/
