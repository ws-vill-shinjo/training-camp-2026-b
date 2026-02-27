module Api
  module Auth
    class SessionsController < ApplicationController
      # GET /api/auth/me
      # セッション中のユーザー情報を返す
      def show
        if session[:user_name]
          render json: { user: { name: session[:user_name] } }
        else
          render json: { user: nil }
        end
      end

      # POST /api/auth/login
      # ログイン（パスワードは "password" 固定）
      def create
        name = params[:name].to_s.strip
        password = params[:password].to_s

        if name.blank?
          return render json: { error: "名前を入力してください" }, status: :unprocessable_entity
        end

        if password != "password"
          return render json: { error: "パスワードが違います" }, status: :unauthorized
        end

        session[:user_name] = name
        render json: { user: { name: name } }
      end

      # DELETE /api/auth/logout
      # ログアウト（セッションを破棄）
      def destroy
        session.delete(:user_name)
        render json: { ok: true }
      end
    end
  end
end
