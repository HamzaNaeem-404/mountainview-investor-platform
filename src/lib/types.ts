export type ContactPreference = "WhatsApp" | "Email" | "Phone" | "In Person";

export type OpportunityStage =
  | "Shortlisted"
  | "Due diligence"
  | "Not proceeding"
  | "On hold";

export type ChecklistStatus = "Missing" | "Requested" | "Received" | "Reviewed";

export type DocumentStatus =
  | "Draft"
  | "Available"
  | "Received"
  | "Reviewed"
  | "Archived";

export type ShareChannel = "WhatsApp" | "Email" | "In Person" | "Manually logged" | "Other";

export type TaskStatus = "Open" | "Completed";

export type ActivityKind =
  | "stage_change"
  | "checklist_update"
  | "share_logged"
  | "task_completed"
  | "task_rescheduled"
  | "selection"
  | "note";

export interface Investor {
  id: string;
  name: string;
  country: string;
  contactPreference: ContactPreference;
}

export interface Mandate {
  id: string;
  investorId: string;
  budgetMin: number;
  budgetMax: number;
  investmentObjective: string;
  preferredAssetType: string;
  preferredLocations: string[];
  decisionTimeline: string;
}

export interface Property {
  id: string;
  code: string;
  title: string;
  location: string;
  propertyType: string;
  price: number;
  description: string;
}

export interface InvestorOpportunity {
  id: string;
  investorId: string;
  propertyId: string;
  stage: OpportunityStage;
  mandateFitNotes: string;
  selectedAt: string | null;
  assignedOwner: string;
  nextActionHint: string;
}

export interface ChecklistItem {
  id: string;
  investorOpportunityId: string;
  category: string;
  title: string;
  status: ChecklistStatus;
  responsiblePerson: string;
  dueDate: string | null;
}

export interface DocumentRecord {
  id: string;
  investorOpportunityId: string;
  name: string;
  version: string;
  status: DocumentStatus;
}

export interface ShareEvent {
  id: string;
  investorOpportunityId: string;
  documentId: string;
  sharedAt: string;
  channel: ShareChannel;
  version: string;
  loggedBy: string;
}

export interface FollowUpTask {
  id: string;
  investorOpportunityId: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface ActivityEvent {
  id: string;
  investorOpportunityId: string | null;
  investorId: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  createdAt: string;
}

export interface DemoState {
  version: number;
  investors: Investor[];
  mandates: Mandate[];
  properties: Property[];
  opportunities: InvestorOpportunity[];
  checklistItems: ChecklistItem[];
  documents: DocumentRecord[];
  shareEvents: ShareEvent[];
  followUpTasks: FollowUpTask[];
  activityEvents: ActivityEvent[];
}

export const DEMO_STORAGE_KEY = "mv-investor-ops-demo-v1";
export const DEMO_STORAGE_VERSION = 1;
