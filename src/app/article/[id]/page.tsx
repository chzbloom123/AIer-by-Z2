"use client";

import { use } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ArticleDetail {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  featuredImageUrl: string | null;
  category: string | null;
  style: string | null;
  publishedAt: Date | null;
  persona: {
    id: string;
    name: string;
    bio: string;
    role: string;
    profileImageUrl: string | null;
  };
}

function ArticlePageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/article/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article not found");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    try {
      return format(new Date(date), "MMMM d, yyyy");
    } catch {
      return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "reporter":
        return "bg-editorial-teal text-white";
      case "commentator":
        return "bg-accent-rust text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="aspect-video w-full rounded-lg mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="font-display text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground mb-6">
              The article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
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
        {/* Back button */}
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Link>
        </div>

        {/* Article */}
        <article className="container max-w-4xl mx-auto px-4 pb-16">
          {/* Header */}
          <header className="mb-8">
            {/* Category & Style */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.category && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {article.category}
                </Badge>
              )}
              {article.style && (
                <Badge variant="outline">
                  {article.style}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {/* Author */}
              <Link
                href={`/persona/${article.persona.id}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                {article.persona.profileImageUrl ? (
                  <Image
                    src={article.persona.profileImageUrl}
                    alt={article.persona.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="font-medium text-foreground">
                  {article.persona.name}
                </span>
                <Badge className={`text-xs ${getRoleBadgeColor(article.persona.role)}`}>
                  {article.persona.role}
                </Badge>
              </Link>

              {/* Date */}
              {article.publishedAt && (
                <span className="flex items-center gap-1 editorial-meta">
                  <Calendar className="h-3 w-3" />
                  {formatDate(article.publishedAt)}
                </span>
              )}

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-primary transition-colors ml-auto"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </header>

          {/* Featured Image */}
          {article.featuredImageUrl && (
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8 bg-muted">
              <Image
                src={article.featuredImageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {article.body.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-start gap-4">
              {article.persona.profileImageUrl ? (
                <Image
                  src={article.persona.profileImageUrl}
                  alt={article.persona.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <Link
                  href={`/persona/${article.persona.id}`}
                  className="font-display text-lg font-bold hover:text-primary transition-colors"
                >
                  {article.persona.name}
                </Link>
                <Badge className={`ml-2 text-xs ${getRoleBadgeColor(article.persona.role)}`}>
                  {article.persona.role}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {article.persona.bio}
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  return <ArticlePageContent params={params} />;
}
