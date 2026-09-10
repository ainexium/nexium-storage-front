export interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_super_admin: boolean;
  is_verified: boolean;
  quota_bytes: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Bucket {
  id: string;
  project_id: string;
  name: string;
  is_public: boolean;
  created_at: string;
}

export interface StoredFile {
  id: string;
  bucket_id: string;
  object_key: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
}

export interface PagedFiles {
  files: StoredFile[];
  total: number;
  page: number;
  per_page: number;
}

export interface APIKey {
  id: string;
  project_id: string;
  name: string;
  prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface UsageSummary {
  project_id: string;
  storage_bytes: number;
  file_count: number;
  bucket_count: number;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface APIError {
  message: string;
}

export interface AdminStats {
  user_count: number;
  project_count: number;
  bucket_count: number;
  file_count: number;
  storage_bytes: number;
  quota_bytes: number;
  storage_locked: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_super_admin: boolean;
  created_at: string;
  last_active_at: string;
  project_count: number;
  file_count: number;
  storage_bytes: number;
  storage_quota_bytes: number | null;
}

export interface Webhook {
  id: string;
  project_id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event: string;
  status_code: number | null;
  success: boolean;
  attempts: number;
  error?: string;
  delivered_at: string | null;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  storage_bytes: number;
  price_xof: number;
  max_projects: number;
  max_file_bytes: number;
  addons_enabled: boolean;
  is_active: boolean;
}

export interface PaymentChannel {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  is_active: boolean;
  maintenance_note: string;
  display_order: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
  plan: Plan | null;
}

export interface BillingPayment {
  id: string;
  user_id: string;
  plan_id: string;
  adullam_id: string;
  amount_xof: number;
  status: string; // pending, processing, completed, failed, expired
  channel: string;
  phone: string;
  redirect_url?: string;
  created_at: string;
  updated_at: string;
  plan: Plan | null;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
  plan: Plan | null;
  is_free_plan: boolean;
}

export interface AddonPackage {
  id: string;
  bytes: number;
  price_xof: number;
  label: string;
}

export interface StorageAddon {
  id: string;
  user_id: string;
  package_id: string;
  bytes: number;
  price_xof: number;
  adullam_id: string;
  status: string;
  channel: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  is_admin: boolean;
  is_super_admin: boolean;
  action: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
}
