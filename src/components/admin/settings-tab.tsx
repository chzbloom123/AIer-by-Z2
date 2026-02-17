"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Globe, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  siteName: string;
  tagline: string | null;
  isPublic: boolean;
}

export function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data);
      setSiteName(data.siteName);
      setTagline(data.tagline || "");
      setIsPublic(data.isPublic);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim() || "The Artificial Intelligencer",
          tagline: tagline.trim() || null,
          isPublic,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await res.json();
      setSettings(data);
      toast.success("Settings saved");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Site Settings</h2>

      <div className="grid gap-6">
        {/* Site Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Site Identity</CardTitle>
            <CardDescription>
              Configure your site&apos;s name and tagline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="The Artificial Intelligencer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="AI-Powered Editorial Content"
              />
              <p className="text-xs text-muted-foreground">
                A brief description shown below the site name
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Visibility
            </CardTitle>
            <CardDescription>
              Control whether your site is publicly accessible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label htmlFor="isPublic" className="text-base font-medium">
                    {isPublic ? "Public" : "Private"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isPublic
                    ? "Your site is visible to everyone"
                    : "Your site is hidden from public view"}
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
