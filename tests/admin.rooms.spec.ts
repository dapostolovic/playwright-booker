import { test, expect } from '@playwright/test';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminRooms } from '../pages/AdminRooms';
import { adminRoomTestData, generateRandomRoomNumber } from '../src/data/test-data';

test.describe('Admin Room Management Tests', () => {
  let adminLogin: AdminLogin;
  let adminRooms: AdminRooms;
  let createdRoomName: string;

  test.beforeEach(async ({ page }) => {
    adminLogin = new AdminLogin(page);
    adminRooms = new AdminRooms(page);
  });

  test.describe('Room Creation', () => {
    test('Admin can create a new room with all features', async () => {
      createdRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.validRoom,
        roomName: createdRoomName
      };
      await adminLogin.goto();
      await adminLogin.loginAndNavigateToRooms({ username: 'admin', password: 'password' });
      expect(await adminRooms.isRoomsPageLoaded()).toBe(true);
      await adminRooms.fillRoomForm(roomData);
      await adminRooms.submitRoomCreation();
      await adminRooms.verifyRoomCreated(createdRoomName);
    });

    // Data-driven negative tests for room creation
    for (const invalidRoom of adminRoomTestData.invalidRooms) {
      test(`Room creation fails with ${invalidRoom.testName}`, async () => {
        await test.step('Login and navigate to rooms page', async () => {
          await adminLogin.goto();
          await adminLogin.loginAndNavigateToRooms({ username: 'admin', password: 'password' });
        });

        await test.step(`Fill room form with invalid data: ${invalidRoom.testName}`, async () => {
          await adminRooms.fillRoomForm(invalidRoom);
        });

        await test.step('Submit room creation', async () => {
          await adminRooms.submitRoomCreation();
        });

        await test.step('Verify error message is displayed', async () => {
          await adminRooms.verifyRoomCreationError();
        });
      });
    }
  });

  test.describe('Room Deletion', () => {
    test('Admin can delete an existing room', async () => {
      const testRoomName = '999';
      const testRoomData = {
        ...adminRoomTestData.testRoom,
        roomName: testRoomName
      };
      await adminLogin.goto();
      await adminLogin.loginAndNavigateToRooms({ username: 'admin', password: 'password' });
      await adminRooms.createRoom(testRoomData);
      await adminRooms.verifyRoomCreated(testRoomName);
      await adminRooms.deleteRoom(testRoomName);
      await adminRooms.verifyRoomDeleted(testRoomName);
    });
  });

  test.describe('Room Management Workflow', () => {
    test('Admin can create and delete room in sequence', async () => {
      const workflowRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.validRoom,
        roomName: workflowRoomName
      };
      await adminLogin.goto();
      await adminLogin.loginAndNavigateToRooms({ username: 'admin', password: 'password' });
      await adminRooms.createRoom(roomData);
      await adminRooms.verifyRoomCreated(workflowRoomName);
      await adminRooms.deleteRoom(workflowRoomName);
      await adminRooms.verifyRoomDeleted(workflowRoomName);
    });
  });
});
