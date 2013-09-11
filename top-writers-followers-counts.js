(function(){

var followers = {}, // will contains followers counts

    // this is used to get the followers count on a profile
    re = /Followers\s*<span class="[^"]+">(\d+)<\/span>/m,

    // this is a list of all top writers (<a> elements)
    $quorans = $( ".wiki_text span.qlink_container a" ),

    count = $quorans.length;

// this will display the list
function makeString() {

    var s = "",
        
        // list of all names
        top = Object.keys(followers),
        q;

    // sort the list by followers counts
    top = top.sort(function(a,b) {
        return followers[b].followers - followers[a].followers;
    });

    // for each Top Writer, …
    for (var i=0, l=top.length; i<l; i++) {
        q = followers[top[i]];

        // add a link to their profile
        top[i] = '<a href="'+q.url+'">'+top[i]+"</a> ("+q.followers+")";
    }

    s = top.join("<br />");

    // display the list. This is ugly, but the goal is to save time,
    // not to make a beautiful page.
    document.body.innerHTML = s;

}

// for each Top Writer, do…
$quorans.each( function( i,a ) {
    var url  = a.href, // pick their profile URL
        name = a.textContent; // and their name

    // go on their profile
    $.ajax( url, {
        success: function( html ) {

            followers[name] = {

                // get their followers count
                followers: +(re.exec(html)[1]),

                // keep their profile URL
                url: url
            };

            // 499, 498, …, 1
            console.log(count);

            // done? Let’s display the list!
            if (--count === 0) {
                makeString();
            } 
        },

        // if there is an error, you have to re-run the script,
        // or check the followers count by yourself
        error: function() {
            count--;
            console.log("Error with "+name+", skipping");
        }
    });

});

})();