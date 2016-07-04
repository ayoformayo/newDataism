namespace :marvel do
  desc "Import CSV file, usage: rake scout_location:run_import FILE=<path to file>"
  task generate_social_graph: :environment do
  	MarvelDataService.new.process!
  end
end