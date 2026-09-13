// EDITABLE CONTENT — add certifications and other achievements to this list.

export type Credential = {
  id: string;
  code: string;
  name: string;
  issuers: string[];
  url?: string;
  fileUrl?: string;
  fileName?: string;
  kind: "certification" | "achievement";
  issued?: string;
};

export const certifications: Credential[] = [
  {
    id: "cert-netops-1",
    code: "CERT-01",
    name: "NetOps I",
    issuers: ["African University of Central Africa", "Internet Society"],
    kind: "certification",
  },
];
