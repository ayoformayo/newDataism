class CitiesController < ApplicationController
  def new_york
    render :new_york
  end

  def liquor_licenses
    render :liquor_licenses
  end

  def mapped_communities
    render :chicago_languages
  end
end
