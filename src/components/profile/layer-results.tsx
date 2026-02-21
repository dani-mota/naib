"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";
import { ScoreBar } from "@/components/ui/score-bar";
import { formatPercentile } from "@/lib/format";

interface LayerResultsProps {
  subtestResults: any[];
  aiInteractions: any[];
}

const LAYERS: LayerType[] = ["COGNITIVE_CORE", "TECHNICAL_APTITUDE", "BEHAVIORAL_INTEGRITY"];

export function LayerResults({ subtestResults, aiInteractions }: LayerResultsProps) {
  const [openLayers, setOpenLayers] = useState<Set<string>>(new Set(["COGNITIVE_CORE"]));
  const [openConstructs, setOpenConstructs] = useState<Set<string>>(new Set());

  const toggleLayer = (layer: string) => {
    const next = new Set(openLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    setOpenLayers(next);
  };

  const toggleConstruct = (construct: string) => {
    const next = new Set(openConstructs);
    if (next.has(construct)) next.delete(construct);
    else next.add(construct);
    setOpenConstructs(next);
  };

  return (
    <div className="bg-card border border-border p-5">
      <h2 className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Layer-by-Layer Results
      </h2>

      <div className="space-y-2">
        {LAYERS.map((layer) => {
          const info = LAYER_INFO[layer];
          const layerOpen = openLayers.has(layer);
          const layerResults = subtestResults.filter((r: any) => r.layer === layer);
          const avgPercentile = layerResults.length > 0
            ? Math.round(layerResults.reduce((s: number, r: any) => s + r.percentile, 0) / layerResults.length)
            : 0;

          return (
            <div key={layer} className="border border-border overflow-hidden">
              <button
                onClick={() => toggleLayer(layer)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="w-2.5 h-2.5" style={{ backgroundColor: info.color }} />
                <div className="flex-1">
                  <span className="text-xs font-medium text-foreground uppercase tracking-wider">{info.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2 font-mono">Avg: {formatPercentile(avgPercentile)}</span>
                </div>
                <div className="w-24">
                  <ScoreBar percentile={avgPercentile} height={3} />
                </div>
                {layerOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>

              {layerOpen && (
                <div className="border-t border-border p-2 space-y-1.5">
                  {layerResults.map((result: any) => {
                    const meta = CONSTRUCTS[result.construct as keyof typeof CONSTRUCTS];
                    const constructOpen = openConstructs.has(result.construct);
                    const interactions = aiInteractions.filter((ai: any) => ai.construct === result.construct);

                    return (
                      <div key={result.construct} className="bg-accent/30 overflow-hidden">
                        <button
                          onClick={() => toggleConstruct(result.construct)}
                          className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-accent/60 transition-colors"
                        >
                          <span className="text-[10px] font-mono font-semibold w-6 text-center" style={{ color: info.color }}>
                            {meta?.abbreviation}
                          </span>
                          <span className="flex-1 text-xs text-foreground">{meta?.name}</span>
                          <span className="text-xs font-semibold font-mono tabular-nums" style={{ color: info.color }}>
                            {result.percentile}
                          </span>
                          <div className="w-16">
                            <ScoreBar percentile={result.percentile} showLabel={false} height={3} />
                          </div>
                          {interactions.length > 0 && (
                            <MessageSquare className="w-3 h-3 text-naib-blue" />
                          )}
                        </button>

                        {constructOpen && (
                          <div className="px-2.5 pb-2.5 border-t border-border">
                            <p className="text-[10px] text-muted-foreground mt-2 mb-2 leading-relaxed">{meta?.definition}</p>

                            <div className="grid grid-cols-3 gap-2 text-[10px] mb-2 font-mono">
                              <div>
                                <span className="text-muted-foreground uppercase tracking-wider">Items: </span>
                                <span className="font-medium text-foreground">{result.itemCount}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground uppercase tracking-wider">Avg RT: </span>
                                <span className="font-medium text-foreground">{Math.round((result.responseTimeAvgMs || 0) / 1000)}s</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground uppercase tracking-wider">SE: </span>
                                <span className="font-medium text-foreground">{result.standardError?.toFixed(2)}</span>
                              </div>
                            </div>

                            {result.narrativeInsight && (
                              <p className="text-[10px] text-muted-foreground italic">{result.narrativeInsight}</p>
                            )}

                            {interactions.length > 0 && (
                              <div className="mt-2 space-y-1.5">
                                <p className="text-[10px] font-medium text-naib-blue uppercase tracking-wider">AI Follow-up Interactions</p>
                                {interactions.map((ai: any) => (
                                  <div key={ai.id} className="bg-card border border-border p-2 text-[10px] space-y-1">
                                    <p className="text-muted-foreground"><strong className="text-foreground">Q:</strong> {ai.aiPrompt}</p>
                                    {ai.candidateResponse && (
                                      <p className="text-foreground"><strong>A:</strong> {ai.candidateResponse}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
