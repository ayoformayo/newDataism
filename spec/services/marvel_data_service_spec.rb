require 'rails_helper'
require 'benchmark'

RSpec.describe MarvelDataService do
  subject(:service){ MarvelDataService.new }
  let(:character_array){ [['Ant-Man', 'Iron Man'], ['Spiderman', 'Captain America', 'Hawkeye'], ['Spiderman', 'Iron Man'], ['Spiderman', 'Iron Man', 'Captain America']] }
  let(:nodes) { service.character_nodes.flatten.uniq }
  let(:character_nodes) { service.character_nodes }
  let(:expected_output){
    { nodes: nodes,
      links: [
        { from: 'Ant-Man', to: 'Iron Man', weight: 1},
        { from: 'Spiderman', to: 'Captain America', weight: 2},
        { from: 'Spiderman', to: 'Hawkeye', weight: 1},
        { from: 'Spiderman', to: 'Iron Man', weight: 2},
        { from: 'Captain America', to: 'Hawkeye', weight: 1},
        { to: 'Captain America', from: 'Iron Man', weight: 1},
      ]
    }
  }

  describe 'foo' do
    it 'bard' do
      # service.character_nodes.each {|node| p node}
      expect(service).to receive(:character_nodes).at_least(1).times.and_return(service.character_nodes.take(10))
      graph = service.calculate_graph!
      # graph[:links].each do |link_hash|
        # p link_hash
        # {from: link_hash[:from]['name']}
      # end

      # expect(graph[:nodes]).to match_array(expected_output[:nodes])
      # expect(graph[:links]).to match_array(expected_output[:links])
    end
    it 'benchmarks the performances' do
      Benchmark.bmbm do |x|
        x.report("brute_force") { service.brute_force }
        x.report("recursive_method")  { service.recursive_method(character_nodes)  }
      end
    end
  end
end
