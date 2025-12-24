/**
 * Configuration options for the uBill SMS Client
 */
export interface UBillSMSConfig {
  /** Your uBill API key */
  apiKey: string;
  /** Base URL for the API (defaults to https://api.ubill.dev/v1) */
  baseURL?: string;
  /** Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
}

/**
 * Brand name information
 */
export interface BrandName {
  /** Brand ID */
  id: string;
  /** Brand name (2-11 characters) */
  name: string;
  /** Authorization status (1 = authorized, 2 = not authorized) */
  authorized: '1' | '2';
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Response from brand name creation
 */
export interface BrandNameCreateResponse {
  /** Status ID (0 = success) */
  statusID: number;
  /** Created brand ID */
  brandID?: number;
  /** Response message */
  message: string;
}

/**
 * Response from getting all brand names
 */
export interface BrandNamesResponse {
  /** Status ID (0 = success) */
  statusID: number;
  /** List of brand names */
  data?: BrandName[];
  /** Response message (if error) */
  message?: string;
}

/**
 * Options for sending SMS
 */
export interface SendSMSOptions {
  /** Brand ID to use for sending */
  brandID: number;
  /** Phone number(s) to send to (can be array or comma-separated string) */
  numbers: number[] | string;
  /** SMS message text */
  text: string;
  /** Enable/disable checking numbers in the stop list (defaults to false) */
  stopList?: boolean;
}

/**
 * Response from sending SMS
 */
export interface SendSMSResponse {
  /** Status ID (0 = success) */
  statusID: number;
  /** SMS ID for tracking */
  smsID?: number | string;
  /** Response message */
  message: string;
}

/**
 * Delivery status for a single number
 */
export interface DeliveryStatus {
  /** Phone number */
  number: string;
  /** 
   * Status ID:
   * 0 = Sent
   * 1 = Received
   * 2 = Not delivered
   * 3 = Awaiting status
   * 4 = Error
   */
  statusID: '0' | '1' | '2' | '3' | '4';
}

/**
 * Response from delivery report
 */
export interface DeliveryReportResponse {
  /** Status ID (0 = success) */
  statusID: number;
  /** Delivery status for each number */
  result?: DeliveryStatus[];
  /** Response message (if error) */
  message?: string;
}

/**
 * Response from SMS balance check
 */
export interface BalanceResponse {
  /** Status ID (0 = success) */
  statusID: number;
  /** Remaining SMS balance */
  balance?: number;
  /** Response message (if error) */
  message?: string;
}

/**
 * Error response from API
 */
export interface UBillAPIError {
  /** Status ID (non-zero indicates error) */
  statusID: number;
  /** Error message */
  message: string;
}

/**
 * Send SMS via GET request options
 */
export interface SendSMSGetOptions {
  /** Brand ID to use for sending */
  brandID: number;
  /** Comma-separated phone numbers */
  numbers: string;
  /** SMS message text */
  text: string;
  /** Enable/disable checking numbers in the stop list */
  stopList?: boolean;
}

