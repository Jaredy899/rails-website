class PostsController < ApplicationController
  def index
    @posts = Post.sorted
  end

  def show
    @post = Post.find_by_slug(params[:id])
    if @post.nil?
      raise ActionController::RoutingError, "Not Found"
    end
  end
end
