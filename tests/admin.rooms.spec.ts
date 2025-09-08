import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminRooms } from '../pages/AdminRooms';
import { adminCredentials, adminRoomTestData } from '../src/data/test-data';
import { getInvalidRoomCreateExpectedErrorMessage, generateRandomRoomNumber } from '../src/utils/test-helpers';

test.describe('Admin Room Management Tests', () => {
  let mainPage: MainPage;
  let adminLogin: AdminLogin;
  let adminRooms: AdminRooms;
  let createdRoomName: string;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    adminLogin = new AdminLogin(page);
    adminRooms = new AdminRooms(page);
    await adminLogin.performLogin(adminCredentials.valid);
  });

  test.describe('Room Creation', () => {
    test('Admin can create a new room with all features', async () => {
      createdRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.generateValidRoom(),
        roomName: createdRoomName
      };
      
      await adminRooms.performCompleteRoomCreation(roomData);
      await expect(adminRooms.getRoomElement(createdRoomName), 'Room creation failed').toBeVisible();
    });

    // Data-driven negative tests for room creation
    for (const invalidRoom of adminRoomTestData.generateInvalidRooms()) {
      test(`Room creation fails with ${invalidRoom.testName}`, async () => {
        await adminRooms.attemptInvalidRoomCreation(invalidRoom);
        
        const expectedMessage = getInvalidRoomCreateExpectedErrorMessage(invalidRoom.testName!);
        await expect(adminRooms.getRoomCreationErrorElement(), 'Error message content is incorrect')
          .toContainText(expectedMessage);
      });
    }
  });

  test.describe('Room Deletion', () => {
    test('Admin can delete an existing room', async () => {
      const testRoomData = adminRoomTestData.generateValidRoom();
      const testRoomName = testRoomData.roomName;
      
      await adminRooms.performCompleteRoomCreation(testRoomData);
      await adminRooms.performRoomDeletion(testRoomName);
      await expect(adminRooms.getRoomElement(testRoomName), 'Room is not deleted').toBeHidden();
    });
  });

  test.describe('Room Management Workflow', () => {
    test('Admin can create and delete room in sequence', async () => {
      const workflowRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.generateValidRoom(),
        roomName: workflowRoomName
      };
      
      await adminRooms.performCompleteRoomCreation(roomData);   
      await expect(adminRooms.getRoomElement(workflowRoomName), 'Room is not created').toBeVisible();
      
      await adminRooms.performRoomDeletion(workflowRoomName);
      await expect(adminRooms.getRoomElement(workflowRoomName)).toBeHidden();
      await expect(adminRooms.getRoomElement(workflowRoomName), 'Room is not deleted').toBeHidden();
    });
  });
});
