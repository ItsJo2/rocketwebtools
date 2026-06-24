import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { marked } from 'marked';

interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
  author: string;
  tags: string[];
}

interface BlogPostProps {
  slug: string;
  isDark: boolean;
  onBack: () => void;
  onOpenTool: (toolId: string) => void;
  onOpenPost: (slug: string) => void;
}

interface Suggestion {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Icons;
}

const CATEGORY_SUGGESTIONS: Record<string, Suggestion[]> = {
  'Developer Tools': [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Validate, format, and structure raw JSON blocks instantly.',
      icon: 'Terminal',
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder',
      description: 'Convert plain text to base64 or decode back securely.',
      icon: 'Lock',
    },
  ],
  'Image Tools': [
    {
      id: 'image-converter',
      name: 'Image Converter',
      description: 'Convert between PNG, JPEG, WebP, BMP formats offline.',
      icon: 'RefreshCw',
    },
    {
      id: 'image-cropper',
      name: 'Image Cropper',
      description: 'Precision crop images to custom dimensions or aspect ratios.',
      icon: 'Crop',
    },
  ],
  'Security': [
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate robust, high-entropy cryptographic passwords locally.',
      icon: 'Key',
    },
  ],
  'Finance Tools': [
    {
      id: 'stripe-fee-calculator',
      name: 'Stripe Fee Calculator',
      description: 'Formulate credit card transaction rates and required invoices.',
      icon: 'Wallet',
    },
    {
      id: 'paypal-fee-calculator',
      name: 'PayPal Fee Calculator',
      description: 'Calculate merchant fee deductions and net proceeds.',
      icon: 'CreditCard',
    },
  ],
  'General Utilities': [
    {
      id: 'qr-code-generator',
      name: 'QR Code Generator',
      description: 'Design and export vector QR codes with colors and custom size.',
      icon: 'QrCode',
    },
  ],
};

