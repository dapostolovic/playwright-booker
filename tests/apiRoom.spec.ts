import { test, expect } from '../src/fixtures/test.fixtures';
import { ApiUtils } from '../src/utils/api.utils';
import { ApiRoomHelpers } from '../src/utils/api.room.helpers';
import { apiRoomTestData } from '../src/data/test-data';

test.describe('API Room Creation Tests', () => {
  let apiUtils: ApiUtils;

  test.beforeEach(async () => {
    apiUtils = new ApiUtils();
  });

  test.describe('Admin Authentication', () => {
    test('Admin can authenticate and receive token', async ({ performStep }) => {
      let authResponse: any;

      await performStep('Authenticate admin user', async () => {
        authResponse = await apiUtils.authenticateAdmin({
          username: 'admin',
          password: 'password'
        });
      });

      await performStep('Verify authentication response', async () => {
        expect(authResponse.success).toBe(true);
        expect(authResponse.statusCode).toBe(200);
        expect(authResponse.data.token).toBeDefined();
        expect(typeof authResponse.data.token).toBe('string');
      });
    });

    test('Admin authentication fails with invalid credentials', async ({ performStep }) => {
      let authResponse: any;

      await performStep('Try to authenticate with invalid credentials', async () => {
        authResponse = await apiUtils.authenticateAdmin({
          username: 'invalid',
          password: 'wrongpassword'
        });
      });

      await performStep('Verify authentication failure', async () => {
        expect(authResponse.success).toBe(false);
        expect(authResponse.statusCode).not.toBe(200);
      });
    });
  });

  test.describe('Room Creation via API', () => {
    test('Create room with default data after admin authentication', async ({ performStep }) => {
      let roomResponse: any;

      await performStep('Create room using complete workflow', async () => {
        roomResponse = await apiUtils.createRoomWithAdminAuth();
      });

      await performStep('Verify room creation response', async () => {
        expect(roomResponse.success).toBe(true);
        expect(roomResponse.statusCode).toBe(200);
        expect(roomResponse.data.success).toBe(true);
      });
    });

    test('Create room with custom data', async ({ performStep }) => {
      const customRoomData = apiRoomTestData.customTestRoom;
      let roomResponse: any;

      await performStep('Create room with custom data', async () => {
        roomResponse = await apiUtils.createRoomWithAdminAuth(
          { username: 'admin', password: 'password' },
          customRoomData
        );
      });

      await performStep('Verify custom room creation', async () => {
        expect(roomResponse.success).toBe(true);
        expect(roomResponse.statusCode).toBe(200);
        expect(roomResponse.data.success).toBe(true);
      });
    });
  });

  test.describe('API Room Helpers', () => {
    test('Helper can create test room for preconditions', async ({ performStep }) => {
      let helperResult: any;

      await performStep('Use helper to create test room', async () => {
        helperResult = await ApiRoomHelpers.createDefaultTestRoom();
      });

      await performStep('Verify helper result', async () => {
        expect(helperResult.success).toBe(true);
        expect(helperResult.roomName).toBeDefined();
        expect(typeof helperResult.roomName).toBe('string');
      });
    });

    test('Helper can create room with specific number', async ({ performStep }) => {
      const roomNumber = '777';
      let helperResult: any;

      await performStep('Create room with specific number', async () => {
        helperResult = await ApiRoomHelpers.createRoomWithNumber(roomNumber);
      });

      await performStep('Verify room created with correct number', async () => {
        expect(helperResult.success).toBe(true);
        expect(helperResult.roomName).toBe(roomNumber);
      });
    });
  });
});
