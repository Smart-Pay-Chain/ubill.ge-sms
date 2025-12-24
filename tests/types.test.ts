import {
  UBillSMSConfig,
  BrandName,
  BrandNameCreateResponse,
  BrandNamesResponse,
  SendSMSOptions,
  SendSMSResponse,
  DeliveryStatus,
  DeliveryReportResponse,
  BalanceResponse,
  SendSMSGetOptions,
} from "../src/types";

describe("Type Definitions", () => {
  describe("UBillSMSConfig", () => {
    it("should accept valid config with only apiKey", () => {
      const config: UBillSMSConfig = {
        apiKey: "test-key",
      };
      expect(config.apiKey).toBe("test-key");
    });

    it("should accept config with all optional fields", () => {
      const config: UBillSMSConfig = {
        apiKey: "test-key",
        baseURL: "https://custom.api.com",
        timeout: 60000,
      };
      expect(config.baseURL).toBe("https://custom.api.com");
      expect(config.timeout).toBe(60000);
    });
  });

  describe("BrandName", () => {
    it("should accept valid brand name", () => {
      const brand: BrandName = {
        id: "1",
        name: "TestBrand",
        authorized: "1",
        createdAt: "2023-01-01 00:00:00",
      };
      expect(brand.authorized).toBe("1");
    });

    it("should accept unauthorized brand", () => {
      const brand: BrandName = {
        id: "2",
        name: "PendingBrand",
        authorized: "2",
        createdAt: "2023-01-02 00:00:00",
      };
      expect(brand.authorized).toBe("2");
    });
  });

  describe("SendSMSOptions", () => {
    it("should accept single number as array", () => {
      const options: SendSMSOptions = {
        brandID: 1,
        numbers: [995511194242],
        text: "Test message",
      };
      expect(Array.isArray(options.numbers)).toBe(true);
    });

    it("should accept multiple numbers", () => {
      const options: SendSMSOptions = {
        brandID: 1,
        numbers: [995511194242, 995511194243],
        text: "Test message",
      };
      expect(options.numbers).toHaveLength(2);
    });

    it("should accept comma-separated string", () => {
      const options: SendSMSOptions = {
        brandID: 1,
        numbers: "995511194242,995511194243",
        text: "Test message",
      };
      expect(typeof options.numbers).toBe("string");
    });

    it("should accept stopList parameter", () => {
      const options: SendSMSOptions = {
        brandID: 1,
        numbers: [995511194242],
        text: "Test message",
        stopList: true,
      };
      expect(options.stopList).toBe(true);
    });
  });

  describe("DeliveryStatus", () => {
    it("should accept all valid status IDs", () => {
      const statuses: DeliveryStatus[] = [
        { number: "995511194242", statusID: "0" }, // Sent
        { number: "995511194243", statusID: "1" }, // Received
        { number: "995511194244", statusID: "2" }, // Not delivered
        { number: "995511194245", statusID: "3" }, // Awaiting
        { number: "995511194246", statusID: "4" }, // Error
      ];

      expect(statuses).toHaveLength(5);
      statuses.forEach((status) => {
        expect(["0", "1", "2", "3", "4"]).toContain(status.statusID);
      });
    });
  });

  describe("Response Types", () => {
    it("should accept BrandNameCreateResponse", () => {
      const response: BrandNameCreateResponse = {
        statusID: 0,
        brandID: 123,
        message: "BrandName Created",
      };
      expect(response.statusID).toBe(0);
    });

    it("should accept BrandNamesResponse", () => {
      const response: BrandNamesResponse = {
        statusID: 0,
        data: [
          {
            id: "1",
            name: "Brand1",
            authorized: "1",
            createdAt: "2023-01-01 00:00:00",
          },
        ],
      };
      expect(response.data).toHaveLength(1);
    });

    it("should accept SendSMSResponse with string smsID", () => {
      const response: SendSMSResponse = {
        statusID: 0,
        smsID: "117345",
        message: "SMS Sent",
      };
      expect(typeof response.smsID).toBe("string");
    });

    it("should accept SendSMSResponse with number smsID", () => {
      const response: SendSMSResponse = {
        statusID: 0,
        smsID: 117345,
        message: "SMS Sent",
      };
      expect(typeof response.smsID).toBe("number");
    });

    it("should accept DeliveryReportResponse", () => {
      const response: DeliveryReportResponse = {
        statusID: 0,
        result: [{ number: "995511194242", statusID: "1" }],
      };
      expect(response.result).toHaveLength(1);
    });

    it("should accept BalanceResponse", () => {
      const response: BalanceResponse = {
        statusID: 0,
        balance: 1000,
      };
      expect(response.balance).toBe(1000);
    });
  });

  describe("Error Response", () => {
    it("should accept error response without optional fields", () => {
      const response: BrandNameCreateResponse = {
        statusID: 99,
        message: "General error",
      };
      expect(response.brandID).toBeUndefined();
    });

    it("should accept balance response without balance on error", () => {
      const response: BalanceResponse = {
        statusID: 99,
        message: "Error occurred",
      };
      expect(response.balance).toBeUndefined();
    });
  });
});
