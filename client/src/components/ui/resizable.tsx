import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel>) => (
  <ResizablePrimitive.Panel
    className={cn("rounded-lg", className)}
    {...props}
  />
);
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelResizeHandle>) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-1.5 items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-1.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&:not(data-[panel-group-direction=vertical])]:h-full cursor-col-resize",
      className
    )}
    {...props}
  />
);
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanel, ResizablePanelGroup, ResizableHandle };