class UrbanBoundController < ApplicationController
  # def show
  #   render :show
  # end

  def slack
    render :slack
  end

  def ub_heat_map
    render :ub_heat_map
  end
end
