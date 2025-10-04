import CheckerForm from "@/components/checker-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Website Link Checker</h1>
          <div className="flex justify-end" style={{ marginTop: "-35px" }}>
            <a href="https://github.com/tiago123456789/website-checker" target="_blank">
              <Button className="cursor-pointer" variant="link"> Github </Button>
            </a>
          </div>
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
              <p className="mt-2  text-muted-foreground">
                <strong>Why is it important?</strong> Because if has broken links, it can have a bad user experience and you can lose new users or leads.
              </p>

              <p className="mt-2  text-muted-foreground">
                <strong>PS:</strong> The tool does not store any data, it is free and open source.
              </p>
            </CardContent>
          </Card>
        </div>

        <CheckerForm />
      </main>
    </div>
  )
}
