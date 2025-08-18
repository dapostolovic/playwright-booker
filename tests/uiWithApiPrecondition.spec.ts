import { test, expect } from '../src/fixtures/test.fixtures';
import { ApiRoomHelpers } from '../src/utils/api.room.helpers';
import { BookingPage } from '../src/pages/booking.page';

test.describe('UI Tests with API Room Preconditions', () => {
  
  test('Book a room that was created via API', async ({ page, performStep }) => {
    let createdRoom: any;
    let bookingPage: BookingPage;

    await performStep('Create room via API as precondition', async () => {
      createdRoom = await ApiRoomHelpers.createCustomTestRoom();
      expect(createdRoom.success).toBe(true);
    });

    await performStep('Navigate to booking page', async () => {
      bookingPage = new BookingPage(page);
      await bookingPage.gotoHomepage();
    });

    await performStep('Verify the API-created room is available for booking', async () => {
      // The room should now be available in the UI
      // This is where you'd implement room booking logic
      console.log(`Room ${createdRoom.roomName} is ready for UI testing`);
    });
  });
});
