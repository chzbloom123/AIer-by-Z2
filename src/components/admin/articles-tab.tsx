"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string | null;
  style: string | null;
  isPublic: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  persona: {
    name: string;
    role: string;
  };
}

interface Persona {
  id: string;
  name: string;
  role: string;
}

const CATEGORIES = ["us-news", "world", "technology", "commentary", "satire", "culture", "science"];
const STYLES = ["analysis", "commentary", "satire", "news", "feature"];

export function ArticlesTab() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articlesRes, personasRes] = await Promise.all([
        fetch("/api/admin/articles"),
        fetch("/api/public/personas"),
      ]);
      const articlesData = await articlesRes.json();
      const personasData = await personasRes.json();
      setArticles(articlesData);
      setPersonas(personasData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateDialog = () => {
    if (personas.length === 0) {
      toast.error("Create a persona first");
      return;
    }
    setEditingArticle(null);
    setTitle("");
    setBody("");
    setExcerpt("");
    setCategory("");
    setStyle("");
    setPersonaId(personas[0].id);
    setIsPublic(true);
    setDialogOpen(true);
  };

  const openEditDialog = async (article: Article) => {
    setEditingArticle(article);
    try {
      const res = await fetch(`/api/admin/article/${article.id}`);
      const data = await res.json();
      setTitle(data.title);
      setBody(data.body);
      setExcerpt(data.excerpt || "");
      setCategory(data.category || "");
      setStyle(data.style || "");
      setPersonaId(data.personaId);
      setIsPublic(data.isPublic);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to load article");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim() || !personaId) {
      toast.error("Title, body, and author are required");
      return;
    }

    try {
      const url = editingArticle
        ? `/api/admin/article/${editingArticle.id}`
        : "/api/admin/articles";
      
      const method = editingArticle ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          excerpt: excerpt.trim() || undefined,
          category: category || undefined,
          style: style || undefined,
          personaId,
          isPublic,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save article");
      }

      toast.success(editingArticle ? "Article updated" : "Article created");
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save article");
    }
  };

  const handleDelete = async () => {
    if (!deletingArticle) return;

    try {
      const res = await fetch(`/api/admin/article/${deletingArticle.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete article");
      }

      toast.success("Article deleted");
      setDeleteDialogOpen(false);
      setDeletingArticle(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unpublished";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Create and manage articles
          {personas.length === 0 && (
            <span className="text-destructive ml-2">
              ⚠️ Create a persona first
            </span>
          )}
        </p>
        <Button onClick={openCreateDialog} disabled={personas.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No articles yet</p>
            <Button onClick={openCreateDialog} disabled={personas.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Write your first article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {articles.map((article) => (
            <Card key={article.id} className="hover:bg-muted/30 transition-colors">
              <CardContent className="flex items-center gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{article.title}</h3>
                    {article.isPublic ? (
                      <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{article.persona.name}</span>
                    {article.category && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(article)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeletingArticle(article);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Edit Article" : "New Article"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article headline..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Select value={personaId} onValueChange={setPersonaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-end pt-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">Published</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Content *</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your article content here..."
                rows={12}
                className="font-serif"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">
                Excerpt <span className="text-muted-foreground">(optional - auto-generated if empty)</span>
              </Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief preview of the article..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingArticle ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingArticle?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
