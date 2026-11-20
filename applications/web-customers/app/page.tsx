import { BRAND, Badge, Button, Card, Logo, ThemeToggle, ZoneLink } from "@car-rentals/ui";

const FEATURES = [
  { title: "Clear prices", body: "The price you see includes taxes and 300 km per day. No surprises at the counter." },
  { title: "Free cancellation", body: "Cancel up to 24 hours before pickup and get a full refund." },
  { title: "Trusted partners", body: "Every rental partner is verified before they can list a car." },
];

export default function Home() {
  return (
    <>
      <header className="border-b border-border">
        <div className="page-container flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="flex items-center gap-2" aria-label="Main">
            <ZoneLink zone="providers" href="/" className="link text-small">
              For partners
            </ZoneLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="fx-bg-aurora">
          <div className="page-container section stack items-start">
            <Badge tone="highlight">Free cancellation on every booking</Badge>
            <h1 className="max-w-3xl">
              <span className="fx-text-gradient fx-grad-brand">{BRAND.tagline}</span>
            </h1>
            <p className="max-w-2xl text-body-lg text-muted-foreground">{BRAND.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Find a car</Button>
              <Button size="lg" variant="highlight">
                See weekend deals
              </Button>
            </div>
          </div>
        </section>

        <section className="page-container section stack">
          <h2>Why book with {BRAND.name}</h2>
          <div className="auto-grid">
            {FEATURES.map((f) => (
              <Card key={f.title} className="stack gap-2">
                <h3>{f.title}</h3>
                <p className="text-muted-foreground">{f.body}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="tone-deep">
        <div className="page-container flex flex-wrap items-center justify-between gap-4 py-8 text-small">
          <span>© {BRAND.name}</span>
          <ZoneLink zone="providers" href="/" className="fx-underline">
            List your cars
          </ZoneLink>
        </div>
      </footer>
    </>
  );
}
