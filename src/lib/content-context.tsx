import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CONTENT_STORAGE_KEY, cloneContent, defaultContent, fetchPublishedContent, readLocalContent, writeLocalContent, type SiteContent } from "./content";

type ContentContextValue = {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
  saveContent: (next?: SiteContent) => void;
  resetContent: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => defaultContent());

  useEffect(() => {
    let cancelled = false;
    const local = readLocalContent();
    if (local && !cancelled) setContentState(local);

    fetchPublishedContent().then((published) => {
      if (cancelled || !published) return;
      const latestLocal = readLocalContent();
      setContentState(latestLocal ?? published);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setContent = useCallback((next: SiteContent) => {
    setContentState(cloneContent(next));
  }, []);

  const saveContent = useCallback((next?: SiteContent) => {
    setContentState((current) => {
      const payload = cloneContent(next ?? current);
      writeLocalContent(payload);
      return payload;
    });
  }, []);

  const resetContent = useCallback(() => {
    const fresh = defaultContent();
    window.localStorage.removeItem(CONTENT_STORAGE_KEY);
    setContentState(fresh);
  }, []);

  const value = useMemo(
    () => ({ content, setContent, saveContent, resetContent }),
    [content, setContent, saveContent, resetContent],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
