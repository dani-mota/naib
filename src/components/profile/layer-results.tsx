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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-naib-navy mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Layer-by-Layer Results
      </h2>

      <div className="space-y-3">
        {LAYERS.map((layer) => {
          const info = LAYER_INFO[layer];
          const layerOpen = openLayers.has(layer);
          const layerResults = subtestResults.filter((r: any) => r.layer === layer);
          const avgPercentile = layerResults.length > 0
            ? Math.round(layerResults.reduce((s: number, r: any) => s + r.percentile, 0) / layerResults.length)
            : 0;

          return (
            <div key={layer} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleLayer(layer)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-naib-navy">{info.name}</span>
                  <span className="text-xs text-naib-slate ml-2">Avg: {formatPercentile(avgPercentile)}</span>
                </div>
                <div className="w-24">
                  <ScoreBar percentile={avgPercentile} height={4} />
                </div>
                {layerOpen ? <ChevronDown className="w-4 h-4 text-naib-slate" /> : <ChevronRight className="w-4 h-4 text-naib-slate" />}
              </button>

              {layerOpen && (
                <div className="border-t border-gray-100 p-3 space-y-2">
                  {layerResults.map((result: any) => {
                    const meta = CONSTRUCTS[result.construct as keyof typeof CONSTRUCTS];
                    const constructOpen = openConstructs.has(result.construct);
                    const interactions = aiInteractions.filter((ai: any) => ai.construct === result.construct);

                    return (
                      <div key={result.construct} className="bg-gray-50 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleConstruct(result.construct)}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-xs font-mono font-medium w-6 text-center" style={{ color: info.color }}>
                            {meta?.abbreviation}
                          </span>
                          <span className="flex-1 text-sm text-gray-700">{meta?.name}</span>
                          <span className="text-sm font-semibold tabular-nums" style={{ color: info.color }}>
                            {result.percentile}
                          </span>
                          <div className="w-20">
                            <ScoreBar percentile={result.percentile} showLabel={false} height={4} />
                          </div>
                          {interactions.length > 0 && (
                            <MessageSquare className="w-3.5 h-3.5 text-naib-blue" />
                          )}
                        </button>

                        {constructOpen && (
                          <div className="px-3 pb-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mt-2 mb-2">{meta?.definition}</p>

                            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-naib-slate">Items: </span>
                                <span className="font-medium">{result.itemCount}</span>
                              </div>
                              <div>
                                <span className="text-naib-slate">Avg RT: </span>
                                <span className="font-medium">{Math.round((result.responseTimeAvgMs || 0) / 1000)}s</span>
                              </div>
                              <div>
                                <span className="text-naib-slate">SE: </span>
                                <span className="font-medium">{result.standardError?.toFixed(2)}</span>
                              </div>
                            </div>

                            {result.narrativeInsight && (
                              <p className="text-xs text-gray-500 italic">{result.narrativeInsight}</p>
                            )}

                            {interactions.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs font-medium text-naib-blue">AI Follow-up Interactions</p>
                                {interactions.map((ai: any) => (
                                  <div key={ai.id} className="bg-white rounded p-2 text-xs space-y-1">
                                    <p className="text-gray-600"><strong>Q:</strong> {ai.aiPrompt}</p>
                                    {ai.candidateResponse && (
                                      <p className="text-gray-700"><strong>A:</strong> {ai.candidateResponse}</p>
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
