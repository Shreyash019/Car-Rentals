import { BRAND, Badge, Button, Card, Logo, ThemeToggle, ZoneLink } from "@car-rentals/ui";

const STEPS = [
  { title: "Create your account", body: "Tell us about your business and where you rent cars." },
  { title: "Get verified", body: "Our team checks your documents, usually within two working days." },
  { title: "List your cars", body: "Add cars, prices and availability, then start receiving bookings." },
];

export default function ProvidersHome() {
  return (
    <>
      <header className="border-b border-border">
        <div className="page-container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge tone="primary">Partners</Badge>
          </div>
          <nav className="flex items-center gap-2" aria-label="Main">
            <ZoneLink zone="customers" href="/" className="link text-small">
              Customer site
            </ZoneLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="tone-strong">
          <div className="page-container section stack items-start">
            <h1 className="max-w-3xl">Grow your rental business with {BRAND.name}</h1>
            <p className="max-w-2xl text-body-lg">
              Reach more customers, fill empty days and get paid on time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="highlight">
                Become a partner
              </Button>
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </div>
          </div>
        </section>

        <section className="page-container section stack">
          <h2>How it works</h2>
          <ol className="auto-grid">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Card className="stack h-full gap-2">
                  <Badge tone="highlight" className="self-start">
                    Step {i + 1}
                  </Badge>
                  <h3>{s.title}</h3>
                  <p className="text-muted-foreground">{s.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="page-container py-8 text-small text-muted-foreground">© {BRAND.name} Partners</div>
      </footer>
    </>
  );
}
