import axios, { AxiosInstance, AxiosError } from "axios";
import {
  UBillSMSConfig,
  BrandNameCreateResponse,
  BrandNamesResponse,
  SendSMSOptions,
  SendSMSResponse,
  DeliveryReportResponse,
  BalanceResponse,
  SendSMSGetOptions,
  UBillAPIError,
} from "./types";

/**
 * uBill SMS Client
 *
 * A Node.js client for interacting with the uBill.ge SMS API.
 * Supports sending SMS messages, managing brand names, checking delivery status, and account balance.
 *
 * @example
 * ```typescript
 * import { UBillSMSClient } from '@ubillge/sms-client';
 *
 * const client = new UBillSMSClient({
 *   apiKey: 'your-api-key-here'
 * });
 *
 * // Send an SMS
 * const response = await client.sendSMS({
 *   brandID: 1,
 *   numbers: [995511194242],
 *   text: 'Hello from uBill!'
 * });
 * ```
 */
export class UBillSMSClient {
  private apiKey: string;
  private axiosInstance: AxiosInstance;

  /**
   * Create a new uBill SMS Client instance
   *
   * @param config - Configuration options
   */
  constructor(config: UBillSMSConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required");
    }

    this.apiKey = config.apiKey;

    this.axiosInstance = axios.create({
      baseURL: config.baseURL || "https://api.ubill.dev/v1",
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
        key: this.apiKey,
      },
    });
  }

  /**
   * Create a new brand name
   *
   * Brand names must be 2-11 characters and approved before use.
   * Allowed characters: a-z, A-Z, 0-9, period (.), hyphen (-), space
   *
   * @param brandName - The brand name to create (2-11 characters)
   * @returns Response containing the created brand ID
   *
   * @example
   * ```typescript
   * const response = await client.createBrandName('MyBrand');
   * console.log(response.brandID);
   * ```
   */
  async createBrandName(brandName: string): Promise<BrandNameCreateResponse> {
    try {
      // Validate brand name format
      if (!brandName || brandName.length < 2) {
        throw new Error("Brand name must be at least 2 characters long");
      }

      if (brandName.length > 11) {
        throw new Error("Brand name must be maximum 11 characters long");
      }

      // Allowed: a-z, A-Z, 0-9, period (.), hyphen (-), space
      if (!/^[a-zA-Z0-9.\- ]+$/.test(brandName)) {
        throw new Error(
          "Brand name contains invalid characters. " +
            "Allowed: letters (a-z, A-Z), numbers (0-9), period (.), hyphen (-), and space"
        );
      }

      const response = await this.axiosInstance.post("/sms/brandNameCreate", {
        brandName,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all brand names for your account
   *
   * @returns List of all brand names
   *
   * @example
   * ```typescript
   * const response = await client.getBrandNames();
   * response.data?.forEach(brand => {
   *   console.log(`${brand.name} - Authorized: ${brand.authorized}`);
   * });
   * ```
   */
  async getBrandNames(): Promise<BrandNamesResponse> {
    try {
      const response = await this.axiosInstance.get("/sms/brandNames");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Send SMS via POST request (recommended)
   *
   * Sends SMS messages to one or more phone numbers.
   *
   * @param options - SMS sending options
   * @returns Response containing the SMS ID for tracking
   *
   * @example
   * ```typescript
   * // Send to a single number
   * const response = await client.sendSMS({
   *   brandID: 1,
   *   numbers: [995511194242],
   *   text: 'Hello World!'
   * });
   *
   * // Send to multiple numbers
   * const response = await client.sendSMS({
   *   brandID: 1,
   *   numbers: [995511194242, 995511194243],
   *   text: 'Bulk message',
   *   stopList: false
   * });
   * ```
   */
  async sendSMS(options: SendSMSOptions): Promise<SendSMSResponse> {
    try {
      const { brandID, numbers, text, stopList = false } = options;

      const numbersArray = Array.isArray(numbers)
        ? numbers
        : numbers.split(",").map((n) => parseInt(n.trim()));

      // Validate phone numbers
      this.validatePhoneNumbers(numbersArray);

      const payload = {
        brandID,
        numbers: numbersArray,
        text,
        stopList,
      };

      const response = await this.axiosInstance.post("/sms/send", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Send SMS via GET request
   *
   * Alternative method to send SMS using URL parameters.
   * Use POST method for better security and reliability.
   *
   * @param options - SMS sending options
   * @returns Response containing the SMS ID for tracking
   *
   * @example
   * ```typescript
   * const response = await client.sendSMSGet({
   *   brandID: 1,
   *   numbers: '995511194242,995511194243',
   *   text: 'Hello via GET'
   * });
   * ```
   */
  async sendSMSGet(options: SendSMSGetOptions): Promise<SendSMSResponse> {
    try {
      const { brandID, numbers, text, stopList = false } = options;

      // Validate phone numbers from comma-separated string
      const numbersArray = numbers.split(",").map((n) => parseInt(n.trim()));
      this.validatePhoneNumbers(numbersArray);

      const response = await this.axiosInstance.get("/sms/send", {
        params: {
          key: this.apiKey,
          brandID,
          numbers,
          text,
          stopList,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate Georgian mobile number
   * @private
   * @param number - Phone number to validate
   * @returns true if valid Georgian mobile number
   */
  private isValidGeorgianMobile(number: string | number): boolean {
    const numberStr = String(number);

    // Georgian mobile number patterns:
    // Format 1: 995XXXXXXXXX (12 digits with country code)
    // Format 2: XXXXXXXXX (9 digits without country code)
    // Mobile prefixes in Georgia: 5XX (like 511, 555, 558, 568, 571, 574, 577, 591-599)

    // Pattern with country code 995
    const withCountryCode = /^995[5]\d{8}$/;
    // Pattern without country code (starts with 5)
    const withoutCountryCode = /^[5]\d{8}$/;

    return (
      withCountryCode.test(numberStr) || withoutCountryCode.test(numberStr)
    );
  }

  /**
   * Validate an array of phone numbers
   * @private
   * @param numbers - Array of phone numbers to validate
   * @throws Error if any number is invalid
   */
  private validatePhoneNumbers(numbers: number[]): void {
    const invalidNumbers = numbers.filter(
      (num) => !this.isValidGeorgianMobile(num)
    );

    if (invalidNumbers.length > 0) {
      throw new Error(
        `Invalid Georgian mobile number(s): ${invalidNumbers.join(", ")}. ` +
          `Expected format: 995XXXXXXXXX (with country code) or XXXXXXXXX (without), starting with 5.`
      );
    }
  }

  /**
   * Get delivery report for a sent SMS
   *
   * Check the delivery status of an SMS message.
   *
   * Status codes:
   * - 0: Sent
   * - 1: Received
   * - 2: Not delivered
   * - 3: Awaiting status
   * - 4: Error
   *
   * @param smsID - The SMS ID received from sendSMS
   * @returns Delivery report with status for each number
   *
   * @example
   * ```typescript
   * const report = await client.getDeliveryReport(117345);
   * report.result?.forEach(status => {
   *   console.log(`${status.number}: ${status.statusID}`);
   * });
   * ```
   */
  async getDeliveryReport(
    smsID: number | string
  ): Promise<DeliveryReportResponse> {
    try {
      const response = await this.axiosInstance.get(`/sms/report/${smsID}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get SMS balance for your account
   *
   * @returns Current SMS count
   *
   * @example
   * ```typescript
   * const balance = await client.getBalance();
   * console.log(`Remaining SMS: ${balance.sms}`);
   * ```
   */
  async getBalance(): Promise<BalanceResponse> {
    try {
      const response = await this.axiosInstance.get("/sms/balance", {
        params: { key: this.apiKey },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @private
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<UBillAPIError>;

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        return new Error(
          `uBill API Error (${errorData.statusID}): ${errorData.message}`
        );
      }

      if (axiosError.response) {
        return new Error(
          `HTTP Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        );
      }

      if (axiosError.request) {
        return new Error("No response received from uBill API");
      }
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error("Unknown error occurred");
  }
}
