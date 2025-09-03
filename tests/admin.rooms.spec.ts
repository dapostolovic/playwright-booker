import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminRooms } from '../pages/AdminRooms';
import { adminRoomTestData, generateRandomRoomNumber } from '../src/data/test-data';

test.describe('Admin Room Management Tests', () => {
  let mainPage: MainPage;
  let adminLogin: AdminLogin;
  let adminRooms: AdminRooms;
  let createdRoomName: string;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    adminLogin = new AdminLogin(page);
    adminRooms = new AdminRooms(page);
    
    await test.step('Navigate to admin login page', async () => {
      await mainPage.gotoMainPage();
      await mainPage.navigateToAdminLogin();
    });
    
    await test.step('Authenticate as admin user', async () => {
      await adminLogin.login({ username: 'admin', password: 'password' });
    });
  });

  test.describe('Room Creation', () => {
    test('Admin can create a new room with all features', async () => {
      createdRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.validRoom,
        roomName: createdRoomName
      };
      
      await test.step('Verify rooms page is loaded', async () => {
        expect(await adminRooms.isRoomsPageLoaded()).toBe(true);
      });
      
      await test.step('Fill room creation form with valid data', async () => {
        await adminRooms.fillRoomForm(roomData);
      });
      
      await test.step('Submit room creation form', async () => {
        await adminRooms.submitRoomCreation();
      });
      
      await test.step('Verify room was created successfully', async () => {
        await expect(adminRooms.getRoomElement(createdRoomName)).toBeVisible({ timeout: 500 });
      });
    });

    // Data-driven negative tests for room creation
    for (const invalidRoom of adminRoomTestData.invalidRooms) {
      test(`Room creation fails with ${invalidRoom.testName}`, async () => {
        await test.step('Attempt to create room with invalid data', async () => {
          await adminRooms.attemptInvalidRoomCreation(invalidRoom);
        });
        
        await test.step('Verify error message is displayed', async () => {
          await expect(adminRooms.getRoomCreationErrorElement()).toBeVisible({ timeout: 500 });
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
      
      await test.step('Create a test room for deletion', async () => {
        await adminRooms.createRoom(testRoomData);
      });
      
      await test.step('Verify test room exists before deletion', async () => {
        await expect(adminRooms.getRoomElement(testRoomName)).toBeVisible({ timeout: 500 });
      });
      
      await test.step('Delete the test room', async () => {
        await adminRooms.deleteRoom(testRoomName);
      });
      
      await test.step('Verify room was deleted successfully', async () => {
        await expect(adminRooms.getRoomElement(testRoomName)).toBeHidden({ timeout: 500 });
      });
    });
  });

  test.describe('Room Management Workflow', () => {
    test('Admin can create and delete room in sequence', async () => {
      const workflowRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.validRoom,
        roomName: workflowRoomName
      };
      
      await test.step('Create a new room for workflow testing', async () => {
        await adminRooms.createRoom(roomData);
      });
      
      await test.step('Verify room creation was successful', async () => {
        await expect(adminRooms.getRoomElement(workflowRoomName)).toBeVisible({ timeout: 500 });
      });
      
      await test.step('Delete the room to complete workflow', async () => {
        await adminRooms.deleteRoom(workflowRoomName);
      });
      
      await test.step('Verify room deletion was successful', async () => {
        await expect(adminRooms.getRoomElement(workflowRoomName)).toBeHidden({ timeout: 500 });
      });
    });
  });
});
