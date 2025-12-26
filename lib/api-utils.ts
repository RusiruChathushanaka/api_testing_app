import { ApiRequest, ApiResponse, KeyValuePair } from "./types";

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function createEmptyKeyValuePair(): KeyValuePair {
  return {
    id: generateId(),
    key: "",
    value: "",
    enabled: true,
  };
}

export function buildUrl(baseUrl: string, params: KeyValuePair[]): string {
  const enabledParams = params.filter((p) => p.enabled && p.key.trim());
  if (enabledParams.length === 0) return baseUrl;

  const searchParams = new URLSearchParams();
  enabledParams.forEach((p) => searchParams.append(p.key, p.value));

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${searchParams.toString()}`;
}

export function buildHeaders(headers: KeyValuePair[]): Record<string, string> {
  const result: Record<string, string> = {};
  headers
    .filter((h) => h.enabled && h.key.trim())
    .forEach((h) => {
      result[h.key] = h.value;
    });
  return result;
}

export async function sendRequest(request: ApiRequest): Promise<ApiResponse> {
  const startTime = performance.now();

  const url = buildUrl(request.url, request.params);
  const headers = buildHeaders(request.headers);

  const options: RequestInit = {
    method: request.method,
    headers,
  };

  // Add body for non-GET requests
  if (request.method !== "GET" && request.body.trim()) {
    options.body = request.body;
    // Set Content-Type if not already set
    if (!headers["Content-Type"] && !headers["content-type"]) {
      options.headers = {
        ...headers,
        "Content-Type": "application/json",
      };
    }
  }

  try {
    const response = await fetch(url, options);
    const endTime = performance.now();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const bodyText = await response.text();

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: bodyText,
      time: Math.round(endTime - startTime),
      size: new Blob([bodyText]).size,
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 0,
      statusText: error instanceof Error ? error.message : "Network Error",
      headers: {},
      body: error instanceof Error ? error.message : "An error occurred",
      time: Math.round(endTime - startTime),
      size: 0,
    };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatJson(str: string): string {
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return str;
  }
}

export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function getStatusColor(status: number): string {
  if (status === 0) return "text-red-500";
  if (status >= 200 && status < 300) return "text-green-500";
  if (status >= 300 && status < 400) return "text-yellow-500";
  if (status >= 400 && status < 500) return "text-orange-500";
  return "text-red-500";
}

export function getMethodColor(method: string): string {
  switch (method) {
    case "GET":
      return "bg-green-500/20 text-green-600 dark:text-green-400";
    case "POST":
      return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
    case "PUT":
      return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
    case "PATCH":
      return "bg-purple-500/20 text-purple-600 dark:text-purple-400";
    case "DELETE":
      return "bg-red-500/20 text-red-600 dark:text-red-400";
    default:
      return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
  }
}
