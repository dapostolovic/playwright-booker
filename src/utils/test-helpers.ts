export function getInvalidRoomCreateExpectedErrorMessage(testName: string): string {
  switch (testName) {
    case 'Empty room name':
      return 'Room name must be set';
    case 'Price is zero':
    case 'Negative price':
      return 'must be greater than or equal to 1';
    case 'Price less than 1':
      return 'Failed to create room';
    default:
      throw new Error(`Unknown test name: ${testName}`);
  }
}

export function getInvalidMessageSendExpectedErrorMessage(testName: string): string {
  switch (testName) {
    case 'Empty name':
      return 'Name may not be blank';
    case 'Empty email':
      return 'Email may not be blank';
    case 'Invalid email format':
      return 'must be a well-formed email address';
    case 'Short subject':
      return 'Subject must be between 5 and 100 characters.';
    case 'Short message':
      return 'Message must be between 20 and 2000 characters.';
    case 'Empty phone':
      return 'Phone may not be blank';
    default:
      throw new Error(`Unknown contact test name: ${testName}`);
  }
}

// Generate unique room name for API tests
export function generateUniqueRoomName(baseName: string): string {
  const randomDigits = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${baseName}_${randomDigits}`;
}

// Generate random room number for admin tests
export function generateRandomRoomNumber(): string {
  return Math.floor(Math.random() * 9000 + 1000).toString();
}
