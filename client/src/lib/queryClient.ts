import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // First element is the base URL
    const baseUrl = queryKey[0] as string;
    
    // If we have additional elements in the queryKey, check if they're for path parameters or query params
    let url = baseUrl;
    const pathParams = [];
    const queryParams = {};
    
    // Check if this is a URL that should use path params (like /api/outlines/:bookId/:chapter)
    if (baseUrl.includes('/outlines') && queryKey.length > 1 && queryKey[1] !== undefined && queryKey[2] !== undefined) {
      // For outlines, we want /api/outlines/:bookId/:chapter format
      url = `${baseUrl}/${queryKey[1]}/${queryKey[2]}`;
      console.log("Using path params URL for outlines:", url);
    } 
    // For queries with more than one parameter but not outlines, treat as query params
    else if (queryKey.length > 1) {
      // If we're using query parameters
      const searchParams = new URLSearchParams();
      
      // Recognize a pattern of [url, key1, value1, key2, value2, ...]
      for (let i = 1; i < queryKey.length; i += 2) {
        if (i + 1 < queryKey.length && queryKey[i] !== undefined && queryKey[i+1] !== undefined) {
          searchParams.append(queryKey[i] as string, queryKey[i+1] as string);
        }
      }
      
      // If we have any query params, append them
      const queryString = searchParams.toString();
      if (queryString) {
        url = `${baseUrl}?${queryString}`;
        console.log("Using query params URL:", url);
      }
    }
    
    console.log("Fetching from URL:", url);
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
