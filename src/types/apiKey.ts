export interface ApiKey {
  id: string;                // maps to 'id' in database
  name: string;              // maps to 'name' in database
  key: string;               // maps to 'key' in database
  createdAt: string;         // maps to 'created_at' in database
  lastUsed?: string;         // maps to 'last_used' in database
  isActive: boolean;         // maps to 'is_active' in database
  userId: string;            // maps to 'user_id' in database
}

export interface CreateApiKeyDto {
  name: string;
  userId: string;
}

export interface UpdateApiKeyDto {
  name?: string;
  isActive?: boolean;        // maps to 'is_active' in database
} 