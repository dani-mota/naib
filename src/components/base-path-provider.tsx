"use client";

import { createContext, useContext } from "react";

const BasePathContext = createContext("");

export function BasePathProvider({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  return (
    <BasePathContext.Provider value={basePath}>
      {children}
    </BasePathContext.Provider>
  );
}

export function useBasePath() {
  return useContext(BasePathContext);
}
