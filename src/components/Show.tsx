import { useEffect, useState } from "react";
import { addEnvListener, getUrlItems, removeEnvListener } from "./EnvButton";

export interface ShowProps {
  when: string;
  children: React.ReactNode;
}

export function Show({ when, children }: ShowProps) {
  const items = when.split("|").map((x) => x.split(',').map(x => x.trim()));
  const [currentItems, setCurrentItems] = useState(getUrlItems());
  const shouldShow = items.some((item) => item.every((x) => currentItems.includes(x)));
  useEffect(() => {
    addEnvListener(setCurrentItems);
    return () => removeEnvListener(setCurrentItems);
  }, []);
  return shouldShow ? <>{children}</> : null;
}