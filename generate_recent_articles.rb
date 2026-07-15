require 'yaml'
require 'time'

ROOT = File.expand_path(__dir__)
DOC_GLOB = File.join(ROOT, '_docs', '**', '*.md')
OUTPUT = File.join(ROOT, '_data', 'recent_articles.yml')
LIMIT = 3

def front_matter_for(path)
  content = File.read(path)
  match = content.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  return {} unless match

  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
end

def updated_at_for(path)
  relative_path = path.delete_prefix(ROOT + '/')
  output = `git log -1 --format=%cI -- #{Shellwords.escape(relative_path)}`.strip
  return nil if output.empty?

  Time.iso8601(output)
end

def url_for(path)
  relative_path = path.delete_prefix(File.join(ROOT, '_docs'))
  relative_path.sub(/\.md\z/, '')
end

require 'shellwords'

articles = Dir[DOC_GLOB].map do |path|
  metadata = front_matter_for(path)
  updated_at = updated_at_for(path)
  next if updated_at.nil?

  authors = Array(metadata['authors']).map { |author| author.to_s.strip }.reject(&:empty?)

  {
    'title' => metadata['title'] || File.basename(path, '.md'),
    'url' => url_for(path),
    'path' => path.delete_prefix(ROOT + '/'),
    'authors' => authors,
    'updated_at' => updated_at.iso8601,
  }
end

articles.compact!

articles.sort_by! { |article| article['updated_at'] }
articles.reverse!
articles = articles.first(LIMIT)

File.write(OUTPUT, articles.to_yaml)