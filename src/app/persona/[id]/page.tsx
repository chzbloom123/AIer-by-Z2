"use client";

import { use } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, User, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface PersonaData {
  persona: {
    id: string;
    name: string;
    bio: string;
    role: string;
    profileImageUrl: string | null;
    moreInfoText: string | null;
    externalLinks: string | null;
  };
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    featuredImageUrl: string | null;
    category: string | null;
    publishedAt: Date | null;
  }>;
}

function PersonaPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<PersonaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/persona/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Persona not found");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

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

  const parseExternalLinks = (linksJson: string | null) => {
    if (!linksJson) return [];
    try {
      return Object.entries(JSON.parse(linksJson)) as [string, string][];
    } catch {
      return [];
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="flex items-start gap-6 mb-8">
            <Skeleton className="w-24 h-24 rounded-full shrink-0" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="font-display text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground mb-6">
              The persona you&apos;re looking for doesn&apos;t exist.
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

  const { persona, articles } = data;
  const externalLinks = parseExternalLinks(persona.externalLinks);

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

        {/* Persona Profile */}
        <section className="container max-w-4xl mx-auto px-4 pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            {/* Profile Image */}
            {persona.profileImageUrl ? (
              <Image
                src={persona.profileImageUrl}
                alt={persona.name}
                width={128}
                height={128}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            {/* Info */}
            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                {persona.name}
              </h1>
              <Badge className={`mb-4 ${getRoleBadgeColor(persona.role)}`}>
                {persona.role}
              </Badge>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {persona.bio}
              </p>

              {/* External Links */}
              {externalLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {externalLinks.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {platform}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* More Info */}
          {persona.moreInfoText && (
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <h2 className="font-display text-lg font-bold mb-2">About {persona.name}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {persona.moreInfoText}
              </p>
            </div>
          )}
        </section>

        {/* Articles by this persona */}
        <section className="container max-w-4xl mx-auto px-4 pb-16">
          <h2 className="font-display text-2xl font-bold mb-6">
            Articles by {persona.name}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No articles published yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="block p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    {article.featuredImageUrl ? (
                      <div className="w-24 h-16 relative rounded overflow-hidden shrink-0 bg-muted">
                        <Image
                          src={article.featuredImageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-16 rounded bg-muted shrink-0 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {article.category && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {article.category}
                          </Badge>
                        )}
                        {article.publishedAt && (
                          <span className="text-xs text-muted-foreground editorial-meta">
                            {formatDate(article.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function PersonaPage({ params }: { params: Promise<{ id: string }> }) {
  return <PersonaPageContent params={params} />;
}
