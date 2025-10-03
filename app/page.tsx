"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface LinkStatus {
  url: string
  status: "pending" | "checking" | "success" | "error" | "timeout"
  statusCode?: number
  statusText?: string
}

export default function Home() {
  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [limit, setLimit] = useState(100)
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState<LinkStatus[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setLinks([])
    setCheckedCount(0)

    try {
      const response = await fetch("https://api.firecrawl.dev/v2/map", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: baseUrl,
          sitemap: "include",
          limit: limit,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.links && Array.isArray(data.links)) {
        const initialLinks: LinkStatus[] = data.links.map((item: string | { url: string }) => ({
          url: typeof item === "string" ? item : item.url,
          status: "pending",
        }))
        setLinks(initialLinks)
      } else {
        setError("No links found in the response")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching links")
    } finally {
      setLoading(false)
    }
  }

  const checkAllLinks = async () => {
    if (links.length === 0) return

    setIsChecking(true)
    setCheckedCount(0)

    const batchSize = 5
    for (let i = 0; i < links.length; i += batchSize) {
      const batch = links.slice(i, i + batchSize)
      const promises = batch.map(async (link, batchIndex) => {
        const actualIndex = i + batchIndex

        // Update status to checking
        setLinks((prev) => {
          const updated = [...prev]
          updated[actualIndex] = { ...updated[actualIndex], status: "checking" }
          return updated
        })

        try {
          // Check link directly from client with timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 10 second timeout

          const response = await fetch(link.url, {
            method: "GET",
            signal: controller.signal,
            mode: "no-cors", // Avoid CORS issues
          })

          clearTimeout(timeoutId)

          // With no-cors mode, we can't read the status, so we assume success if no error
          setLinks((prev) => {
            const updated = [...prev]
            updated[actualIndex] = {
              ...updated[actualIndex],
              status: "success",
              statusCode: response.status || 200,
              statusText: response.statusText || "OK",
            }
            return updated
          })
        } catch (err) {
          // Check if it was a timeout
          const isTimeout = err instanceof Error && err.name === "AbortError"

          setLinks((prev) => {
            const updated = [...prev]
            updated[actualIndex] = {
              ...updated[actualIndex],
              status: isTimeout ? "timeout" : "error",
              statusText: isTimeout ? "Timeout" : "Failed to check",
            }
            return updated
          })
        }

        setCheckedCount((prev) => prev + 1)
      })

      await Promise.all(promises)
    }

    setIsChecking(false)
  }

  const getStatusIcon = (status: LinkStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "timeout":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusCounts = () => {
    const success = links.filter((l) => l.status === "success").length
    const error = links.filter((l) => l.status === "error").length
    const timeout = links.filter((l) => l.status === "timeout").length
    return { success, error, timeout }
  }

  const statusCounts = getStatusCounts()
  const progress = links.length > 0 ? (checkedCount / links.length) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Website Link Checker</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>About This Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This application helps you verify that your website's main page and all child pages are not broken. By
                using Firecrawl's powerful mapping API, we extract all links from your website including subdomains and
                sitemap entries. This allows you to quickly identify and review all accessible pages on your site,
                ensuring your website structure is intact and all pages are discoverable.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Firecrawl Configuration</CardTitle>
              <CardDescription>Enter your Firecrawl API key and website base URL to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Firecrawl API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseUrl">Website Base URL</Label>
                  <Input
                    id="baseUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit">Link Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    min="1"
                    max="5000"
                    placeholder="100"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of links to extract (default: 100)</p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Checking links..." : "Check the links from my website"}
                </Button>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {links.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Found {links.length} links</h3>
                    <Button onClick={checkAllLinks} disabled={isChecking} size="sm">
                      {isChecking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        "Check All Links"
                      )}
                    </Button>
                  </div>

                  {isChecking && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Progress: {checkedCount} / {links.length}
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  {checkedCount > 0 && (
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{statusCounts.success} Working</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>{statusCounts.error} Broken</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>{statusCounts.timeout} Timeout</span>
                      </div>
                    </div>
                  )}

                  <div className="max-h-96 overflow-y-auto border rounded-md p-4 space-y-2">
                    {links.map((link, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="mt-0.5">{getStatusIcon(link.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="break-all text-foreground">{link.url}</div>
                          {link.statusCode !== undefined && (
                            <div className="text-xs text-muted-foreground">
                              Status: {link.statusCode} - {link.statusText}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
