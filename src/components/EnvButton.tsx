import { createContext, useContext, useEffect, useState } from "react";
import clsx from "clsx";
import mitt from "mitt";

const emitter = mitt<{
  changed: string[];
}>();

export function addEnvListener(cb: (changed: string[]) => void) {
  emitter.on("changed", cb);
}
export function removeEnvListener(cb: (changed: string[]) => void) {
  emitter.off("changed", cb);
}

export interface EnvButtonGroupProps {
  name: string;
  display?: "horizontal" | "vertical";
  children: React.ReactNode;
}

interface EnvGroupContextValue {
  name: string;
  value: string | null;
  setValue: (value: string | null) => void;
}

const EnvGroupContext = createContext<EnvGroupContextValue>(null!);

function updateUrl(searchParams: URLSearchParams) {
  const newSearch = searchParams.toString();
  const newUrl = `${window.location.pathname}${newSearch && `?${newSearch}`}`;
  window.history.replaceState(null, "", newUrl);
  emitter.emit("changed", getUrlItems(searchParams));
}

export function getUrlItems(searchParams = new URLSearchParams(window.location.search)) {
  return [...searchParams.keys(), ...searchParams.values()];
}

export function EnvButtonGroup({
  name,
  display = "horizontal",
  children,
}: EnvButtonGroupProps) {
  const [initialized, setInitialized] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const defaultValue = searchParams.get(name);
    setValue(defaultValue);
    setInitialized(true);
    return () => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete(name);
      updateUrl(searchParams);
    };
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const searchParams = new URLSearchParams(window.location.search);
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    updateUrl(searchParams);
  }, [value]);

  return (
    <EnvGroupContext.Provider value={{ name, value, setValue }}>
      <div
        className={clsx("join", {
          "join-vertical": display === "vertical",
          "join-horizontal": display === "horizontal",
          // hidden: display === "hidden",
        })}
      >
        {children}
      </div>
    </EnvGroupContext.Provider>
  );
}

export interface EnvButtonProps {
  value: string;
  children: React.ReactNode;
}

export function EnvButton({ value, children }: EnvButtonProps) {
  const { value: currentValue, setValue } = useContext(EnvGroupContext);
  return (
    <button
      className={clsx("btn join-item", value === currentValue && "btn-primary")}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
}

export interface FixedProps {
  name: string;
  value: string;
}

export function Fixed({ name, value }: FixedProps) {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(name, value);
    updateUrl(searchParams);
    return () => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete(name);
      updateUrl(searchParams);
    }
  }, [value]);


}