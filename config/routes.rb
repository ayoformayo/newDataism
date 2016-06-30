Rails.application.routes.draw do
  get "/marvel_social_graph"           => "pop_culture#marvel_social_network"
  get "/liquor_licenses"               => "cities#liquor_licenses"
  get "/maps/new_york"                 => "cities#new_york"
  get "/maps/chicago_communities"      => "cities#mapped_communities"
  get "/slack"                         => "urban_bound#slack"
  get "/maps/ub_heat_map"              => "urban_bound#ub_heat_map"
  get "/(:slug)"                       => "welcome#index"
  root to: "welcome#index"
end
