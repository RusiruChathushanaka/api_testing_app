"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HistoryItem } from "@/lib/types";
import { getMethodColor } from "@/lib/api-utils";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  history,
  onSelect,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">History</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground px-4">
            <HugeiconsIcon icon={Clock01Icon} size={24} />
            <span className="text-xs text-center">No requests yet</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium">History</h3>
        <Button variant="ghost" size="xs" onClick={onClear}>
          Clear
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onSelect(item)}
            >
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-[10px] px-1.5 h-5 min-w-[50px] justify-center",
                  getMethodColor(item.request.method)
                )}
              >
                {item.request.method}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate" title={item.request.url}>
                  {truncateUrl(item.request.url)}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(new Date(item.timestamp))}
                  </span>
                  {item.response && (
                    <span
                      className={cn(
                        "text-[10px] font-mono",
                        item.response.status >= 200 &&
                          item.response.status < 300
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {item.response.status}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HugeiconsIcon icon={Delete02Icon} size={12} />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
