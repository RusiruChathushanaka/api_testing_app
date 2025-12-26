"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestPanel } from "./request-panel";
import { RequestTabs } from "./request-tabs";
import { ResponsePanel } from "./response-panel";
import { HistoryPanel } from "./history-panel";
import {
  ApiRequest,
  ApiResponse,
  HistoryItem,
  HttpMethod,
  KeyValuePair,
} from "@/lib/types";
import {
  createEmptyKeyValuePair,
  generateId,
  sendRequest,
} from "@/lib/api-utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ApiIcon } from "@hugeicons/core-free-icons";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SaveExecutionDialog } from "./save-execution-dialog";
import { supabase, SavedExecution } from "@/lib/supabase";
import { toast } from "sonner";

export function ApiTester() {
  // Request state
  const [method, setMethod] = React.useState<HttpMethod>("GET");
  const [url, setUrl] = React.useState("");
  const [headers, setHeaders] = React.useState<KeyValuePair[]>([
    createEmptyKeyValuePair(),
  ]);
  const [params, setParams] = React.useState<KeyValuePair[]>([
    createEmptyKeyValuePair(),
  ]);
  const [body, setBody] = React.useState("");

  // Response state
  const [response, setResponse] = React.useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // History state
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(true);

  // Convert Supabase execution to HistoryItem
  const convertToHistoryItem = (execution: SavedExecution): HistoryItem => {
    const headers: KeyValuePair[] = Array.isArray(execution.headers)
      ? execution.headers.map((h: any) => ({
          id: generateId(),
          key: h.key || "",
          value: h.value || "",
          enabled: h.enabled !== false,
        }))
      : [];

    const params: KeyValuePair[] = Array.isArray(execution.params)
      ? execution.params.map((p: any) => ({
          id: generateId(),
          key: p.key || "",
          value: p.value || "",
          enabled: p.enabled !== false,
        }))
      : [];

    const response: ApiResponse | null = execution.response_status
      ? {
          status: execution.response_status,
          statusText: execution.response_status_text || "",
          headers: execution.response_headers || {},
          body: execution.response_body || "",
          time: execution.response_time || 0,
          size: execution.response_size || 0,
        }
      : null;

    return {
      id: execution.id || generateId(),
      name: execution.name,
      isSaved: true,
      request: {
        id: generateId(),
        method: execution.method as HttpMethod,
        url: execution.url,
        headers,
        params,
        body: execution.request_body || "",
        timestamp: new Date(execution.created_at || Date.now()),
      },
      response,
      timestamp: new Date(execution.created_at || Date.now()),
    };
  };

  // Load history from Supabase and localStorage on mount
  React.useEffect(() => {
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      let allHistory: HistoryItem[] = [];

      // Load from localStorage first
      const savedHistory = localStorage.getItem("api-tester-history");
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          allHistory = parsed;
        } catch (e) {
          console.error("Failed to load local history:", e);
        }
      }

      // Load from Supabase if available
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("api_executions")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

          if (error) throw error;

          if (data) {
            const savedItems = data.map(convertToHistoryItem);
            // Merge with local history, prioritizing Supabase items
            allHistory = [...savedItems, ...allHistory];
          }
        } catch (error) {
          console.error("Failed to load Supabase history:", error);
          toast.error("Failed to load saved executions");
        }
      }

      setHistory(allHistory);
      setIsLoadingHistory(false);
    };

    loadHistory();
  }, []);

  // Save only local history (non-saved items) to localStorage
  React.useEffect(() => {
    const localHistory = history.filter((item) => !item.isSaved);
    if (localHistory.length > 0) {
      localStorage.setItem("api-tester-history", JSON.stringify(localHistory));
    } else {
      localStorage.removeItem("api-tester-history");
    }
  }, [history]);

  const handleSend = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setResponse(null);

    const request: ApiRequest = {
      id: generateId(),
      method,
      url,
      headers,
      params,
      body,
      timestamp: new Date(),
    };

    try {
      const res = await sendRequest(request);
      setResponse(res);

      // Add to history
      const historyItem: HistoryItem = {
        id: generateId(),
        request,
        response: res,
        timestamp: new Date(),
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 50)); // Keep last 50 items
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setMethod(item.request.method);
    setUrl(item.request.url);
    setHeaders(item.request.headers);
    setParams(item.request.params);
    setBody(item.request.body);
    setResponse(item.response);
  };

  const handleHistoryDelete = async (id: string) => {
    const item = history.find((h) => h.id === id);

    // If it's a saved item from Supabase, delete from database
    if (item?.isSaved && supabase) {
      try {
        const { error } = await supabase
          .from("api_executions")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("Execution deleted");
      } catch (error) {
        console.error("Failed to delete execution:", error);
        toast.error("Failed to delete execution");
        return;
      }
    }

    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleHistoryClear = async () => {
    // Only clear local history, not Supabase saved executions
    const localHistory = history.filter((item) => !item.isSaved);
    if (localHistory.length === 0) {
      toast.info("No local history to clear");
      return;
    }

    setHistory((prev) => prev.filter((item) => item.isSaved));
    localStorage.removeItem("api-tester-history");
    toast.success("Local history cleared");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ApiIcon} size={24} className="text-primary" />
          <h1 className="text-lg font-semibold">API Tester</h1>
        </div>
        <div className="flex items-center gap-2">
          <SaveExecutionDialog
            request={{
              id: generateId(),
              method,
              url,
              headers,
              params,
              body,
              timestamp: new Date(),
            }}
            response={response}
            disabled={isLoading}
            onSaved={async (savedItem) => {
              // Add the newly saved item to history
              const historyItem = convertToHistoryItem(savedItem);
              setHistory((prev) => [historyItem, ...prev]);
            }}
          />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* History Sidebar */}
        <div className="w-64 min-w-[200px] border-r border-border h-full">
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            onDelete={handleHistoryDelete}
            onClear={handleHistoryClear}
          />
        </div>

        {/* Main Panel */}
        <div className="flex-1 h-full overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Request Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RequestPanel
                  method={method}
                  url={url}
                  isLoading={isLoading}
                  onMethodChange={setMethod}
                  onUrlChange={setUrl}
                  onSend={handleSend}
                />
                <RequestTabs
                  headers={headers}
                  params={params}
                  body={body}
                  onHeadersChange={setHeaders}
                  onParamsChange={setParams}
                  onBodyChange={setBody}
                />
              </CardContent>
            </Card>

            {/* Response Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsePanel response={response} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
