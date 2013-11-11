#! /usr/bin/env python
# -*- coding: UTF-8 -*-

# This script assumes that a file exists in ../data/tw-topics.json containing
# data about Top Writers' topics (extracted with ./topwriters-topics.js)
# It generates per-topic lists of users in tw-topics.out.html. Due to feedback,
# an user can now be present under multiple topics if they're really active
# in all of them.

import json
import codecs
from copy import deepcopy as dp
SOURCE = '../data/tw-topics.json'

# Topics other than the primary one are included if the user wrote N answers in
# them, where N > MIN and N > (number of answers in primary topic)*RATIO
MIN_ANS = 90
RATIO = 0.60
MAX_PER_TOPIC = 10 # max number of users per topic

def main():
    f = codecs.open(SOURCE, 'r', 'utf-8')
    users = json.load(f)
    udict = {} # list of each user's topics
    f.close()

    topics = {}
    ufmt = u'<li><a href="%s">%s</a> (<a href="%s/answers%s">%d answers</a>)</li>\n'

    for u in users:
        if (len(u['topics']) == 0):
            print "No topics for %s" % u['name']
            continue

        u['topics'].sort(key=lambda t:t['count'], reverse=True)
        primary = u['topics'][0]
        pc = primary['count']
        u2 = dp(u)
        u2['count'] = primary['count']
        del u2['topics']
        topics.setdefault(primary['name'], {'href':primary['href'],'users':[]})
        topics[primary['name']]['users'].append(u2)

        udict[u['href']] = [primary['href']]

        threshold = pc*RATIO
        for tp in u['topics'][1:]:
            if tp['count'] < MIN_ANS or tp['count'] < threshold:
                continue
            u3 = dp(u2)
            u3['count'] = tp['count']
            topics.setdefault(tp['name'], {'href':tp['href'],'users':[]})
            topics[tp['name']]['users'].append(u3)
            udict[u['href']].append(tp['href'])

    topics = [t for t in topics.iteritems()]
    topics.sort(key=lambda t:t[0].lower())
    for _,v in topics:
        v['users'].sort(key=lambda u:u['count'], reverse=True)

    # This remove people from popular topics if they are included anywhere else
    # to have smaller lists (i.e. < MAX_PER_TOPIC) for each topic.
    for t,v in topics:
        for i,u in enumerate(dp(v['users'])):
            if i >= MAX_PER_TOPIC and len(udict[u['href']]) > 1:
                udict[u['href']].remove(v['href'])
                v['users'].remove(u)

    # stats
    stats = {'users': 0,'average':0,'median':0}
    tss = []

    for u,ts in udict.iteritems():
        l = len(ts)
        tss.append(l)
        stats['users'] += 1
        stats['average'] += l
        #print "%25s: %2d" % (u, len(ts))

    tss.sort(reverse=True)
    stats['median'] = tss[len(tss)/2]
    stats['average'] /= (0.0+stats['users'])
    del tss
    del udict
    # /stats

    f = codecs.open('tw-topics.out.html', 'w', 'utf-8')
    f.write('<html><head><meta charset="utf-8"/></head><body>')
    cpt = 0
    for t,v in topics:
        href = v['href']
        f.write('<h1><a href="%s"/>%s</a></h1>\n' % (href, t))
        f.write('<ul>\n')
        for i,u in enumerate(v['users']):
            f.write(ufmt % (u['href'], u['name'], u['href'], href, u['count']))
        f.write('</ul>\n<br/>\n')

    f.write('</body></html>')
    f.close()
    fmt = "Wrote %d users (average topics/user: %.2f, med: %.2f)."
    print fmt % (stats['users'], stats['average'], stats['median'])

if __name__ == '__main__':
    main()
