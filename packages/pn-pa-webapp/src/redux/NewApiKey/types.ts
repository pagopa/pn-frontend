// Mock Type
export interface ApiKeysGroupType {
  id: number;
  title: string;
}

export interface NewApiKeyType {
  name: string;
  groups: Array<string>;
}