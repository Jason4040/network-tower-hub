import { Link2, Mail, MapPin, Phone } from "lucide-react";
import { contact } from "../../data/contact";
import { SectionShell } from "../ui-tech/Panel";

export default function Contact() {
  const rows = [
    { icon: MapPin, label: "LOCATION", value: contact.location, href: undefined },
    { icon: Phone, label: "PHONE", value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: "EMAIL", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Link2, label: "LINKEDIN", value: contact.linkedinLabel, href: contact.linkedinUrl },
  ];

  return (
    <SectionShell id="contact" code="NODE 07" title="Contact" meta="UPLINK">
      <p className="max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
        {contact.name} is reachable for internships and entry-level networking roles.
      </p>
      <div className="mt-6 grid max-w-[62ch] gap-px border border-border bg-border">
        {rows.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-center gap-4 bg-background px-4 py-3.5">
            <Icon size={15} className="text-accent" aria-hidden="true" />
            <span className="label-tech w-24 shrink-0">{label}</span>
            {href ? (
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="min-h-[24px] text-sm text-foreground/90 underline-offset-4 hover:text-accent hover:underline"
              >
                {value}
              </a>
            ) : (
              <span className="text-sm text-foreground/90">{value}</span>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
