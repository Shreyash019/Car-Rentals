import {
  createStarFieldRenderer,
  type RGB,
  type StarFieldRenderer,
  type StarFieldSettings,
} from "./star-field-renderer";

export type StarFieldMessage =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      settings: Omit<StarFieldSettings, "onReady">;
      width: number;
      height: number;
    }
  | { type: "resize"; width: number; height: number }
  | { type: "appearance"; color: RGB; opacity: number };

// Typed loosely so this file compiles with the app's normal "dom" lib settings.
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<StarFieldMessage>) => void) | null;
  postMessage(message: "ready" | "failed"): void;
};

let renderer: StarFieldRenderer | null = null;

scope.onmessage = ({ data }) => {
  if (data.type === "init") {
    renderer = createStarFieldRenderer(data.canvas, { ...data.settings, onReady: () => scope.postMessage("ready") });
    if (!renderer) scope.postMessage("failed");
    else renderer.resize(data.width, data.height);
  } else if (data.type === "resize") {
    renderer?.resize(data.width, data.height);
  } else if (data.type === "appearance") {
    renderer?.setAppearance(data.color, data.opacity);
  }
};
