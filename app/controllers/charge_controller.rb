class ChargeController < ApplicationController
  def index
  end

  def charge_card
  	# Set your secret key: remember to change this to your live secret key in production
		# See your keys here: https://dashboard.stripe.com/account/apikeys
  	Stripe.api_key = ENV["STRIPE_API_KEY"]

  	@amount = params[:amount]

  	puts "TEST RUNNING"
  	puts "userID: " + String(params[:user_id])
  	puts "projectID: " + String(params[:project_id])

	  @amount = @amount.gsub('$', '').gsub(',', '')

	  begin
	    @amount = Float(@amount).round(2)
	  rescue
	    flash[:error] = 'Charge not completed. Please enter a valid amount in USD ($).'
	    puts "error bro1\n"
	    redirect_to root_path
	    return
	  end

	  @amount = (@amount * 100).to_i # Must be an integer!

	  if @amount < 100
	    flash[:error] = 'Charge not completed. Donation amount must be at least $1.'
	    puts "error bro2\n"
	    redirect_to root_path
	    return
	  end

	  Stripe::Charge.create(
	    :amount => @amount,
	    :currency => 'usd',
	    :source => params[:stripeToken],
	    :description => 'Lever App Donation'
	  )
	  
	  puts "CHARGE FIREBASE HERE FOR: $" + String(@amount / 100)

	  # wasGood = system( "ls" )
	  test1 = system( "node firebase.js ")


	  rescue Stripe::CardError => e
	    flash[:error] = e.message
	    puts "error bro3\n"
	    redirect_to root_path
	  
	end
end
