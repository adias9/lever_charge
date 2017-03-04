Rails.application.routes.draw do
  get 'charge/index'
  post 'charge' => 'charge#charge_card'

  root 'charge#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
