#! /usr/bin/env ruby
# -*- coding: UTF-8 -*-

require 'json'

#input = 'rates2.json'
input = 'rr.json'

users = JSON.parse(File.read(input)).uniq {|u| u['url']}
users.delete_if { |u| u['rate'] == '' or (u['raw'] && u['raw'].length != 2) }
users.sort_by! { |e| [e['rate'].to_i, e['price'] ? e['price'] : -1 ] }
users.reverse!

File.open('rates.html', 'w') do |f|
  f.write('<head></head><body><ol>')
  users.each do |u|
    rt = u['rate'].split(' ')[0]
    r = u['raw']

    f.write("<li><a href=\"http://www.quora.com#{u['url']}\">#{u['name']}</a>" +
            " - #{rt}")
    if r
      p = u['price'] == 0 ? 'free' : u['price']
      f.write(" (#{r[0]}/#{r[1]}, price: #{p})")
    end

    f.write("</li>")
  end
  f.write('</ol>')
end
