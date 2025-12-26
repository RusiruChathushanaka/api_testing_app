"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { supabase, SavedExecution } from "@/lib/supabase";
import { ApiRequest, ApiResponse } from "@/lib/types";
import { toast } from "sonner";

interface SaveExecutionDialogProps {
  request: ApiRequest;
  response: ApiResponse | null;
  disabled?: boolean;
  onSaved?: (execution: SavedExecution) => void;
}

export function SaveExecutionDialog({
  request,
  response,
  disabled,
  onSaved,
}: SaveExecutionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for this execution");
      return;
    }

    if (!supabase) {
      toast.error(
        "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file."
      );
      return;
    }

    setIsSaving(true);

    try {
      const execution: SavedExecution = {
        name: name.trim(),
        method: request.method,
        url: request.url,
        headers: request.headers,
        params: request.params,
        request_body: request.body,
        response_status: response?.status || null,
        response_status_text: response?.statusText || null,
        response_headers: response?.headers || {},
        response_body: response?.body || null,
        response_time: response?.time || null,
        response_size: response?.size || null,
      };

      const { data, error } = await supabase
        .from("api_executions")
        .insert([execution])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Failed to save: ${error.message}`);
        return;
      }

      if (data && onSaved) {
        onSaved(data as SavedExecution);
      }

      toast.success("Execution saved successfully!");
      setOpen(false);
      setName("");
    } catch (error) {
      console.error("Error saving execution:", error);
      toast.error("Failed to save execution. Please check your configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || !request.url}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
            Save
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Execution</DialogTitle>
          <DialogDescription>
            Give this API execution a name to save it for later reference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Get User Profile"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          <div className="grid gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-semibold">Method:</span> {request.method}
            </div>
            <div>
              <span className="font-semibold">URL:</span>{" "}
              <span className="break-all">{request.url}</span>
            </div>
            {response && (
              <div>
                <span className="font-semibold">Status:</span> {response.status}{" "}
                {response.statusText}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
