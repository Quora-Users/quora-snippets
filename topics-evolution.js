(function() {

    // https://www.quora.com/Quora-Usage-Data-and-Analysis/What-are-the-most-followed-topics-on-Quora-in-2012/answer/Sean-Owczarek

    var topics_list_els = $( '.inline_editor_content li' ),
        topics_count = topics_list_els.length,
        num_re = /\d+/g,
        topics = [],
        
        // for each topic: {
        // url: <url>
        // name: <name>
        // march: <number of followers in march> (in k)
        // dec: < ... in december> (in k)
        //
        // march_incr: <2011 - march, 2012 progression>
        // annual_incr: <2011 - december, 2012 progression>
        //
        // dec_unanswered_q : <number of unanswered questions> (in k)
        // }

        // constants
        url              = 0,
        name             = 1,
        march            = 2,
        dec              = 3,
        march_incr       = 4,
        march_dec_incr   = 5,
        annual_incr      = 6,
        dec_unanswered_q = 7,
        
        get_unanswered_questions = function( ctx ) {
        
            return +$( '.row.section h3', ctx ).text().split( ' ' )[0];
        
        },
        get_followers_count      = function( ctx ) {
            
            var n = $( '.topic_followers span', ctx ).first().text().split( ' ' )[0];

            return +( n / 1000 ).toFixed();
        
        },

        // manually added
        bonus_topics = [
            [ 'The Internet'           , '/The-Internet-2'          ], // 26k
            [ 'YouTube'                , '/YouTube'                 ], // 73k
         // [ 'iPad'                   , '/iPad'                    ], // 12k
            [ 'Kindle'                 , '/Kindle'                  ], // 16k
            [ 'WikiLeaks'              , '/WikiLeaks'               ], // 43k
         // [ 'Software Engineering'   , '/Software-Engineering'    ], // 15k
            [ 'Television'             , '/Television'              ], // 44k
            [ 'iTunes'                 , '/iTunes'                  ], // 53k
            [ 'Google'                 , '/Google'                  ], // 81k
            [ 'Glee (TV series)'       , '/Glee-TV-series'          ], // 21k
            [ 'Oprah Winfrey'          , '/Oprah-Winfrey'           ], // 18k
         // [ 'Television Business'    , '/Television-Business'     ], // 14k
            [ 'Sports'                 , '/Sports'                  ], //143k
            [ 'Basketball'             , '/Basketball'              ], // 19k
            [ 'Football (Soccer)'      , '/Football-Soccer-2'       ], // 28k
         // [ 'Tennis'                 , '/Tennis'                  ], // 15k
            [ 'Mathematics'            , '/Mathematics'             ], // 57k
            [ 'Physics'                , '/Physics'                 ], // 49k
            [ 'The Bible'              , '/The-Bible'               ], // 21k
            [ 'Professional Sports'    , '/Professional-Sports'     ], // 23k
            [ 'NFL'                    , '/NFL'                     ], // 22k
            [ 'NBA'                    , '/NBA'                     ], // 27k
            [ 'Movie Business'         , '/Movie-Business'          ], // 32k
            [ 'Singers and Musicians'  , '/Singers-and-Musicians'   ], // 29k
            [ 'The Beatles (band)'     , '/The-Beatles-band'        ], // 50k
            [ 'Green Day'              , '/Green-Day'               ], // 28k
            [ 'Jay-Z'                  , '/Jay-Z'                   ], // 19k
            [ 'Kanye West'             , '/Kanye-West'              ], // 18k
            [ 'Photography'            , '/Photography'             ], //105k
            [ 'Digital Photography'    , '/Digital-Photography'     ], // 35k
            [ 'Education'              , '/Education'               ], //139k
            [ 'Medicine and Healthcare', '/Medicine-and-Healthcare' ], // 35k
            [ 'Exercise'               , '/Exercise'                ], // 45k
            [ 'Nutrition'              , '/Nutrition'               ], // 45k
            [ 'Cooking'                , '/Cooking'                 ], //114k 
            [ 'Healthy Eating'         , '/Healthy-Eating'          ], // 69k 
            [ 'Restaurants'            , '/Restaurants'             ], // 43k
            [ 'Clothing'               , '/Clothing'                ], // 29k
            [ 'Harry-Potter (books, movies and creative franchise)',
                '/Harry-Potter-books-movies-and-creative-franchise' ], // 45k
            [ 'Starbucks'              , '/Starbucks'               ]  // 47k
        ];

    topics_list_els.each( function( i, e ) {

        var $e    = $( e ),
            text  = $e.text(),
            topic = {},
            link  = $( 'a', $e )[0], tmp;


        topic[name]  = link.textContent;
        topic[march] = +num_re.exec( text )[0];

        tmp          = num_re.exec( text );

        if ( tmp !== null ) {

            topic[march_incr] = +tmp[0];
            while( num_re.exec( text ) !== null );

        }

        $.ajax(topic[url] = link.href, {

            success: function( data ) {

                topic[dec] = get_followers_count( data );
                topic[dec_unanswered_q] = get_unanswered_questions( data );

                delete data;

                topic[march_dec_incr] = +(((topic[dec] / topic[march])-1)*100).toFixed();

                if ( topic[march_incr] ) {

                    topic[annual_incr]
                         = +(((1 + topic[march_incr] / 100) * topic[dec] / topic[march] - 1) * 100).toFixed();
                }

                topics.push( topic );

            },

            async: false

        });
    });

    $.each( bonus_topics, function( i, e ) {

        var topic = {};

        topic[name] = e[0];
        topic[url]  = e[1];

        $.ajax( topic[url] = e[1], {
            success: function( data ) {
                topic[dec] = get_followers_count( data );
                topic[dec_unanswered_q] = get_unanswered_questions( data );
            },
            async: false
        });

        topics.push(topic);

    });

    // -- Make stats --

    topics = topics.sort(function ( t1, t2 ) { // sort by popularity
        return t2[dec] - t1[dec];
    });


    function make_string( topic ) {

        var _march       = topic[march] ? topic[march]+'k' : '?',
            _dec         = topic[dec] + 'k',
            _annual_incr = topic[annual_incr] ? ', annual: +' + topic[annual_incr] + '%' : ''
            _incr        = topic[march_dec_incr] === undefined ? '' : ' (+' + topic[march_dec_incr] + '%' + _annual_incr + ')';

        return '<li><a href="' + topic[url] + '">' + topic[name] + '</a>: '
                + _march + ' → ' + _dec + _incr + ', ' + topic[dec_unanswered_q] + ' UQ</li>\n';

    }

    var incr_topics = topics
                        .filter(function( t ) { return !!t[annual_incr]; })
                        .sort(function( t1, t2 ) {
                            return t2[march_dec_incr] - t1[march_dec_incr];
                        }),

        top_5_incr    = incr_topics.slice(0, 5),
        bottom_5_incr = incr_topics.slice(-5);

    bottom_5_incr.reverse();

    var s = '<b><u>Top 50 topics by popularity:</b></u><br /><br />\n'
            
          + '<ul>' + topics.slice(0, 50).map( make_string ).join('\n') + '</ul>'

          + '<br /><br /><b><u>Top 5 most improved topics:</b></u><br /><br />\n'

          + '<ul>' + top_5_incr.map( make_string ).join('\n') + '</ul>'

          + '<br /><br /><b><u>Top 5 least improved topics:</b></u><br /><br />\n'

          + '<ul>' + bottom_5_incr.map( make_string ).join('\n') + '</ul>\n'

          + '<br /><br />';


    // R plotting

    // -- march popularity / improvement

    var march_popularity = [],
        dec_popularity = [],
        march_dec_improvements = [],
        annual_improvements = [],
        dec_uq = [],

        sort_fn = function( a, b ) { return a-b; };

    $.each( topics, function( i, t ) {

        if ( t[march] !== undefined ) {

            march_popularity.push( t[march] );
            dec_popularity.push( t[dec] );
            dec_uq.push( t[dec_unanswered_q] );

            march_dec_improvements.push( +t[march_dec_incr] );

            if ( t[annual_incr] !== undefined ) {

                annual_improvements.push( t[annual_incr] );

            }

        }

    });

    var smdi = march_dec_improvements, // smdi = [s]orted [m]arch [d]ec [i]mprovements
        ai   = annual_improvements; // ai = [a]nnual [i]mprovements
    smdi.sort( sort_fn  );
    ai.sort( sort_fn );

    var l_smdi = smdi.length,
        l_ai   = ai.length,

        median_improvement        = l_smdi % 2 ? smdi[Math.ceil(l_smdi)] : (smdi[ l_smdi/2 ] + smdi[ l_smdi/2 + 1 ])/2,
        median_annual_improvement = l_ai   % 2 ?   ai[Math.ceil(l_ai  )] : (  ai[ l_ai  /2 ] +   ai[ l_ai  /2 + 1 ])/2;

    s += 'The median improvement is +' + median_improvement + '%'
       + ' and the annual median improvement is ' + median_annual_improvement + '%.';


    console.log( 'R plotting:' );
    console.log( '' );
    console.log( 'March', '<- c(' + march_popularity.join(',')+')' );
    console.log( 'March_Dec_Improvements', '<- c(' + march_dec_improvements.join(',')+')' );
    console.log( '' );
    console.log( 'UQ', '<- c(' + dec_uq.join(',')+')' );
    console.log( 'Dec', '<- c(' + dec_popularity.join(',')+')' );

    document.body.innerHTML = s;

})();
