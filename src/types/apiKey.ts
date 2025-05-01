export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface CreateApiKeyDto {
  name: string;
}

export interface UpdateApiKeyDto {
  name?: string;
  isActive?: boolean;
} 