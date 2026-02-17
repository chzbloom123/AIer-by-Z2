"use client";

import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ArticleCard, type Article } from "@/components/site/article-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, Suspense } from "react";
import { X, Search, FileText } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "us-news", label: "US News" },
  { id: "world", label: "World" },
  { id: "technology", label: "Technology" },
  { id: "commentary", label: "Commentary" },
  { id: "satire", label: "Satire" },
];

interface SiteSettings {
  siteName: string;
  tagline: string | null;
  isPublic: boolean;
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Fetch site settings
  useEffect(() => {
    const controller = new AbortController();
    
    fetch("/api/public/settings", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setSiteSettings(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching settings:", err);
        }
      });

    return () => controller.abort();
  }, []);

  // Fetch articles - derived from URL params directly
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    
    if (categoryParam !== "all") {
      params.set("category", categoryParam);
    }
    if (searchParam) {
      params.set("search", searchParam);
    }

    const url = `/api/public/articles${params.toString() ? `?${params.toString()}` : ""}`;
    
    // Set loading before fetch
    let isMounted = true;
    
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setArticles(data);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError" && isMounted) {
          console.error("Error fetching articles:", err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [categoryParam, searchParam]);

  // Handle category click - updates URL
  const handleCategoryClick = (categoryId: string) => {
    const url = new URL(window.location.href);
    if (categoryId === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", categoryId);
    }
    window.history.pushState({}, "", url.toString());
    // Trigger a popstate event so useSearchParams updates
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Clear search
  const clearSearch = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Show offline message if site is private
  if (siteSettings && !siteSettings.isPublic) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="font-display text-4xl font-bold mb-4">
              {siteSettings.siteName}
            </h1>
            <p className="text-muted-foreground text-lg">
              is currently offline. Check back soon.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Category Filter Bar */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border/40">
          <div className="container max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoryParam === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`shrink-0 ${
                    categoryParam === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent"
                  }`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {siteSettings?.siteName || "The Artificial Intelligencer"}
            </h1>
            {siteSettings?.tagline && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {siteSettings.tagline}
              </p>
            )}
          </div>
        </section>

        {/* Active Search Badge */}
        {searchParam && (
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <Badge variant="secondary" className="gap-2 py-1.5 px-3">
              <Search className="h-3 w-3" />
              Search: &quot;{searchParam}&quot;
              <button onClick={clearSearch} className="ml-1 hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Articles Grid */}
        <section className="py-8 md:py-12">
          <div className="container max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">
                  No articles yet
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchParam
                    ? `No articles match your search for "${searchParam}". Try a different term.`
                    : "Check back soon for new content."}
                </p>
                {searchParam && (
                  <Button variant="outline" className="mt-4" onClick={clearSearch}>
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </main>
        <SiteFooter />
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
