#! /usr/bin/env python
# -*- coding: UTF-8 -*-

import json
import codecs
from copy import deepcopy as dp
FN='../data/tw-topics.json'

def main():
    f = open(FN, 'r')
    users = json.load(f)
    f.close()

    topics = {}
    ufmt = u'<li><a href="%s">%s</a> (<a href="%s/answers%s">%d answers</a>)</li>\n'

    for u in users:
        if (len(u['topics']) == 0):
            print "No topics for %s" % u['name']
            continue

        u['topics'].sort(key=lambda t:t['count'], reverse=True)
        primary = u['topics'][0]
        pn = primary['name']
        u2 = dp(u)
        u2['count'] = primary['count']
        del u2['topics']
        topics.setdefault(pn, {'href':primary['href'],'users':[]})
        topics[pn]['users'].append(u2)

    topics = [t for t in topics.iteritems()]
    topics.sort(key=lambda t:t[0].lower())
    f = codecs.open('tw-topics.out.html', 'w', 'utf-8')
    for t,v in topics:
        href = v['href']
        f.write('<h1><a href="%s"/>%s</a></h1>\n' % (href, t))
        f.write('<ul>\n')
        v['users'].sort(key=lambda u:u['count'], reverse=True)
        for u in v['users']:
            f.write(ufmt % (u['href'], u['name'], u['href'], href, u['count']))
        f.write('</ul>\n<br/>\n')

    f.close()

if __name__ == '__main__':
    main()
