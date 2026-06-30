import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
  author: string;
  tags: string[];
}

interface BlogPageProps {
  onBack: () => void;
  onOpenPost: (slug: string) => void;
  isDark: boolean;
}

export function BlogPage({ onBack, onOpenPost, isDark }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const t = isDark ? {
    panelBg: 'bg-[#141414]',
    border: 'border-white/5',
    borderStrong: 'border-white/10',
    text: 'text-gray-300',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    textMuted: 'text-gray-500',
    badgeBg: 'bg-gray-500/10',
    cardBg: 'bg-[#121212]',
    cardHover: 'hover:border-orange-500/30 hover:bg-[#161616]',
    inputBg: 'bg-[#111111]',
    inputText: 'text-white',
  } : {
    panelBg: 'bg-gray-100',
    border: 'border-gray-200',
    borderStrong: 'border-gray-200',
    text: 'text-gray-700',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-550',
    textMuted: 'text-gray-450',
    badgeBg: 'bg-gray-200',
    cardBg: 'bg-white',
    cardHover: 'hover:border-orange-500/30 hover:bg-gray-50',
    inputBg: 'bg-white',
    inputText: 'text-gray-900',
  };

  useEffect(() => {
    setIsLoading(true);
    fetch('/posts/posts.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load posts');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load posts index', err);
        setIsLoading(false);
      });
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
          : 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'Image Tools':
        return isDark 
          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
          : 'bg-rose-50 text-rose-700 border border-rose-100';
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

  const uniqueCategories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filterTabActive = 'bg-orange-600 text-white border-orange-500 shadow-md';
  const filterTabInactive = isDark
    ? 'bg-white/2 border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
    : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100';

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto" id="blog-system-view">
      {/* Header Breadcrumbs */}
      <div className={`flex items-center justify-between border-b ${t.border} pb-4`}>
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-semibold p-2 px-4 ${t.panelBg} border ${t.borderStrong} hover:border-orange-550/40 rounded-full ${t.text} hover:${t.textPrimary} transition-all cursor-pointer shadow-sm`}
        >
          <Icons.ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Toolbox</span>
        </button>
        <span className={`text-[10px] font-mono ${t.textMuted} uppercase tracking-widest ${t.badgeBg} px-2.5 py-1 rounded`}>
          Knowledge Hub
        </span>
      </div>

      {/* Page Title Header */}
      <div className="space-y-2">
        <h1 className={`text-3xl font-black ${t.textPrimary} tracking-tight flex items-center gap-2.5`}>
          <Icons.Newspaper className="w-8 h-8 text-orange-500 animate-pulse" />
          Rocket Web Tools Blog
        </h1>
        <p className={`text-xs ${t.textMuted} font-mono`}>
          Meticulously written guides, developer blueprint secrets, and web utility deep-dives.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className={`p-5 rounded-2xl ${t.panelBg} border ${t.border} space-y-4`}>
        {/* Search */}
        <div className="relative">
          <Icons.Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted}`} />
          <input
            type="text"
            placeholder="Search articles by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${t.border} ${t.inputBg} ${t.inputText} text-xs sm:text-sm focus:outline-none focus:border-orange-500/40 transition-colors`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter row */}
        <div className="flex flex-wrap gap-2 pt-1">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-2 px-4 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                selectedCategory === cat ? filterTabActive : filterTabInactive
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        /* Loading Skeleton - 3 placeholder cards with animated pulse */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`p-6 rounded-2xl border ${t.border} ${t.cardBg} animate-pulse space-y-4 flex flex-col justify-between h-72`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-gray-500/20 rounded-full" />
                  <div className="h-3 w-16 bg-gray-500/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-gray-500/20 rounded" />
                  <div className="h-4 w-full bg-gray-500/20 rounded" />
                  <div className="h-4 w-5/6 bg-gray-500/20 rounded" />
                </div>
                <div className="flex gap-1.5 pt-2">
                  <div className="h-4 w-12 bg-gray-500/20 rounded-full" />
                  <div className="h-4 w-12 bg-gray-500/20 rounded-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-500/10 flex justify-between items-center">
                <div className="h-3 w-20 bg-gray-500/20 rounded" />
                <div className="h-3 w-16 bg-gray-500/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        /* Display posts as cards in responsive grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              onClick={() => onOpenPost(post.slug)}
              className={`group relative p-6 rounded-2xl border ${t.border} ${t.cardBg} ${t.cardHover} transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 hover:translate-y-[-2px] hover:shadow-xl`}
            >
              <div className="space-y-3">
                {/* Category & Read Time */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getCategoryBadgeClass(post.category)}`}>
                    {post.category}
                  </span>
                  <span className={`${t.textMuted} flex items-center gap-1`}>
                    <Icons.Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className={`font-extrabold ${t.textPrimary} text-base sm:text-lg tracking-tight group-hover:text-orange-500 transition-colors`}>
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className={`text-xs ${t.textSecondary} leading-relaxed line-clamp-3`}>
                  {post.excerpt}
                </p>

                {/* Tags pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 ${t.badgeBg} ${t.textMuted} rounded-full`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date & Action */}
              <div className={`flex items-center justify-between border-t ${t.border} pt-4 text-[11px]`}>
                <span className={`${t.textMuted} flex items-center gap-1`}>
                  <Icons.Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.date)}
                </span>
                <span className="text-orange-500 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <Icons.ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty results state */
        <div className={`py-16 text-center ${t.textMuted} border ${t.border} ${t.panelBg} rounded-2xl max-w-sm mx-auto`}>
          <Icons.SearchX className="w-10 h-10 mx-auto text-gray-600 mb-2" />
          <h4 className={`font-semibold ${t.textPrimary} text-sm`}>No articles match your query</h4>
          <p className={`text-xs ${t.textSecondary} mt-1`}>Try checking other categories or clearing your search term.</p>
        </div>
      )}
    </div>
  );
}
