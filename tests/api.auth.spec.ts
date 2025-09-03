import { test, expect } from '@playwright/test';
import { adminRoomTestData } from '../src/data/test-data';

// Get API base URL from Playwright configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost/api/';

// Generate a unique room name by adding random digits
function generateUniqueRoomName(baseName: string): string {
  const randomDigits = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${baseName}${randomDigits}`;
}

test.describe('API Room Management Tests', () => {
  let authToken: string;
  let createdRoomName: string;
  let createdRoomId: number;

  test.beforeEach(async ({ request }) => {
    await test.step('Authenticate and get access token for room management', async () => {
      const loginResponse = await request.post(`${API_BASE_URL}auth/login`, {
        data: {
          username: 'admin',
          password: 'password'
        },
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      expect(loginResponse.status()).toBe(200);
      const loginBody = await loginResponse.json();
      expect(loginBody).toHaveProperty('token');
      authToken = loginBody.token;
    });
  });

  test('should create room successfully via API', async ({ request }) => {
    await test.step('Create room using API with valid data and authentication token', async () => {
      const uniqueRoomName = generateUniqueRoomName(adminRoomTestData.testRoomForAPI.roomName);
      createdRoomName = uniqueRoomName; // Store for later tests
      const requestHeaders = {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Cookie': `token=${authToken}`
      };
            
      const response = await request.post(`${API_BASE_URL}room`, {
        headers: requestHeaders,
        data: {
          roomName: uniqueRoomName,
          type: adminRoomTestData.testRoomForAPI.type,
          accessible: adminRoomTestData.testRoomForAPI.accessible,
          description: adminRoomTestData.testRoomForAPI.description,
          image: adminRoomTestData.testRoomForAPI.image,
          roomPrice: adminRoomTestData.testRoomForAPI.roomPrice,
          features: [
            'WiFi',
            'TV',
            'Radio',
            'Refreshments',
            'Safe',
            'Views'
          ]
        }
      });
      
      if (response.status() !== 200) {
        console.log('Room creation response body:', await response.text());
      }
      expect(response.status()).toBe(200);
  
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success');
      expect(responseBody.success).toBe(true);
    });
  });

  test('should retrieve room ID for created room', async ({ request }) => {
    await test.step('Get list of rooms and extract room ID for the created room', async () => {
      const response = await request.get(`${API_BASE_URL}room`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Cookie': `token=${authToken}`
        }
      });
      
      if (response.status() !== 200) {
        console.log('Get rooms response body:', await response.text());
      }
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('rooms');
      expect(Array.isArray(responseBody.rooms)).toBe(true);
      
      // Find the room with matching roomName
      const createdRoom = responseBody.rooms.find((room: any) => room.roomName === createdRoomName);
      expect(createdRoom).toBeDefined();
      expect(createdRoom).toHaveProperty('roomid');
      
      createdRoomId = createdRoom.roomid;
      // Verify other room properties match what we created
      expect(createdRoom.type).toBe(adminRoomTestData.testRoomForAPI.type);
      expect(createdRoom.accessible).toBe(adminRoomTestData.testRoomForAPI.accessible);
      expect(createdRoom.roomPrice).toBe(adminRoomTestData.testRoomForAPI.roomPrice);
    });
  });

  test('should delete the created room', async ({ request }) => {
    await test.step('Delete the room using the extracted room ID', async () => {
      const deleteUrl = `${API_BASE_URL}room/${createdRoomId}`;
      const response = await request.delete(deleteUrl, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Cookie': `token=${authToken}`
        }
      });
      
      if (response.status() !== 200) {
        console.log('Delete room response body:', await response.text());
      }

      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('success');
      expect(responseBody.success).toBe(true);
    });
  });

  test('should fail to create room without authentication token', async ({ request }) => {
    await test.step('Attempt to create room without authentication token', async () => {
      const uniqueRoomName = generateUniqueRoomName(adminRoomTestData.testRoomForAPI.roomName);
      const response = await request.post(`${API_BASE_URL}room`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
          // No Authorization header or Cookie
        },
        data: {
          roomName: uniqueRoomName,
          type: adminRoomTestData.testRoomForAPI.type,
          accessible: adminRoomTestData.testRoomForAPI.accessible,
          description: adminRoomTestData.testRoomForAPI.description,
          image: adminRoomTestData.testRoomForAPI.image,
          roomPrice: adminRoomTestData.testRoomForAPI.roomPrice,
          features: [
            'WiFi',
            'TV',
            'Radio',
            'Refreshments',
            'Safe',
            'Views'
          ]
        }
      });

      // Should fail with 401 (Unauthorized) or 403 (Forbidden)
      expect(response.status()).toBeGreaterThanOrEqual(401);
    });
  });
});
