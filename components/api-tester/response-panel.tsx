"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { ApiResponse } from "@/lib/types";
import { formatBytes, formatJson, getStatusColor } from "@/lib/api-utils";
import { cn } from "@/lib/utils";

interface ResponsePanelProps {
  response: ApiResponse | null;
  isLoading: boolean;
}

export function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (response?.body) {
      await navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px] border rounded-lg border-border">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-sm">Sending request...</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-[300px] border rounded-lg border-border">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Send a request to see the response</span>
        </div>
      </div>
    );
  }

  const formattedBody = formatJson(response.body);
  const isJson = formattedBody !== response.body;

  return (
    <div className="border rounded-lg border-border overflow-hidden">
      {/* Response Status Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <Badge
              variant={
                response.status >= 200 && response.status < 300
                  ? "default"
                  : "destructive"
              }
              className="font-mono"
            >
              <span className={cn(getStatusColor(response.status))}>
                {response.status} {response.statusText}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Time:</span>
            <span className="text-xs font-mono">{response.time}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Size:</span>
            <span className="text-xs font-mono">
              {formatBytes(response.size)}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="h-6 w-6"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={14}
            className={copied ? "text-green-500" : ""}
          />
        </Button>
      </div>

      {/* Response Tabs */}
      <Tabs defaultValue="body" className="w-full">
        <TabsList className="mx-3 mt-2">
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">
            Headers
            {Object.keys(response.headers).length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-4 px-1.5 text-[10px]"
              >
                {Object.keys(response.headers).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="mt-0">
          <ScrollArea className="h-[250px]">
            <pre className="p-4 text-xs font-mono whitespace-pre-wrap break-all">
              {isJson ? (
                <code className="text-foreground">{formattedBody}</code>
              ) : (
                <code className="text-foreground">
                  {response.body || "No content"}
                </code>
              )}
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="headers" className="mt-0">
          <ScrollArea className="h-[250px]">
            <div className="p-4 space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex gap-2 text-xs">
                  <span className="font-semibold text-muted-foreground min-w-[150px]">
                    {key}:
                  </span>
                  <span className="font-mono break-all">{value}</span>
                </div>
              ))}
              {Object.keys(response.headers).length === 0 && (
                <span className="text-muted-foreground text-xs">
                  No headers
                </span>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