export function BlogPost({ slug, isDark, onBack, onOpenTool, onOpenPost }: BlogPostProps) {
  const [meta, setMeta] = useState<BlogPostMeta | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [allPosts, setAllPosts] = useState<BlogPostMeta[]>([]);

  const extractHeadings = (markdown: string) => {
    const lines = markdown.split('\n');
    return lines
      .filter(line => line.startsWith('## '))
      .map((line, idx) => ({
        id: `heading-${idx}`,
        text: line.replace('## ', '').trim()
      }));
  };

  const calculateReadTime = (text: string) => {
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const t = isDark ? {
    panelBg: 'bg-[#141414]',
    border: 'border-white/5',
    borderStrong: 'border-white/10',
    text: 'text-gray-300',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    textMuted: 'text-gray-550',
    badgeBg: 'bg-gray-500/10',
    cardBg: 'bg-[#121212]',
    cardHover: 'hover:border-orange-500/30 hover:bg-[#161616]',
  } : {
    panelBg: 'bg-gray-100',
    border: 'border-gray-200',
    borderStrong: 'border-gray-200',
    text: 'text-gray-700',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-550',
    textMuted: 'text-gray-400',
    badgeBg: 'bg-gray-200',
    cardBg: 'bg-white',
    cardHover: 'hover:border-orange-500/30 hover:bg-gray-50',
  };

  useEffect(() => {
    setIsLoading(true);

    // Fetch the metadata first
    fetch('/posts/posts.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load posts index');
        return res.json();
      })
      .then((posts: BlogPostMeta[]) => {
        setAllPosts(posts);
        const found = posts.find((p) => p.slug === slug);
        if (found) {
          setMeta(found);
        }
        return fetch(`/posts/${slug}.md`);
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load markdown body');
        return res.text();
      })
      .then((markdownText) => {
        setRawMarkdown(markdownText);
        const extracted = extractHeadings(markdownText);
        setHeadings(extracted);

        let processedMarkdown = markdownText;
        let headingIndex = 0;
        processedMarkdown = processedMarkdown.replace(/^## (.+)$/gm, (_, title) => {
          return `## <span id="heading-${headingIndex++}">${title}</span>`;
        });

        const parsedHtml = marked.parse(processedMarkdown) as string;
        setHtmlContent(parsedHtml);
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        console.error('Error fetching blog post:', err);
        setHtmlContent('<h2>Error Loading Post</h2><p>We were unable to load the content for this article. Please check your network or try returning to the index.</p>');
        setIsLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Developer Tools':
        return isDark 
          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
          : 'bg-indigo-50 text-indigo-750 border border-indigo-100';
      case 'Image Tools':
        return isDark 
          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
          : 'bg-rose-50 text-rose-750 border border-rose-100';
      case 'Security':
        return isDark 
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
          : 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Finance Tools':
        return isDark 
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
          : 'bg-amber-50 text-amber-800 border border-amber-100';
      case 'General Utilities':
        return isDark 
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
          : 'bg-cyan-50 text-cyan-700 border border-cyan-100';
      default:
        return isDark 
          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
          : 'bg-orange-50 text-orange-750 border border-orange-100';
    }
  };

  // Get recommendations based on category
  const recommendations = meta ? CATEGORY_SUGGESTIONS[meta.category] || [] : [];

  // Pick the 2 most recent ones that are not the current slug
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const twitterUrl = meta ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(`https://www.rocketwebtools.com?page=blog&post=${slug}`)}` : '';
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.rocketwebtools.com?page=blog&post=${slug}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.rocketwebtools.com?page=blog&post=${slug}`)}`;

  const renderShareBar = () => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-xs font-mono font-bold uppercase tracking-widest mr-1 ${
        isDark ? 'text-gray-500' : 'text-gray-400'
      }`}>Share</span>
      
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          isDark 
            ? 'bg-white/3 border-white/8 text-gray-300 hover:text-white hover:bg-white/8' 
            : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}>
        <Icons.Twitter className="w-3.5 h-3.5" />
        X / Twitter
      </a>

      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          isDark 
            ? 'bg-white/3 border-white/8 text-gray-300 hover:text-white hover:bg-white/8' 
            : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}>
        <Icons.Linkedin className="w-3.5 h-3.5" />
        LinkedIn
      </a>

      <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          isDark 
            ? 'bg-white/3 border-white/8 text-gray-300 hover:text-white hover:bg-white/8' 
            : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}>
        <Icons.Facebook className="w-3.5 h-3.5" />
        Facebook
      </a>

      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(`https://www.rocketwebtools.com?page=blog&post=${slug}`);
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          linkCopied
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : isDark 
              ? 'bg-white/3 border-white/8 text-gray-300 hover:text-white hover:bg-white/8' 
              : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}>
        {linkCopied 
          ? <><Icons.Check className="w-3.5 h-3.5" /> Copied!</>
          : <><Icons.Link className="w-3.5 h-3.5" /> Copy Link</>
        }
      </button>
    </div>
  );

  // Scoped styling for rendered markdown content
  const cssStyles = `
    .blog-content h2 {
      color: ${isDark ? '#ffffff' : '#111827'};
      font-weight: 700;
      font-size: 1.25rem;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }
    .blog-content p {
      color: ${isDark ? '#d1d5db' : '#374151'};
      line-height: 1.625;
      margin-bottom: 1rem;
    }
    .blog-content strong {
      color: ${isDark ? '#ffffff' : '#111827'};
      font-weight: 600;
    }
    .blog-content code {
      background-color: ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6'};
      color: ${isDark ? '#fb923c' : '#ea580c'};
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    .blog-content ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }
    .blog-content li {
      color: ${isDark ? '#d1d5db' : '#374151'};
      line-height: 1.625;
      margin-bottom: 0.375rem;
    }
  `;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-transparent">
        <div 
          className="h-full bg-orange-500 transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="space-y-8 font-sans max-w-3xl lg:max-w-5xl mx-auto" id="blog-post-display-container">
        {/* Dynamic Style Injection */}
        <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

        {/* Header Breadcrumbs */}
        <div className={`flex items-center justify-between border-b ${t.border} pb-4`}>
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-2 text-xs font-semibold p-2 px-4 ${t.panelBg} border ${t.borderStrong} hover:border-orange-550/40 rounded-full ${t.text} hover:${t.textPrimary} transition-all cursor-pointer shadow-sm`}
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Articles</span>
          </button>
          <span className={`text-[10px] font-mono ${t.textMuted} uppercase tracking-widest ${t.badgeBg} px-2.5 py-1 rounded`}>
            Article View
          </span>
        </div>

        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <Icons.Loader className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <p className={`text-xs font-mono ${t.textMuted}`}>RETRIEVING ARTICLE CONTENT...</p>
          </div>
        ) : (
          <article className="space-y-6 text-left">
            {meta && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getCategoryBadgeClass(meta.category)}`}>
                    {meta.category}
                  </span>
                  <span className={t.textMuted}>&bull;</span>
                  <span className={`${t.textSecondary} flex items-center gap-1`}>
                    <Icons.Calendar className="w-3.5 h-3.5" />
                    {formatDate(meta.date)}
                  </span>
                  <span className={t.textMuted}>&bull;</span>
                  <span className={`${t.textSecondary} flex items-center gap-1`}>
                    <Icons.Clock className="w-3.5 h-3.5" />
                    {meta.readTime || calculateReadTime(rawMarkdown)}
                  </span>
                </div>

                <h1 className={`text-3xl sm:text-4xl font-black ${t.textPrimary} tracking-tight leading-tight`}>
                  {meta.title}
                </h1>

                {/* Tags block inside meta row */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 ${t.badgeBg} ${t.textSecondary} rounded`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-2.5 pt-3 border-b ${t.border} pb-4`}>
                  <div className="w-7 h-7 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <div className="text-xs">
                    <p className={`font-semibold ${t.textPrimary}`}>{meta.author || 'Rocket Web Tools Team'}</p>
                    <p className={t.textMuted}>Content Editorial Desk</p>
                  </div>
                </div>
              </div>
            )}

            {/* Share bar below the title/meta row and above the markdown content */}
            <div className="py-2 pb-4 border-b border-dashed border-gray-200 dark:border-white/5">
              {renderShareBar()}
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
              {/* Left Column: Main content area */}
              <div className="space-y-6 min-w-0">
                {/* Rendered HTML */}
                <div 
                  className="blog-content leading-relaxed text-sm sm:text-base space-y-4"
                  dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />

                {/* Share bar repeated at the very bottom of the post after the content */}
                <div className="py-4 border-t border-b border-dashed border-gray-200 dark:border-white/5">
                  {renderShareBar()}
                </div>

                {/* Related Tools CTA Box */}
                {recommendations.length > 0 && (
                  <div className={`p-6 ${t.panelBg} border ${t.border} rounded-2xl space-y-4 mt-12`}>
                    <div className="space-y-1">
                      <h3 className={`text-base font-black ${t.textPrimary} tracking-tight flex items-center gap-2`}>
                        <Icons.Wrench className="w-4 h-4 text-orange-500" />
                        Try Related Web Utilities
                      </h3>
                      <p className={`text-xs ${t.textSecondary}`}>
                        Execute these tasks right now entirely inside your browser sandbox.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recommendations.map((tool) => {
                        const ToolIcon = Icons[tool.icon as keyof typeof Icons] || Icons.Wrench;
                        return (
                          <div 
                            key={tool.id} 
                            className={`p-4 rounded-xl border ${t.border} ${t.cardBg} ${t.cardHover} transition-all duration-200 flex flex-col justify-between gap-3`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                  <ToolIcon className="w-4 h-4" />
                                </div>
                                <h4 className={`text-xs font-bold ${t.textPrimary}`}>{tool.name}</h4>
                              </div>
                              <p className={`text-[11px] ${t.textSecondary} leading-normal`}>
                                {tool.description}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenTool(tool.id)}
                              className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors mt-1"
                            >
                              Launch Tool
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* You might also like section */}
                {relatedPosts.length > 0 && (
                  <div className={`rounded-2xl border p-6 space-y-4 ${
                    isDark ? 'bg-[#0f0f0f] border-white/5' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      You might also like
                    </h3>
                    <div className="space-y-3">
                      {relatedPosts.map(post => (
                        <button
                          key={post.slug}
                          type="button"
                          onClick={() => onOpenPost(post.slug)}
                          className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${
                            isDark 
                              ? 'border-white/5 hover:border-orange-500/20 hover:bg-white/2' 
                              : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/30'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold leading-snug ${
                              isDark ? 'text-gray-200' : 'text-gray-800'
                            }`}>{post.title}</p>
                            <p className={`text-[11px] mt-1 ${
                              isDark ? 'text-gray-500' : 'text-gray-400'
                            }`}>{post.readTime} · {post.category}</p>
                          </div>
                          <Icons.ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isDark ? 'text-gray-600' : 'text-gray-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Table of Contents Sidebar */}
              <aside className="hidden lg:block">
                <div className={`sticky top-24 rounded-2xl border p-4 space-y-1 ${
                  isDark 
                    ? 'bg-[#0f0f0f] border-white/5' 
                    : 'bg-white border-gray-200'
                }`}>
                  <p className={`text-[10px] font-bold font-mono uppercase tracking-widest mb-3 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>On this page</p>
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-xs py-1 px-2 rounded-lg transition-all ${
                        isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </article>
        )}
      </div>
    </>
  );
}
