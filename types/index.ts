export enum Role {
  STUDENT = 'STUDENT',
  CONTRIBUTOR = 'CONTRIBUTOR',
  ADMIN = 'ADMIN',
}

export enum ResourceType {
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  department?: string | null;
  accessKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description?: string | null;
  type: ResourceType;
  url: string;
  downloads: number;
  category?: string | null;
  department?: string | null;
  level?: string | null;
  createdAt: Date;
  updatedAt: Date;
  uploaderId?: string | null;
  uploader?: Partial<User> | null;
}
