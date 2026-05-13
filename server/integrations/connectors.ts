export type IntegrationProvider =
  | "telegram"
  | "gmail"
  | "google_drive"
  | "notion"
  | "shopify"
  | "youtube"
  | "tiktok";

export type IntegrationActionResult = {
  provider: IntegrationProvider;
  ok: boolean;
  message: string;
  at: string;
};

export interface IntegrationConnector {
  provider: IntegrationProvider;
  ping(): Promise<IntegrationActionResult>;
}

class MockConnector implements IntegrationConnector {
  constructor(public provider: IntegrationProvider) {}
  async ping(): Promise<IntegrationActionResult> {
    return {
      provider: this.provider,
      ok: true,
      message: `${this.provider} connector is reachable (mock)`,
      at: new Date().toISOString(),
    };
  }
}

const connectorMap: Record<IntegrationProvider, IntegrationConnector> = {
  telegram: new MockConnector("telegram"),
  gmail: new MockConnector("gmail"),
  google_drive: new MockConnector("google_drive"),
  notion: new MockConnector("notion"),
  shopify: new MockConnector("shopify"),
  youtube: new MockConnector("youtube"),
  tiktok: new MockConnector("tiktok"),
};

export function getConnector(provider: IntegrationProvider) {
  return connectorMap[provider];
}

export function listConnectors() {
  return Object.keys(connectorMap) as IntegrationProvider[];
}

