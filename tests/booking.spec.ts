import { test, expect } from '../src/fixtures/test.fixtures';
import { BookingPage } from '../src/pages/booking.page';
import { BookingData } from '../src/types/common.types';

test.describe('Booking Management Tests', () => {
  let bookingPage: BookingPage;
  let createdBookingId: number;

  test.beforeEach(async ({ page, ui }) => {
    bookingPage = new BookingPage(page);
    
    await test.step('Navigate to booking page', async () => {
      await bookingPage.goto();
      expect(await bookingPage.isLoaded()).toBe(true);
    });
  });

  test('Create booking with API precondition and UI execution', async ({ 
    page, 
    api, 
    ui, 
    performStep 
  }) => {
    const bookingData: Omit<BookingData, 'id'> = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-15',
        checkout: '2024-01-20'
      },
      additionalneeds: 'Breakfast'
    };

    // API Precondition: Verify API is accessible
    await performStep('Verify API health check', async () => {
      const healthResponse = await api.healthCheck();
      expect(healthResponse.success).toBe(true);
    });

    // API Precondition: Ensure no existing bookings with same name
    await performStep('Check for existing bookings via API', async () => {
      const existingBookings = await api.getAllBookings();
      if (existingBookings.success && existingBookings.data) {
        const duplicateBooking = existingBookings.data.find(
          booking => booking.firstname === bookingData.firstname && 
                    booking.lastname === bookingData.lastname
        );
        expect(duplicateBooking).toBeUndefined();
      }
    });

    // UI Execution: Create booking through the interface
    await performStep('Create booking via UI', async () => {
      await bookingPage.createBooking(bookingData);
    });

    // UI Assertion: Verify success message appears
    await performStep('Verify success message in UI', async () => {
      const successMessage = await bookingPage.getSuccessMessage();
      expect(successMessage).toContain('Booking created successfully');
    });

    // API Assertion: Verify booking was created in backend
    await performStep('Verify booking creation via API', async () => {
      const allBookings = await api.getAllBookings();
      expect(allBookings.success).toBe(true);
      
      const createdBooking = allBookings.data?.find(
        booking => booking.firstname === bookingData.firstname && 
                  booking.lastname === bookingData.lastname
      );
      
      expect(createdBooking).toBeDefined();
      expect(createdBooking?.totalprice).toBe(bookingData.totalprice);
      expect(createdBooking?.depositpaid).toBe(bookingData.depositpaid);
      
      createdBookingId = createdBooking?.id!;
    });
  });

  test('Update booking with mixed API and UI operations', async ({ 
    api, 
    performStep 
  }) => {
    const originalBookingData: Omit<BookingData, 'id'> = {
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 200,
      depositpaid: false,
      bookingdates: {
        checkin: '2024-02-01',
        checkout: '2024-02-05'
      },
      additionalneeds: 'Late checkout'
    };

    const updatedData: Partial<BookingData> = {
      totalprice: 250,
      depositpaid: true,
      additionalneeds: 'Late checkout and breakfast'
    };

    // API Precondition: Create booking via API
    await performStep('Create booking via API for update test', async () => {
      const response = await api.createBooking(originalBookingData);
      expect(response.success).toBe(true);
      createdBookingId = response.data?.id!;
    });

    // UI Execution: Update booking through interface
    await performStep('Update booking via UI', async () => {
      await bookingPage.updateBooking(createdBookingId, updatedData);
    });

    // API Assertion: Verify changes were persisted
    await performStep('Verify update via API', async () => {
      const updatedBooking = await api.getBooking(createdBookingId);
      expect(updatedBooking.success).toBe(true);
      expect(updatedBooking.data?.totalprice).toBe(updatedData.totalprice);
      expect(updatedBooking.data?.depositpaid).toBe(updatedData.depositpaid);
      expect(updatedBooking.data?.additionalneeds).toBe(updatedData.additionalneeds);
    });

    // UI Assertion: Verify changes are reflected in UI
    await performStep('Verify update in UI', async () => {
      const bookingDetails = await bookingPage.getBookingDetails(createdBookingId);
      expect(bookingDetails?.totalprice).toBe(updatedData.totalprice);
      expect(bookingDetails?.depositpaid).toBe(updatedData.depositpaid);
    });
  });

  test('Delete booking with API verification', async ({ 
    api, 
    performStep 
  }) => {
    const bookingData: Omit<BookingData, 'id'> = {
      firstname: 'Bob',
      lastname: 'Wilson',
      totalprice: 300,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-03-01',
        checkout: '2024-03-03'
      }
    };

    // API Precondition: Create booking to delete
    await performStep('Create booking via API for deletion test', async () => {
      const response = await api.createBooking(bookingData);
      expect(response.success).toBe(true);
      createdBookingId = response.data?.id!;
    });

    // UI Precondition: Verify booking exists in UI
    await performStep('Verify booking exists in UI before deletion', async () => {
      const bookingExists = await bookingPage.isBookingInList(createdBookingId);
      expect(bookingExists).toBe(true);
    });

    // UI Execution: Delete booking through interface
    await performStep('Delete booking via UI', async () => {
      await bookingPage.deleteBooking(createdBookingId);
    });

    // UI Assertion: Verify booking is removed from UI
    await performStep('Verify booking removed from UI', async () => {
      const bookingExists = await bookingPage.isBookingInList(createdBookingId);
      expect(bookingExists).toBe(false);
    });

    // API Assertion: Verify booking is deleted in backend
    await performStep('Verify booking deletion via API', async () => {
      const deletedBooking = await api.getBooking(createdBookingId);
      expect(deletedBooking.success).toBe(false);
      expect(deletedBooking.statusCode).toBe(404);
    });
  });

  test('API-only operations for data validation', async ({ 
    api, 
    authenticatedApi, 
    performStep 
  }) => {
    const bookingData: Omit<BookingData, 'id'> = {
      firstname: 'Alice',
      lastname: 'Johnson',
      totalprice: 175,
      depositpaid: false,
      bookingdates: {
        checkin: '2024-04-01',
        checkout: '2024-04-05'
      },
      additionalneeds: 'Pet friendly room'
    };

    // API Execution: Test CRUD operations
    await performStep('Create booking via API', async () => {
      const createResponse = await api.createBooking(bookingData);
      expect(createResponse.success).toBe(true);
      expect(createResponse.data?.firstname).toBe(bookingData.firstname);
      createdBookingId = createResponse.data?.id!;
    });

    await performStep('Read booking via API', async () => {
      const getResponse = await api.getBooking(createdBookingId);
      expect(getResponse.success).toBe(true);
      expect(getResponse.data?.lastname).toBe(bookingData.lastname);
    });

    await performStep('Update booking via authenticated API', async () => {
      const updateData = { totalprice: 200 };
      const updateResponse = await authenticatedApi.updateBooking(createdBookingId, updateData);
      expect(updateResponse.success).toBe(true);
      expect(updateResponse.data?.totalprice).toBe(updateData.totalprice);
    });

    await performStep('Delete booking via authenticated API', async () => {
      const deleteResponse = await authenticatedApi.deleteBooking(createdBookingId);
      expect(deleteResponse.success).toBe(true);
    });

    await performStep('Verify booking deletion', async () => {
      const getResponse = await api.getBooking(createdBookingId);
      expect(getResponse.success).toBe(false);
    });
  });

  test('Error handling and validation', async ({ 
    api, 
    performStep 
  }) => {
    // Test API error handling
    await performStep('Test invalid booking ID via API', async () => {
      const response = await api.getBooking(99999);
      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(404);
    });

    // Test UI error handling
    await performStep('Test invalid form submission in UI', async () => {
      const invalidBookingData: Omit<BookingData, 'id'> = {
        firstname: '', // Invalid: empty firstname
        lastname: 'Test',
        totalprice: -100, // Invalid: negative price
        depositpaid: true,
        bookingdates: {
          checkin: '2024-12-31',
          checkout: '2024-01-01' // Invalid: checkout before checkin
        }
      };

      await bookingPage.fillBookingForm(invalidBookingData);
      await bookingPage.ui.clickElement('[data-testid="save-booking"]');
      
      // Should show error message
      await bookingPage.waitForErrorMessage();
      const errorMessage = await bookingPage.getErrorMessage();
      expect(errorMessage).toContain('validation');
    });
  });

  test.afterEach(async ({ api, performStep }) => {
    // Cleanup: Remove created bookings
    if (createdBookingId) {
      await performStep('Cleanup: Delete test booking', async () => {
        try {
          await api.deleteBooking(createdBookingId);
        } catch (error) {
          console.log('Cleanup: Booking already deleted or error occurred:', error);
        }
      });
    }
  });
});
