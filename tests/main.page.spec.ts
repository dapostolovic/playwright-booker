import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { roomTestData } from '../src/data/test-data';

test.describe('Main Page Tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.performHomepageNavigation();
  });

  test('should display welcome title', async () => {
    const isTitleVisible = await mainPage.isWelcomeTitleVisible();
    expect(isTitleVisible).toBeTruthy();
  });

  test('welcome title should contain name of the hotel', async () => {
    const welcomeTitleText = await mainPage.getWelcomeTitleText();
    expect(welcomeTitleText,'Welcome title does not contain the name of the hotel').toContain('Welcome to Shady Meadows B&B');
  });

  test('Initiate Single room booking and verify if it can be reserved', async () => {
    const targetRoom = roomTestData.availableRooms.find(room => room.type === 'Single');
    await mainPage.selectRoomAndInitiateBooking('Single');

    const roomHeaderLocator = await mainPage.getRoomDetailsHeaderLocator('Single');
    await expect(roomHeaderLocator,'Room header is not visible').toBeVisible();
    
    const reserveButtonLocator = await mainPage.getReserveNowButtonLocator();
    await expect(reserveButtonLocator,'Reserve now button is not visible').toBeVisible();
    
    const headerText = await mainPage.getRoomDetailsHeaderText();
    expect(headerText,'Room header text is not correct').toContain('Single Room');
    
    const isReserveButtonVisible = await mainPage.isReserveNowButtonVisible();
    expect(isReserveButtonVisible,'Reserve now button is not visible').toBe(true);
  });

  test('Verify all room types can be selected for booking', async () => {
    const roomTypes: Array<'Single' | 'Double' | 'Suite'> = ['Single', 'Double', 'Suite'];

    for (const roomType of roomTypes) {
      await mainPage.gotoMainPage();
      await mainPage.selectRoomAndInitiateBooking(roomType);
      
      const roomHeaderLocator = await mainPage.getRoomDetailsHeaderLocator(roomType);
      await expect(roomHeaderLocator, 'Room header is not visible').toBeVisible();
      
      const reserveButtonLocator = await mainPage.getReserveNowButtonLocator();
      await expect(reserveButtonLocator,'Reserve now button is not visible').toBeVisible();      
      expect(await mainPage.isReserveNowButtonVisible(),'Reserve now button is not visible').toBe(true);
    }
  });
});
