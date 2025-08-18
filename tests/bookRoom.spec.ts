import { test, expect } from '../src/fixtures/test.fixtures';
import { BookingPage } from '../src/pages/booking.page';
import { roomTestData } from '../src/data/test-data';

test.describe('Room Booking Tests', () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page, ui }) => {
    bookingPage = new BookingPage(page);
    
    await test.step('Navigate to homepage with room selection', async () => {
      await bookingPage.gotoHomepage();
      expect(await bookingPage.isHomepageLoaded()).toBe(true);
    });
  });
  
  test('Initiate Single room booking and verify if it can be reserved', async ({ page, performStep }) => {
    const targetRoom = roomTestData.availableRooms.find(room => room.type === 'Single');
    
    if (!targetRoom) {
      throw new Error('Single room test data not found');
    }

    await performStep('Select Single room and click Book Now', async () => {
      await bookingPage.selectRoomAndInitiateBooking('Single');
    });

    await performStep('Verify Single Room details page is loaded', async () => {
      await bookingPage.verifyRoomDetailsPage('Single');
    });

    await performStep('Verify room header and Reserve Now button are visible', async () => {
      // Additional verification using the page object methods
      const headerText = await bookingPage.getRoomDetailsHeaderText();
      expect(headerText).toContain('Single Room');
      
      const isReserveButtonVisible = await bookingPage.isReserveNowButtonVisible();
      expect(isReserveButtonVisible).toBe(true);
    });
  });

  test('Verify all room types can be selected for booking', async ({ performStep }) => {
    const roomTypes: Array<'Single' | 'Double' | 'Suite'> = ['Single', 'Double', 'Suite'];

    for (const roomType of roomTypes) {
      await performStep(`Test ${roomType} room booking flow`, async () => {
        // Navigate back to homepage for each room type
        await bookingPage.gotoHomepage();
        
        // Select room and initiate booking
        await bookingPage.selectRoomAndInitiateBooking(roomType);
        
        // Verify room details page
        await bookingPage.verifyRoomDetailsPage(roomType);
        
        // Verify Reserve Now button is present
        expect(await bookingPage.isReserveNowButtonVisible()).toBe(true);
      });
    }
  });
});