class ChargeController < ApplicationController
  def index
  end

  def charge_card
  	# Set your secret key: remember to change this to your live secret key in production
	# See your keys here: https://dashboard.stripe.com/account/apikeys
	Stripe.api_key = ENV["STRIPE_API_KEY"]


	# Token is created using Stripe.js or Checkout!
	# Get the payment token submitted by the form:
	token = params[:stripeToken]
	email = params[:stripeEmail]

	# # Create a Customer:
	# customer = Stripe::Customer.create(
	#   :email => "paying.user@example.com",
	#   :source => token,
	# )

	# Charge the user's card:
	charge = Stripe::Charge.create(
	  :amount => 1000,
	  :currency => "usd",
	  :description => "Donation on Lever App",
	  :source => token,
	)
  end
end
