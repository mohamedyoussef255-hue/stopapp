export type UserRole = 'worker' | 'hse' | 'gm' | 'admin';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'open' | 'investigating' | 'action_in_progress' | 'resolved';

export interface UserProfile {
  id: string;
  name: string;
  nameAr?: string;
  employeeId: string;
  role: UserRole;
  phone?: string;
  jobTitle?: string;
  jobTitleAr?: string;
  avatar: string;
  safetyPoints: number;
  safetyRank: string;
  safetyRankAr?: string;
  reportsSubmitted: number;
}

export interface AIAssessmentResult {
  severity: Severity;
  score: number; // 0 - 100
  hazardType: string;
  hazardTypeAr?: string;
  standardRef: string;
  standardRefAr?: string;
  potentialConsequences: string;
  potentialConsequencesAr?: string;
  recommendedAction: string;
  recommendedActionAr?: string;
  hierarchyOfControl: 'Elimination' | 'Substitution' | 'Engineering' | 'Administrative' | 'PPE';
  hierarchyOfControlAr?: string;
  confidenceScore: number;
  analyzedAt: string;
}

export interface ReportLocation {
  lat: number;
  lng: number;
  address: string;
  addressAr?: string;
  accuracy?: number;
}

export interface GMExecutiveDirective {
  id: string;
  reportId?: string;
  targetType: 'hse_director' | 'workers' | 'other_department';
  targetDepartment: string;
  targetDepartmentAr: string;
  assigneeName: string;
  directive: string;
  directiveAr?: string;
  deadline: string;
  deadlineAr?: string;
  priority: 'critical' | 'mandatory' | 'high';
  timestamp: string;
  author: string;
  status: 'dispatched' | 'acknowledged' | 'in_progress' | 'executed';
}

export interface PlantStation {
  id: string;
  name: string;
  nameAr: string;
  zoneCode: string;
  type: string;
  typeAr: string;
  riskLevel: Severity;
  coords: { x: number; y: number; lat: number; lng: number };
  activeIncidents: number;
  descriptionAr: string;
  descriptionEn: string;
  safetyOfficerIds: string[];
}

export interface SafetyOfficerLocation {
  id: string;
  name: string;
  nameAr: string;
  jobTitle: string;
  jobTitleAr: string;
  employeeId: string;
  stationId: string;
  stationNameAr: string;
  phone: string;
  radioChannel: string;
  status: 'on_patrol' | 'responding' | 'at_station';
  statusAr: string;
  statusEn: string;
  batteryLevel: number;
  coords: { x: number; y: number; lat: number; lng: number };
  avatar: string;
  activeTaskId?: string;
  isFastestResponder?: boolean;
  swiftAutonomousRemediationsCount?: number;
  swiftRemediationAvgMinutes?: string;
  fastestBadgeTitleAr?: string;
}

export interface SafetyReport {
  id: string;
  timestamp: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  categoryAr?: string;
  siteZone: string;
  siteZoneAr?: string;
  location: ReportLocation;
  photos: string[];
  reporter: {
    id: string;
    name: string;
    nameAr?: string;
    employeeId: string;
    phone?: string;
    role: UserRole;
  };
  aiAssessment: AIAssessmentResult;
  status: ReportStatus;
  assignedHse?: {
    id: string;
    name: string;
    nameAr?: string;
    jobTitle: string;
    jobTitleAr?: string;
  };
  gmDirectives?: {
    id: string;
    directive: string;
    directiveAr?: string;
    timestamp: string;
    author: string;
    authorAr?: string;
    targetDepartment?: string;
    assigneeName?: string;
    deadline?: string;
  }[];
  correctiveActions?: {
    id: string;
    note: string;
    noteAr?: string;
    author: string;
    authorAr?: string;
    timestamp: string;
    photoProof?: string;
  }[];
  pointsPending?: number;
  pointsAwarded?: number;
  pointsAwardedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  customFieldValues?: Record<string, string | number | boolean>;
}

export interface ChatMessage {
  id: string;
  channelId: 'worker_hse' | 'hse_gm';
  senderId: string;
  senderName: string;
  senderNameAr?: string;
  senderRole: UserRole;
  text: string;
  textAr?: string;
  timestamp: string;
  linkedReportId?: string;
  isDirectUrgent?: boolean;
}

export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'toggle';
  options?: string[];
  placeholder?: string;
  required: boolean;
  enabled: boolean;
}

export interface PantoneColor {
  name: string;
  code: string;
  hex: string;
  hoverHex: string;
  lightHex: string;
  ringHex: string;
}

export interface RewardTier {
  id: string;
  name: string;
  nameAr: string;
  minPoints: number;
  bonusPercentage: number;
  perks: string;
  perksAr: string;
  color: string;
}

export interface RewardCatalogItem {
  id: string;
  title: string;
  titleAr: string;
  costPoints: number;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  icon: string;
  enabled: boolean;
}

export interface RewardsSystemConfig {
  enabled: boolean; // Show/Hide rewards
  showWallOfFame: boolean;
  pointsPerReport: number;
  bonusPhotoPoints: number;
  bonusCriticalPoints: number;
  currencyName: string;
  currencyNameAr: string;
  tiers: RewardTier[];
  catalog: RewardCatalogItem[];
  programTitle: string;
  programTitleAr: string;
  executiveNotice?: string;
  executiveNoticeAr?: string;
}

export interface PageSectionItem {
  id: string;
  titleAr: string;
  descriptionAr: string;
  visible: boolean;
  order: number;
}

export interface HazardIconItem {
  id: string;
  key: string;
  labelAr: string;
  icon: string;
  color: string;
  visible: boolean;
  order: number;
  defaultTitleAr: string;
}

export interface FormFieldItem {
  id: string;
  key: string;
  labelAr: string;
  descriptionAr: string;
  visible: boolean;
  required: boolean;
  order: number;
}

export interface ActionIconItem {
  id: string;
  labelAr: string;
  iconName: string;
  visible: boolean;
}

export interface UIConfig {
  appTitle: string;
  appSubtitle: string;
  pantone: PantoneColor;
  rewardsConfig: RewardsSystemConfig;
  portalFeatures: {
    worker: {
      voiceDictation: boolean;
      gamification: boolean;
      gpsAutoDetect: boolean;
      photoUpload: boolean;
      instantChat: boolean;
    };
    hse: {
      audioAlerts: boolean;
      riskOverride: boolean;
      quickDirectives: boolean;
      exportReports: boolean;
    };
    gm: {
      executiveDirectives: boolean;
      reassignment: boolean;
      exportSummaries: boolean;
      riskHeatmap: boolean;
    };
  };
  customFields: CustomFormField[];
  noticeBanner: string;
  pageSections: {
    worker: PageSectionItem[];
    hse: PageSectionItem[];
    gm: PageSectionItem[];
  };
  hazardIcons: HazardIconItem[];
  formFields: FormFieldItem[];
  actionIcons: ActionIconItem[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  points: number;
  verifiedReports: number;
  badge: string;
  avatar: string;
}
