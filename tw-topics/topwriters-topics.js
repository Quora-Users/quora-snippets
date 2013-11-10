/**
 * This snippet generate an array of all Top Writers 2012
 * with the topics they have more written answers in, e.g.:
 * [
 *  {
 *   "name": "Foo Bar",
 *   "href": "/Foo-Bar-12",
 *   "topics": [
 *      { "name": "Foo",
 *        "href": "/Foo",
 *        "count": 42  },
 *      { "name": "Bar",
 *        "href": "/Bar",
 *        "count": 12  },
 *      ...
 *   ]
 *  },
 *  ...
 * ]
 *
 * Run it on the Top Writers 2012 page:
 *  /Top-Writers-on-Quora/Who-is-in-Top-Writers-2012
 **/

var tw = $('.answer_wiki_text.answer_content li > span.qlink_container > a')
                .slice(15)
                .map(function(_,e){var $e=$(e);
                     return {name: $e.text(), href: $e.attr('href')}})
                .toArray(),
    count = tw.length,

    t_sel = '.w3.topic_card.follow_card_block.expandable_follow_card_block';

function hop() {
    if (--count <= 0) {
        console.log('done');
        try {
            copy(JSON.stringify(tw));
        } catch (e) {
            console.log('cannot copy.');
        }
    }
}

$.each(tw, function(_, u) {
    $.ajax({
        url: u.href + '/topics',
        success: function(html) {
            u.topics = $(t_sel, html).map(function(_, t) {
                var $t = $(t),
                    $n = $t.find('a.topic_name').first();
                return {
                    name: $n.text(),
                    href: $n.attr('href'),
                    count: +$t.find('.name_meta.light').text().split(' ', 1)[0]
                };
            }).toArray();
            hop();
        },
        error: function(e) {
            console.log('error with ' + u.name + '.');
            hop();
        }
    });
});
