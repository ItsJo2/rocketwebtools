export interface Tool {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'development' | 'text' | 'network' | 'utility' | 'ai' | 'image' | 'calculator' | 'binary' | 'web-mgmt';
}

export interface NetworkResponse {
  ip: string;
  headers: Record<string, string>;
  userAgent: string;
}

export interface DnsRecord {
  type: string;
  values: string[];
}

export interface DnsResponse {
  domain: string;
  records: Record<string, string[]>;
}
