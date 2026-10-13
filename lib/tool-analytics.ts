export type ToolAnalyticsProperties = Record<string, string | number | boolean | undefined>;

/**
 * Sends product events to GTM without ever including form values, files, or
 * document content.  GTM can forward these to GA4, Meta, or any other tag.
 */
export function trackToolEvent(event: string, properties: ToolAnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  const dataLayerWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
  dataLayerWindow.dataLayer ??= [];
  dataLayerWindow.dataLayer.push({ event, ...properties });
}
