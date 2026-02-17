"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { toast } from "sonner";

interface Persona {
  id: string;
  name: string;
  bio: string;
  role: string;
  profileImageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { articles: number };
}

const ROLES = ["reporter", "commentator", "contributor"];

export function PersonasTab() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [deletingPersona, setDeletingPersona] = useState<Persona | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("reporter");
  const [displayOrder, setDisplayOrder] = useState("0");

  const fetchPersonas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/personas");
      const data = await res.json();
      setPersonas(data);
    } catch (error) {
      console.error("Error fetching personas:", error);
      toast.error("Failed to fetch personas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const openCreateDialog = () => {
    setEditingPersona(null);
    setName("");
    setBio("");
    setRole("reporter");
    setDisplayOrder("0");
    setDialogOpen(true);
  };

  const openEditDialog = (persona: Persona) => {
    setEditingPersona(persona);
    setName(persona.name);
    setBio(persona.bio);
    setRole(persona.role);
    setDisplayOrder(persona.displayOrder.toString());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !bio.trim()) {
      toast.error("Name and bio are required");
      return;
    }

    try {
      const url = editingPersona
        ? `/api/admin/persona/${editingPersona.id}`
        : "/api/admin/personas";
      
      const method = editingPersona ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          role,
          displayOrder: parseInt(displayOrder) || 0,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save persona");
      }

      toast.success(editingPersona ? "Persona updated" : "Persona created");
      setDialogOpen(false);
      fetchPersonas();
    } catch (error) {
      console.error("Error saving persona:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save persona");
    }
  };

  const handleDelete = async () => {
    if (!deletingPersona) return;

    try {
      const res = await fetch(`/api/admin/persona/${deletingPersona.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete persona");
      }

      toast.success("Persona deleted");
      setDeleteDialogOpen(false);
      setDeletingPersona(null);
      fetchPersonas();
    } catch (error) {
      console.error("Error deleting persona:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete persona");
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
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Manage author personas for your articles
        </p>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Persona
        </Button>
      </div>

      {personas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No personas yet</p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first persona
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {personas.map((persona) => (
            <Card key={persona.id} className={!persona.isActive ? "opacity-50" : ""}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {persona.profileImageUrl ? (
                    <img
                      src={persona.profileImageUrl}
                      alt={persona.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{persona.name}</h3>
                    <Badge className={getRoleBadgeColor(persona.role)}>
                      {persona.role}
                    </Badge>
                    {!persona.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {persona.bio}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {persona._count?.articles || 0} articles
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(persona)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeletingPersona(persona);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPersona ? "Edit Persona" : "Create Persona"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Chen"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Technology reporter covering AI and machine learning..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPersona ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Persona</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingPersona?.name}&quot;? 
              {deletingPersona && deletingPersona._count?.articles ? (
                <span className="block mt-2 text-destructive font-medium">
                  This persona has {deletingPersona._count.articles} articles. Delete or reassign them first.
                </span>
              ) : (
                " This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletingPersona?._count?.articles ? deletingPersona._count.articles > 0 : false}
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
