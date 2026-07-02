export interface ConversationSummary {
  id: string;
  title: string;
  preview: string;
  time: string;
  lastActive: string;
  folder: string;
  category: string;
  pinned?: boolean;
  favorite?: boolean;
  archived?: boolean;
}
