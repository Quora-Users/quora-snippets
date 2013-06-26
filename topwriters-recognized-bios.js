var allBios = [],

    bios_sel = '.topic_expert_profile_section > .w4_5 > .row:first a.topic_name',
    tw_sel   = '.inline_editor_value .expandable_qtext + div [id$="_full_text_content"] li .qlink_container a',
    $tws, cpt;

function addBios(name, url) {

    $.get(url + '/about', function (html) {
        
        var bios = $(bios_sel, html).map(function(i, e) {
            var $e = $(e);
            return '<a href="' + $e.attr('href') + '">' + $e.text() + '</a>';
        }).toArray(), result;

        if (bios.length > 0) {
            result = '<li><a href="' + url + '">' + name + '</a>: ' + bios.join(', ') + '</li>';
            allBios.push(result);
        }

        if (--cpt == 0) { console.log( 'done.' ); }

    });

}

$tws = $(tw_sel);
cpt = $tws.length;

$(tw_sel).each(function (i, e) {
    var $e = $(e);
    addBios($e.text(), $e.attr('href'));
});
