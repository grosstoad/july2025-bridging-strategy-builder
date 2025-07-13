// Application state types

export interface UserSession {
  sessionId: string;
  currentStep: ApplicationStep;
  completedSteps: ApplicationStep[];
  startedAt: Date;
  lastActivityAt: Date;
}

export enum ApplicationStep {
  Landing = 1,
  CurrentProperty = 2,
  TargetProperty = 3,
  PersonalCircumstances = 4,
  StrategyRecommendations = 5
}

export interface ApplicationError {
  id: string;
  type: ErrorType;
  message: string;
  timestamp: Date;
  step?: ApplicationStep;
  severity: ErrorSeverity;
}

export enum ErrorType {
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error',
  NETWORK_ERROR = 'network_error'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}