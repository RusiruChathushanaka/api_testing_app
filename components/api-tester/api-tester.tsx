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

  // Load history from localStorage on mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem("api-tester-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  // Save history to localStorage
  React.useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("api-tester-history", JSON.stringify(history));
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

  const handleHistoryDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleHistoryClear = () => {
    setHistory([]);
    localStorage.removeItem("api-tester-history");
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
