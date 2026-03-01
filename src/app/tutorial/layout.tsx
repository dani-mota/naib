import { TopNav } from "@/components/nav/top-nav";
import { BasePathProvider } from "@/components/base-path-provider";
import { DemoBanner } from "@/components/tutorial/demo-banner";
import { DemoWatermark } from "@/components/tutorial/demo-watermark";
import { TooltipOverlay } from "@/components/tutorial/tooltip-overlay";

export default function TutorialLayout({ children }: { children: React.ReactNode }) {
  return (
    <BasePathProvider basePath="/tutorial">
      <div className="min-h-screen bg-background">
        <DemoBanner />
        <TopNav mode="tutorial" />
        <DemoWatermark />
        <TooltipOverlay />
        <main className="max-w-[1600px] mx-auto">{children}</main>
      </div>
    </BasePathProvider>
  );
}
