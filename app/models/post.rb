class Post
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :title, :string
  attribute :description, :string
  attribute :pub_date, :date
  attribute :draft, :boolean, default: false
  attribute :slug, :string
  attribute :content, :string
  attribute :category, :string
  attribute :tags, default: []

  POSTS_PATH = Rails.root.join("content", "blog")

  class << self
    def all
      @all ||= load_all_posts
    end

    def published
      all.reject(&:draft)
    end

    def sorted
      published.sort_by(&:pub_date).reverse
    end

    def find_by_slug(slug)
      clean_slug = clean_slug(slug)
      all.find { |post| clean_slug(post.slug) == clean_slug }
    end

    def reload!
      @all = nil
    end

    private

    def load_all_posts
      return [] unless POSTS_PATH.exist?

      Dir.glob(POSTS_PATH.join("**", "*.md")).map do |file_path|
        parse_post(file_path)
      end.compact
    end

    def parse_post(file_path)
      content = File.read(file_path)
      return nil unless content.start_with?("---")

      parts = content.split("---", 3)
      return nil if parts.length < 3

      frontmatter = YAML.safe_load(parts[1], permitted_classes: [ Date, Time ])
      body = parts[2].strip

      # Generate slug from file path
      relative_path = Pathname.new(file_path).relative_path_from(POSTS_PATH).to_s
      slug = relative_path.sub(/\.md$/, "")

      new(
        title: frontmatter["title"],
        description: frontmatter["description"],
        pub_date: frontmatter["pubDate"],
        draft: frontmatter["draft"] || false,
        category: frontmatter["category"],
        tags: frontmatter["tags"] || [],
        slug: slug,
        content: body
      )
    end

    def clean_slug(original_slug)
      parts = original_slug.to_s.split("/")
      last_segment = parts.last || original_slug.to_s

      # Remove leading date (YYYY-MM-DD-) or numeric prefixes (e.g., 12-)
      without_prefixes = last_segment
        .gsub(/^\d{4}-\d{2}-\d{2}-/, "")
        .gsub(/^\d+-/, "")

      # Basic slugify: lowercase, replace non-alphanumerics with '-', collapse, and trim '-'
      without_prefixes
        .downcase
        .gsub(/[^a-z0-9-]+/, "-")
        .gsub(/--+/, "-")
        .gsub(/^-+|-+$/, "")
    end
  end

  def clean_slug
    self.class.send(:clean_slug, slug)
  end

  def rendered_content
    @rendered_content ||= MarkdownRenderer.render(content)
  end

  def formatted_date
    pub_date&.strftime("%B %d, %Y")
  end
end
