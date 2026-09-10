import { skills } from "../../data/skills";
import { SectionShell, Tag } from "../ui-tech/Panel";

export default function Skills() {
  return (
    <SectionShell id="skills" code="NODE 02" title="Skills" meta="CAPABILITY MAP">
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.code} className="bg-background p-5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] tracking-wide text-accent">{group.code}</span>
              <h3 className="text-sm font-medium tracking-wide text-foreground">{group.category}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
