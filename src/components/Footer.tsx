import { CV_URL, profile } from "../data/profile";
import { contact } from "../data/contact";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div>
          <p className="font-display text-sm tracking-[0.14em]">{profile.name.toUpperCase()}</p>
          <p className="mt-2 max-w-[42ch] text-xs leading-relaxed text-muted-foreground">
            {profile.role}
            <br />
            {profile.aspiration}
            <br />
            {profile.location}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.12em]">
          <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-accent">
            EMAIL
          </a>
          <a
            href={contact.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-accent"
          >
            LINKEDIN
          </a>
          <a href={CV_URL} download className="text-muted-foreground hover:text-accent">
            CV
          </a>
        </nav>
      </div>
      <p className="mt-8 font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
        © 2026 Irumva Jason
      </p>
    </footer>
  );
}
