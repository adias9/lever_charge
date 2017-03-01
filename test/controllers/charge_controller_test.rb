require 'test_helper'

class ChargeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get charge_index_url
    assert_response :success
  end

end
