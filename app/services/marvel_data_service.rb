require 'digest/md5'
require 'net/http'

class MarvelDataService
  CHARACTERS_URL = 'http://gateway.marvel.com:80/v1/public/characters'
  SERIES_URL = 'http://gateway.marvel.com:80/v1/public/series'

  attr_accessor :node_arr

  def initialize
    @node_arr = []
  end

  def process!
    graph = calculate_graph!
    File.open('lib/data/marvel_graph.json', 'w'){ |f| f.write JSON.pretty_generate graph}
  end

  def self.fetch_series
    limit = 100
    offset = 0
    unfinished = true
    arr = []
    while unfinished
      this_i = offset * limit
      ts = Time.now.to_i
      uri = URI(SERIES_URL)
      pub = ENV['MARVEL_PUBLIC_KEY']
      priv = ENV['MARVEL_PRIVATE_KEY']
      combine = ts.to_s+priv+pub
      hash = Digest::MD5.hexdigest(combine)
      params = { apikey: ENV['MARVEL_API_KEY'], limit: limit, offset: this_i, hash: hash, ts: ts }
      uri.query = URI.encode_www_form(params)
      res = Net::HTTP.get_response(uri)
      p res.message
      if res.code == '200'
        parsed = JSON.parse(res.body)
        arr.concat(parsed['data']['results'])
        File.open('lib/data/marvel_series.json', 'w'){ |f| f.write JSON.pretty_generate arr }
        offset += 1
        break if parsed['data']['results'].length == 0
      end
    end
  end

  def characters
    @characters ||= JSON.parse(File.open('lib/data/marvel_characters.json').read)
  end

  def series
    @series ||= JSON.parse(File.open('lib/data/marvel_series.json').read)
  end

  def series_with_characters
    @series_with_characters ||= series.select{ |ser| ser['characters']['items'].length > 0 }
  end

  def character_nodes
    @character_nodes ||= series_with_characters.map{ |ser| ser['characters']['items'] }
  end

  def calculate_graph!
    nodes = character_nodes.flatten.uniq
    links = recursive_method(character_nodes)
    { nodes: nodes, links: links }
  end

  def brute_force
    cloned = character_nodes.dup
    node_arr = []
    while cloned.length > 0
      char_arr = cloned.slice!(0)
      while char_arr.length > 1
        character = char_arr.slice!(0)
        char_arr.each do |link_char|
          node = node_arr.select{ |h| h.values.include?(link_char) && h.values.include?(character)}.first
          if node
            node[:weight] += 1
          elsif [link_char, character].all? {|x| x.present?} 
            node_arr << {from: character, to: link_char, weight: 1}
          end
        end
      end
    end
    node_arr
  end

  def recursive_method(array)
    populuated_arr = array.select{|char_arr| char_arr.length > 1}
    return @node_arr if populuated_arr.length == 0
    with_char, without_char = populuated_arr.partition{|char_arr| char_arr.include?(array[0][0])}
    while with_char.length > 0
      char_arr = with_char.slice!(0)
      analyze_char_array(char_arr)
    end
    recursive_method(without_char)
  end

  def analyze_char_array(array)
    return if array.length <= 1
    character = array.slice!(0)
    p character
    array.each do |link_char|
      node = @node_arr.select{ |h| h.values.include?(link_char) && h.values.include?(character)}.first
      if node
        node[:value] += 1
      elsif [link_char, character].all? {|x| x.present?} 
        @node_arr << {source: character, target: link_char, value: 1}
      end
    end
    analyze_char_array(array)
  end
end