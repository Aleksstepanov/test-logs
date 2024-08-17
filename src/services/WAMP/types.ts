interface WelcomeMessage {
  0: 0; // Welcome
  1: string; // sessionId
  2: string; // Version
  3: string; // Extra information (optional)
}

interface CallMessage {
  0: 2; // Call
  1: string; // callId
  2: string; // URI or procedure to call
  3: any[]; // Arguments (optional)
}

interface CallResultMessage {
  0: 3; // CallResult
  1: string; // callId
  2: any; // Result
}

interface CallErrorMessage {
  0: 4; // CallError
  1: string; // callId
  2: string; // Error URI
  3: string; // Error details
}

interface SubscribeMessage {
  0: 5; // Subscribe
  1: string; // subscriptionId
  2: string; // Topic URI
}

export interface EventMessage {
  0: 8; // Event
  1: string; // subscriptionId
  2: any; // Event data
}

interface HeartbeatMessage {
  0: 20; // Heartbeat
  1: number; // Ping counter
}

export type WampMessage =
  | WelcomeMessage
  | CallMessage
  | CallResultMessage
  | CallErrorMessage
  | SubscribeMessage
  | EventMessage
  | HeartbeatMessage;

export interface LoginResponse {
  Token: string;
  Username: string;
}
