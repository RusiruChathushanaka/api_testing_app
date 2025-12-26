"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { KeyValueEditor } from "./key-value-editor";
import { KeyValuePair } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface RequestTabsProps {
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: string;
  onHeadersChange: (headers: KeyValuePair[]) => void;
  onParamsChange: (params: KeyValuePair[]) => void;
  onBodyChange: (body: string) => void;
}

export function RequestTabs({
  headers,
  params,
  body,
  onHeadersChange,
  onParamsChange,
  onBodyChange,
}: RequestTabsProps) {
  const activeHeadersCount = headers.filter((h) => h.enabled && h.key).length;
  const activeParamsCount = params.filter((p) => p.enabled && p.key).length;

  return (
    <Tabs defaultValue="params" className="w-full">
      <TabsList>
        <TabsTrigger value="params" className="gap-1.5">
          Params
          {activeParamsCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
              {activeParamsCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="headers" className="gap-1.5">
          Headers
          {activeHeadersCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
              {activeHeadersCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="body">Body</TabsTrigger>
      </TabsList>

      <TabsContent value="params" className="mt-3">
        <KeyValueEditor
          items={params}
          onChange={onParamsChange}
          keyPlaceholder="Parameter name"
          valuePlaceholder="Value"
        />
      </TabsContent>

      <TabsContent value="headers" className="mt-3">
        <KeyValueEditor
          items={headers}
          onChange={onHeadersChange}
          keyPlaceholder="Header name"
          valuePlaceholder="Value"
        />
      </TabsContent>

      <TabsContent value="body" className="mt-3">
        <Textarea
          placeholder='{"key": "value"}'
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          className="min-h-[200px] font-mono text-xs"
        />
      </TabsContent>
    </Tabs>
  );
}
