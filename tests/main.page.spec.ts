import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { roomTestData } from '../src/data/test-data';

test.describe('Main Page Tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await test.step('Navigate to main page', async () => {
      await mainPage.gotoMainPage();
    });
  });

  test('should display welcome title', async () => {
    await test.step('Verify welcome title is visible', async () => {
      const isTitleVisible = await mainPage.isWelcomeTitleVisible();
      expect(isTitleVisible).toBeTruthy();
    });
  });

  test('welcome title should contain name of the hotel', async () => {
    await test.step('Get welcome title text', async () => {
      const welcomeTitleText = await mainPage.getWelcomeTitleText();
      expect(welcomeTitleText).toContain('Welcome to Shady Meadows B&B');
    });
  });

  test('Initiate Single room booking and verify if it can be reserved', async () => {
    const targetRoom = roomTestData.availableRooms.find(room => room.type === 'Single');
    
    if (!targetRoom) {
      throw new Error('Single room test data not found');
    }

    await test.step('Select Single room and initiate booking', async () => {
      await mainPage.selectRoomAndInitiateBooking('Single');
    });

    await test.step('Verify Single Room details page is loaded', async () => {
      await mainPage.verifyRoomDetailsPage('Single');
    });

    await test.step('Verify room header and Reserve Now button are visible', async () => {
      const headerText = await mainPage.getRoomDetailsHeaderText();
      expect(headerText).toContain('Single Room');
      
      const isReserveButtonVisible = await mainPage.isReserveNowButtonVisible();
      expect(isReserveButtonVisible).toBe(true);
    });
  });

  test('Verify all room types can be selected for booking', async () => {
    const roomTypes: Array<'Single' | 'Double' | 'Suite'> = ['Single', 'Double', 'Suite'];

    for (const roomType of roomTypes) {
      await test.step(`Test booking for ${roomType} room type`, async () => {
        await test.step('Navigate back to homepage', async () => {
          await mainPage.gotoMainPage();
        });
        
        await test.step('Select room and initiate booking', async () => {
          await mainPage.selectRoomAndInitiateBooking(roomType);
        });
        
        await test.step('Verify room details page', async () => {
          await mainPage.verifyRoomDetailsPage(roomType);
        });
        
        await test.step('Verify Reserve Now button is present', async () => {
          expect(await mainPage.isReserveNowButtonVisible()).toBe(true);
        });
      });
    }
  });
});
