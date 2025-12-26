"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Add01Icon } from "@hugeicons/core-free-icons";
import { KeyValuePair } from "@/lib/types";
import { createEmptyKeyValuePair } from "@/lib/api-utils";

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueEditor({
  items,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: KeyValueEditorProps) {
  const handleAdd = () => {
    onChange([...items, createEmptyKeyValuePair()]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    field: "key" | "value" | "enabled",
    value: string | boolean
  ) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox
            checked={item.enabled}
            onCheckedChange={(checked) =>
              handleChange(item.id, "enabled", checked === true)
            }
          />
          <Input
            placeholder={keyPlaceholder}
            value={item.key}
            onChange={(e) => handleChange(item.id, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder={valuePlaceholder}
            value={item.value}
            onChange={(e) => handleChange(item.id, "value", e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleRemove(item.id)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd} className="gap-1">
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Add
      </Button>
    </div>
  );
}
