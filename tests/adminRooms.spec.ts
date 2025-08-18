import { test, expect } from '../src/fixtures/test.fixtures';
import { AdminPage } from '../src/pages/admin.page';
import { adminRoomTestData, generateRandomRoomNumber } from '../src/data/test-data';

test.describe('Admin Room Management Tests', () => {
  let adminPage: AdminPage;
  let createdRoomName: string;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
  });

  test.describe('Room Creation', () => {
    test('Admin can create a new room with all features', async ({ performStep }) => {
      createdRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.validRoom,
        roomName: createdRoomName
      };

      await performStep('Login to admin portal', async () => {
        await adminPage.goto();
        await adminPage.loginAndVerifySuccess({ username: 'admin', password: 'password' });
      });

      await performStep('Navigate to rooms management page', async () => {
        await adminPage.navigateToRooms();
        expect(await adminPage.isRoomsPageLoaded()).toBe(true);
      });

      await performStep('Fill room creation form with valid data', async () => {
        await adminPage.fillRoomForm(roomData);
      });

      await performStep('Submit room creation', async () => {
        await adminPage.submitRoomCreation();
      });

      await performStep('Verify room was created successfully', async () => {
        await adminPage.verifyRoomCreated(createdRoomName);
      });
    });

    test('Room creation fails with empty room name', async ({ performStep }) => {
      const invalidRoomData = adminRoomTestData.invalidRooms.emptyRoomName;

      await performStep('Login to admin portal', async () => {
        await adminPage.goto();
        await adminPage.loginAndVerifySuccess({ username: 'admin', password: 'password' });
      });

      await performStep('Navigate to rooms management page', async () => {
        await adminPage.navigateToRooms();
      });

      await performStep('Fill room creation form with empty room name', async () => {
        await adminPage.fillRoomForm(invalidRoomData);
      });

      await performStep('Submit room creation', async () => {
        await adminPage.submitRoomCreation();
      });

      await performStep('Verify error message is displayed', async () => {
        await adminPage.verifyRoomCreationError();
      });
    });

    test('Room creation fails with invalid price', async ({ performStep }) => {
      const invalidRoomData = adminRoomTestData.invalidRooms.invalidPrice;

      await performStep('Login to admin portal', async () => {
        await adminPage.goto();
        await adminPage.loginAndVerifySuccess({ username: 'admin', password: 'password' });
      });

      await performStep('Navigate to rooms management page', async () => {
        await adminPage.navigateToRooms();
      });

      await performStep('Fill room creation form with invalid price', async () => {
        await adminPage.fillRoomForm(invalidRoomData);
      });

      await performStep('Submit room creation', async () => {
        await adminPage.submitRoomCreation();
      });

      await performStep('Verify error message is displayed', async () => {
        await adminPage.verifyRoomCreationError();
      });
    });
  });

  test.describe('Room Deletion', () => {
    test('Admin can delete an existing room', async ({ performStep }) => {
      const testRoomName = '999';
      const testRoomData = {
        ...adminRoomTestData.testRoom,
        roomName: testRoomName
      };

      await performStep('Login to admin portal', async () => {
        await adminPage.goto();
        await adminPage.loginAndVerifySuccess({ username: 'admin', password: 'password' });
      });

      await performStep('Navigate to rooms management page', async () => {
        await adminPage.navigateToRooms();
      });

      await performStep('Create a test room for deletion', async () => {
        await adminPage.createRoom(testRoomData);
        await adminPage.verifyRoomCreated(testRoomName);
      });

      await performStep('Delete the test room', async () => {
        await adminPage.deleteRoom(testRoomName);
      });

      await performStep('Verify room was deleted (disappeared within 500ms)', async () => {
        await adminPage.verifyRoomDeleted(testRoomName);
      });
    });
  });

  test.describe('Room Management Workflow', () => {
    test('Admin can create and delete room in sequence', async ({ performStep }) => {
      const workflowRoomName = generateRandomRoomNumber();
      const roomData = {
        ...adminRoomTestData.validRoom,
        roomName: workflowRoomName
      };

      await performStep('Login to admin portal', async () => {
        await adminPage.goto();
        await adminPage.loginAndVerifySuccess({ username: 'admin', password: 'password' });
      });

      await performStep('Navigate to rooms management page', async () => {
        await adminPage.navigateToRooms();
      });

      await performStep('Create a new room', async () => {
        await adminPage.createRoom(roomData);
        await adminPage.verifyRoomCreated(workflowRoomName);
      });

      await performStep('Delete the created room', async () => {
        await adminPage.deleteRoom(workflowRoomName);
        await adminPage.verifyRoomDeleted(workflowRoomName);
      });
    });
  });
});
