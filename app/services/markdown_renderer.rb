require "rouge"
require "redcarpet"

class MarkdownRenderer
  class HTMLWithRouge < Redcarpet::Render::HTML
    def block_code(code, language)
      language ||= "text"
      formatter = Rouge::Formatters::HTML.new
      lexer = Rouge::Lexer.find_fancy(language, code) || Rouge::Lexers::PlainText.new
      formatted = formatter.format(lexer.lex(code))
      %(<pre><code class="highlight language-#{language}">#{formatted}</code></pre>)
    end
  end

  class << self
    def render(content)
      renderer = HTMLWithRouge.new(
        hard_wrap: true,
        link_attributes: { target: "_blank", rel: "noopener noreferrer" }
      )

      markdown = Redcarpet::Markdown.new(renderer,
        fenced_code_blocks: true,
        tables: true,
        autolink: true,
        strikethrough: true,
        superscript: true,
        underline: true,
        highlight: true,
        quote: true,
        footnotes: true,
        no_intra_emphasis: true
      )

      markdown.render(content).html_safe
    end
  end
end
