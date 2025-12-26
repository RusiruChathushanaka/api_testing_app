"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";
import { HttpMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RequestPanelProps {
  method: HttpMethod;
  url: string;
  isLoading: boolean;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onSend: () => void;
}

const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const methodColors: Record<HttpMethod, string> = {
  GET: "text-green-600 dark:text-green-400",
  POST: "text-blue-600 dark:text-blue-400",
  PUT: "text-yellow-600 dark:text-yellow-400",
  PATCH: "text-purple-600 dark:text-purple-400",
  DELETE: "text-red-600 dark:text-red-400",
};

export function RequestPanel({
  method,
  url,
  isLoading,
  onMethodChange,
  onUrlChange,
  onSend,
}: RequestPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={method}
        onValueChange={(value) => onMethodChange(value as HttpMethod)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue>
            <span className={cn("font-semibold", methodColors[method])}>
              {method}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {methods.map((m) => (
            <SelectItem key={m} value={m}>
              <span className={cn("font-semibold", methodColors[m])}>{m}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Enter request URL (e.g., https://api.example.com/users)"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />

      <Button
        onClick={onSend}
        disabled={isLoading || !url.trim()}
        className="gap-2"
      >
        <HugeiconsIcon icon={SentIcon} size={16} />
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
