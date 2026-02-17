import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  personaId: string;
  personaName: string;
  category: string | null;
  publishedAt: Date | null;
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch {
      return null;
    }
  };

  const handleCardClick = () => {
    router.push(`/article/${article.id}`);
  };

  return (
    <Card 
      className="article-card h-full overflow-hidden border-border/50 hover:border-primary/50 bg-card cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="aspect-[16/9] relative overflow-hidden bg-muted">
        {article.featuredImageUrl ? (
          <Image
            src={article.featuredImageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-muted-foreground/30">
              AIer
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Category & Date */}
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          {article.category && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
              {article.category}
            </Badge>
          )}
          {article.publishedAt && (
            <span className="editorial-meta">
              {formatDate(article.publishedAt)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            By{" "}
            <Link
              href={`/persona/${article.personaId}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {article.personaName}
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
