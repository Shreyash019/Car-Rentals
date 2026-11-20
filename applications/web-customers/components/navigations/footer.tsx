import { BRAND, ZoneLink } from "@car-rentals/ui";

const Footer = () => {
  return (
    <footer className="tone-deep">
      <div className="page-container flex flex-wrap items-center justify-between gap-4 py-8 text-small">
        <span>© {BRAND.name}</span>
        <ZoneLink zone="providers" href="/" className="fx-underline">
          List your cars
        </ZoneLink>
      </div>
    </footer>
  );
};

export default Footer;
