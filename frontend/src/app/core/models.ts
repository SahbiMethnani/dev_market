export type Role = 'developer' | 'client';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Project {
  id: number;
  title: string;
  price: number;
  description: string;
  url: string | null;
  screenshot: string | null;
  developer_id: number;
  developer_username: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  project_id: number;
  project_title: string;
  other_username: string;
  last_message: string | null;
  last_message_at: string | null;
  unread: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}
