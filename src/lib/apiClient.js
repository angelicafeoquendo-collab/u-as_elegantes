import { apiBaseUrl, isApiConfigured } from "./runtimeConfig"

const normalizeBaseUrl = (value) => value.replace(/\/$/, "")

const createUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${normalizeBaseUrl(apiBaseUrl)}${normalizedPath}`
}

export const apiRequest = async (path, options = {}) => {
  if (!isApiConfigured) {
    return {
      data: null,
      error: new Error("La API directa no esta configurada"),
    }
  }

  try {
    const response = await fetch(createUrl(path), {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const contentType = response.headers.get("content-type") ?? ""
    const payload = contentType.includes("application/json")
      ? await response.json()
      : null

    const data = payload && typeof payload === "object" && "data" in payload ? payload.data : payload

    if (!response.ok) {
      return {
        data: data ?? null,
        error: new Error(payload?.error ?? payload?.message ?? `Error HTTP ${response.status}`),
      }
    }

    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}
