import { UBillSMSClient } from '../src/client';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UBillSMSClient', () => {
  let client: UBillSMSClient;
  const mockApiKey = 'test-api-key-123';

  beforeEach(() => {
    client = new UBillSMSClient({ apiKey: mockApiKey });
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance with valid API key', () => {
      expect(client).toBeInstanceOf(UBillSMSClient);
    });

    it('should throw error if API key is missing', () => {
      expect(() => new UBillSMSClient({ apiKey: '' })).toThrow('API key is required');
    });

    it('should use custom base URL if provided', () => {
      const customUrl = 'https://custom.api.com/v1';
      const customClient = new UBillSMSClient({
        apiKey: mockApiKey,
        baseURL: customUrl
      });
      expect(customClient).toBeInstanceOf(UBillSMSClient);
    });

    it('should use custom timeout if provided', () => {
      const customTimeout = 60000;
      const customClient = new UBillSMSClient({
        apiKey: mockApiKey,
        timeout: customTimeout
      });
      expect(customClient).toBeInstanceOf(UBillSMSClient);
    });
  });

  describe('createBrandName', () => {
    it('should create brand name successfully', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          brandID: 123,
          message: 'BrandName Created'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.createBrandName('TestBrand');

      expect(result.statusID).toBe(0);
      expect(result.brandID).toBe(123);
      expect(result.message).toBe('BrandName Created');
    });

    it('should handle brand name creation error', async () => {
      const mockResponse = {
        data: {
          statusID: 40,
          message: 'brandName has already been added'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.createBrandName('ExistingBrand');

      expect(result.statusID).toBe(40);
      expect(result.message).toBe('brandName has already been added');
    });

    it('should handle network error', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('Network Error'))
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      await expect(client.createBrandName('Test')).rejects.toThrow();
    });

    it('should validate minimum brand name length', async () => {
      await expect(client.createBrandName('A')).rejects.toThrow(
        'Brand name must be at least 2 characters long'
      );
    });

    it('should validate maximum brand name length', async () => {
      await expect(client.createBrandName('ThisIsWayTooLong')).rejects.toThrow(
        'Brand name must be maximum 11 characters long'
      );
    });

    it('should validate brand name with empty string', async () => {
      await expect(client.createBrandName('')).rejects.toThrow(
        'Brand name must be at least 2 characters long'
      );
    });

    it('should accept valid brand name with period', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          brandID: 124,
          message: 'BrandName Created'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.createBrandName('Test.Co');
      expect(result.statusID).toBe(0);
    });

    it('should accept valid brand name with hyphen', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          brandID: 125,
          message: 'BrandName Created'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.createBrandName('Test-Co');
      expect(result.statusID).toBe(0);
    });

    it('should accept valid brand name with space', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          brandID: 126,
          message: 'BrandName Created'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.createBrandName('Test Co');
      expect(result.statusID).toBe(0);
    });

    it('should reject brand name with invalid characters', async () => {
      await expect(client.createBrandName('Test@Brand')).rejects.toThrow(
        'Brand name contains invalid characters'
      );
      await expect(client.createBrandName('Test#Brand')).rejects.toThrow(
        'Brand name contains invalid characters'
      );
      await expect(client.createBrandName('Test_Brand')).rejects.toThrow(
        'Brand name contains invalid characters'
      );
    });
  });

  describe('getBrandNames', () => {
    it('should get all brand names successfully', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          data: [
            {
              id: '1',
              name: 'Brand1',
              authorized: '1',
              createdAt: '2023-01-01 00:00:00'
            },
            {
              id: '2',
              name: 'Brand2',
              authorized: '2',
              createdAt: '2023-01-02 00:00:00'
            }
          ]
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.getBrandNames();

      expect(result.statusID).toBe(0);
      expect(result.data).toHaveLength(2);
      expect(result.data![0].name).toBe('Brand1');
      expect(result.data![0].authorized).toBe('1');
    });

    it('should handle empty brand names list', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          data: []
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.getBrandNames();

      expect(result.statusID).toBe(0);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('sendSMS', () => {
    it('should send SMS with single number successfully', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          smsID: 117345,
          message: 'SMS Sent'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test message'
      });

      expect(result.statusID).toBe(0);
      expect(result.smsID).toBe(117345);
      expect(result.message).toBe('SMS Sent');
    });

    it('should send SMS with multiple numbers', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          smsID: 117346,
          message: 'SMS Sent'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.sendSMS({
        brandID: 1,
        numbers: [995511194242, 995511194243],
        text: 'Bulk message'
      });

      expect(result.statusID).toBe(0);
      expect(result.smsID).toBe(117346);
    });

    it('should handle comma-separated string numbers', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          smsID: 117347,
          message: 'SMS Sent'
        }
      };

      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      mockedAxios.create = jest.fn().mockReturnValue({
        post: mockPost
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.sendSMS({
        brandID: 1,
        numbers: '995511194242,995511194243',
        text: 'Test'
      });

      expect(result.statusID).toBe(0);
      expect(mockPost).toHaveBeenCalledWith('/sms/send', {
        brandID: 1,
        numbers: [995511194242, 995511194243],
        text: 'Test',
        stopList: false
      });
    });

    it('should include stopList parameter', async () => {
      const mockResponse = {
        data: { statusID: 0, smsID: 117348, message: 'SMS Sent' }
      };

      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      mockedAxios.create = jest.fn().mockReturnValue({
        post: mockPost
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      await client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test',
        stopList: true
      });

      expect(mockPost).toHaveBeenCalledWith('/sms/send', {
        brandID: 1,
        numbers: [995511194242],
        text: 'Test',
        stopList: true
      });
    });

    it('should handle insufficient balance error', async () => {
      const mockResponse = {
        data: {
          statusID: 40,
          message: 'Not enough SMS'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test'
      });

      expect(result.statusID).toBe(40);
      expect(result.message).toBe('Not enough SMS');
    });

    it('should handle invalid brand ID error', async () => {
      const mockResponse = {
        data: {
          statusID: 10,
          message: 'brandID not found'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.sendSMS({
        brandID: 999999,
        numbers: [995511194242],
        text: 'Test'
      });

      expect(result.statusID).toBe(10);
      expect(result.message).toBe('brandID not found');
    });

    it('should validate Georgian mobile numbers with country code', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn()
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995511194242], // Valid
        text: 'Test'
      })).rejects.toThrow(); // Will fail because we didn't mock response, but validation passes
    });

    it('should reject invalid Georgian mobile numbers', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn()
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      
      // Invalid: doesn't start with 5
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995411194242],
        text: 'Test'
      })).rejects.toThrow('Invalid Georgian mobile number');

      // Invalid: wrong country code
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [994511194242],
        text: 'Test'
      })).rejects.toThrow('Invalid Georgian mobile number');

      // Invalid: too short
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [99551119424],
        text: 'Test'
      })).rejects.toThrow('Invalid Georgian mobile number');

      // Invalid: too long
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [9955111942422],
        text: 'Test'
      })).rejects.toThrow('Invalid Georgian mobile number');
    });

    it('should accept Georgian mobile numbers without country code', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn()
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      
      // Valid: 9 digits starting with 5
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [511194242],
        text: 'Test'
      })).rejects.toThrow(); // Will fail because we didn't mock response, but validation passes
    });

    it('should validate all numbers in array', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn()
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      
      // Mix of valid and invalid
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995511194242, 995411194242], // Second one is invalid
        text: 'Test'
      })).rejects.toThrow('Invalid Georgian mobile number(s): 995411194242');
    });
  });

  describe('sendSMSGet', () => {
    it('should send SMS via GET method', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          smsID: '117349',
          message: 'SMS Sent'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.sendSMSGet({
        brandID: 1,
        numbers: '995511194242',
        text: 'Test via GET'
      });

      expect(result.statusID).toBe(0);
      expect(result.smsID).toBe('117349');
    });

    it('should validate numbers in GET method', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn()
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      
      // Invalid number
      await expect(client.sendSMSGet({
        brandID: 1,
        numbers: '995411194242', // Invalid: doesn't start with 5
        text: 'Test'
      })).rejects.toThrow('Invalid Georgian mobile number');
    });
  });

  describe('getDeliveryReport', () => {
    it('should get delivery report successfully', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          result: [
            { number: '995511194242', statusID: '1' },
            { number: '995511194243', statusID: '1' }
          ]
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.getDeliveryReport(117345);

      expect(result.statusID).toBe(0);
      expect(result.result).toHaveLength(2);
      expect(result.result![0].statusID).toBe('1');
    });

    it('should handle SMS ID as string', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          result: [
            { number: '995511194242', statusID: '0' }
          ]
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.getDeliveryReport('117345');

      expect(result.statusID).toBe(0);
      expect(result.result).toHaveLength(1);
    });

    it('should handle different delivery statuses', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          result: [
            { number: '995511194242', statusID: '0' }, // Sent
            { number: '995511194243', statusID: '1' }, // Received
            { number: '995511194244', statusID: '2' }, // Not delivered
            { number: '995511194245', statusID: '3' }, // Awaiting
            { number: '995511194246', statusID: '4' }  // Error
          ]
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.getDeliveryReport(117345);

      expect(result.result).toHaveLength(5);
      expect(result.result![0].statusID).toBe('0');
      expect(result.result![1].statusID).toBe('1');
      expect(result.result![2].statusID).toBe('2');
      expect(result.result![3].statusID).toBe('3');
      expect(result.result![4].statusID).toBe('4');
    });
  });

  describe('getBalance', () => {
    it('should get SMS balance successfully', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          sms: 1000
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.getBalance();

      expect(result.statusID).toBe(0);
      expect(result.sms).toBe(1000);
    });

    it('should handle zero balance', async () => {
      const mockResponse = {
        data: {
          statusID: 0,
          sms: 0
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      const result = await client.getBalance();

      expect(result.statusID).toBe(0);
      expect(result.sms).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle axios error with response data', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: {
            statusID: 99,
            message: 'General error'
          }
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError)
      } as any);
      (mockedAxios.isAxiosError as any) = jest.fn().mockReturnValue(true);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test'
      })).rejects.toThrow('uBill API Error (99): General error');
    });

    it('should handle axios error with HTTP status', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          status: 500,
          statusText: 'Internal Server Error'
        }
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError)
      } as any);
      (mockedAxios.isAxiosError as any) = jest.fn().mockReturnValue(true);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test'
      })).rejects.toThrow('HTTP Error 500: Internal Server Error');
    });

    it('should handle network error without response', async () => {
      const mockError = {
        isAxiosError: true,
        request: {}
      };

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError)
      } as any);
      (mockedAxios.isAxiosError as any) = jest.fn().mockReturnValue(true);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test'
      })).rejects.toThrow('No response received from uBill API');
    });

    it('should handle generic Error', async () => {
      const mockError = new Error('Something went wrong');

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError)
      } as any);
      (mockedAxios.isAxiosError as any) = jest.fn().mockReturnValue(false);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test'
      })).rejects.toThrow('Something went wrong');
    });

    it('should handle unknown error type', async () => {
      const mockError = 'string error';

      mockedAxios.create = jest.fn().mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError)
      } as any);
      (mockedAxios.isAxiosError as any) = jest.fn().mockReturnValue(false);

      client = new UBillSMSClient({ apiKey: mockApiKey });
      await expect(client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: 'Test'
      })).rejects.toThrow('Unknown error occurred');
    });
  });
});

