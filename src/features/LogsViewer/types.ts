export interface LogItem {
  Level?: 'ERROR' | 'DEBUG' | 'TRACE';
  Message?: string;
  Source?: string;
  Timestamp?: string
}
