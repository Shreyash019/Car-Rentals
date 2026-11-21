import { BRAND, Badge, Button, Card } from "@car-rentals/ui";

const FEATURES = [
  {
    title: "Clear prices",
    body: "The price you see includes taxes and 300 km per day. No surprises at the counter.",
  },
  {
    title: "Free cancellation",
    body: "Cancel up to 24 hours before pickup and get a full refund.",
  },
  {
    title: "Trusted partners",
    body: "Every rental partner is verified before they can list a car.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="fx-bg-aurora">
        <div className="page-container section stack items-start">
          <Badge tone="info">Free cancellation on every booking</Badge>
          <h1 className="max-w-3xl">
            <span className="fx-text-gradient fx-grad-brand">
              {BRAND.tagline}
            </span>
          </h1>
          <p className="max-w-2xl text-body-lg text-muted-foreground">
            {BRAND.description}
          </p>
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
  );
}
