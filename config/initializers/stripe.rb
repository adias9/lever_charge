require "stripe"
if(Rails.env == 'development' || Rails.env == 'staging')
  Rails.configuration.stripe = {
  	:publishable_key => ENV['STRIPE_API_KEY_PK_TEST'],
  	:secret_key      => ENV['STRIPE_API_KEY_SK_TEST']
  }
elsif(Rails.env == 'production')
  Rails.configuration.stripe = {
  	:publishable_key => ENV['STRIPE_API_KEY_PK_PROD'],
  	:secret_key      => ENV['STRIPE_API_KEY_SK_PROD']
  }
end

Stripe.api_key = Rails.configuration.stripe[:secret_key]