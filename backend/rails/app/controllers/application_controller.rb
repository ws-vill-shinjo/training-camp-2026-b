class ApplicationController < ActionController::API
  # API モードでも Cookie（セッション）を使えるようにする
  include ActionController::Cookies
end
