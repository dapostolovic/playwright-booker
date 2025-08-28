import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { roomTestData } from '../src/data/test-data';

test.describe('Main Page Tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
  });

  test('should display welcome title', async () => {
    // Verify the welcome title is visible
    const isTitleVisible = await mainPage.isWelcomeTitleVisible();
    expect(isTitleVisible).toBeTruthy();
  });

  test('welcome title should contain name of the hotel', async () => {
    // Verify the welcome title contains the specific hotel name
    const welcomeTitleText = await mainPage.getWelcomeTitleText();
    expect(welcomeTitleText).toContain('Welcome to Shady Meadows B&B');
  });

  test('Initiate Single room booking and verify if it can be reserved', async () => {
    const targetRoom = roomTestData.availableRooms.find(room => room.type === 'Single');
    
    if (!targetRoom) {
      throw new Error('Single room test data not found');
    }

    // Select Single room and click Book Now
    await mainPage.selectRoomAndInitiateBooking('Single');

    // Verify Single Room details page is loaded
    await mainPage.verifyRoomDetailsPage('Single');

    // Verify room header and Reserve Now button are visible
    const headerText = await mainPage.getRoomDetailsHeaderText();
    expect(headerText).toContain('Single Room');
    
    const isReserveButtonVisible = await mainPage.isReserveNowButtonVisible();
    expect(isReserveButtonVisible).toBe(true);
  });

  test('Verify all room types can be selected for booking', async () => {
    const roomTypes: Array<'Single' | 'Double' | 'Suite'> = ['Single', 'Double', 'Suite'];

    for (const roomType of roomTypes) {
      // Navigate back to homepage for each room type
      await mainPage.gotoMainPage();
      
      // Select room and initiate booking
      await mainPage.selectRoomAndInitiateBooking(roomType);
      
      // Verify room details page
      await mainPage.verifyRoomDetailsPage(roomType);
      
      // Verify Reserve Now button is present
      expect(await mainPage.isReserveNowButtonVisible()).toBe(true);
    }
  });
});
