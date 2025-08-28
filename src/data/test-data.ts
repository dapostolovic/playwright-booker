/**
 * Test data for room selection scenarios
 */
export const roomTestData = {
  availableRooms: [
    {
      type: 'Single' as const,
      title: 'Single Room',
      price: 100,
      description: 'Comfortable single occupancy room',
      amenities: ['WiFi', 'TV', 'Air Conditioning']
    },
    {
      type: 'Double' as const,
      title: 'Double Room',
      price: 150,
      description: 'Spacious double occupancy room',
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar']
    },
    {
      type: 'Suite' as const,
      title: 'Suite',
      price: 300,
      description: 'Luxury suite with separate living area',
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi']
    }
  ]
};

/**
 * Test data for contact form scenarios
 */
export const contactFormTestData = {
  validContact: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    subject: 'Inquiry about room booking',
    message: 'I would like to inquire about availability for a single room for next weekend. Please let me know the rates and availability.'
  },
  
  // Data-driven invalid contacts
  invalidContacts: [
    {
      name: '',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.',
      testName: 'Empty name'
    },
    {
      name: 'John',
      email: 'invalid-email-format',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.',
      testName: 'Invalid email format'
    },
    {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Hi',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.',
      testName: 'Short subject'
    },
    {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'Too short',
      testName: 'Short message'
    },
    {
      name: 'John',
      email: '',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.',
      testName: 'Empty email'
    },
    {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.',
      testName: 'Empty phone'
    }
  ],
  
  edgeCases: {
    maxLengthSubject: {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'A'.repeat(100),  // Exactly 100 characters (max allowed)
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement for testing.'
    },
    
    maxLengthMessage: {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Testing maximum message length',
      message: 'A'.repeat(2000)  // Exactly 2000 characters (max allowed)
    }
  }
};

/**
 * Test data for admin portal authentication
 */
export const adminCredentials = {
  valid: {
    username: 'admin',
    password: 'password'
  },
  invalid: [
    { username: 'wrongadmin', password: 'password' },
    { username: 'admin', password: 'wrongpassword' },
    { username: '', password: '' },
    { username: 'admin', password: '' },
    { username: '', password: 'password' }
  ]
};

/**
 * Test data for admin room management
 */
export const adminRoomTestData = {
  validRoom: {
    roomName: '301',
    type: 'Double' as const,
    accessible: true,
    price: 150,
    features: {
      wifi: true,
      refreshments: true,
      tv: true,
      safe: true,
      radio: true,
      views: true
    }
  },
  
  // Data-driven invalid rooms
  invalidRooms: [
    {
      roomName: '',
      type: 'Single' as const,
      accessible: false,
      price: 100,
      features: {
        wifi: false,
        refreshments: false,
        tv: false,
        safe: false,
        radio: false,
        views: false
      },
      testName: 'Empty room name'
    },
    {
      roomName: '302',
      type: 'Single' as const,
      accessible: false,
      price: 0,
      features: {
        wifi: false,
        refreshments: false,
        tv: false,
        safe: false,
        radio: false,
        views: false
      },
      testName: 'Price is zero'
    },
    {
      roomName: '303',
      type: 'Single' as const,
      accessible: false,
      price: -50,
      features: {
        wifi: false,
        refreshments: false,
        tv: false,
        safe: false,
        radio: false,
        views: false
      },
      testName: 'Negative price'
    },
    {
      roomName: '304',
      type: 'Single' as const,
      accessible: false,
      price: 0.5,
      features: {
        wifi: false,
        refreshments: false,
        tv: false,
        safe: false,
        radio: false,
        views: false
      },
      testName: 'Price less than 1'
    }
  ],
  
  testRoom: {
    roomName: '999', // For deletion test
    type: 'Suite' as const,
    accessible: false,
    price: 250,
    features: {
      wifi: true,
      refreshments: false,
      tv: true,
      safe: false,
      radio: false,
      views: true
    }
  }
};

/**
 * Generate random room number for testing
 */
export const generateRandomRoomNumber = (): string => {
  return Math.floor(Math.random() * (999 - 201) + 201).toString();
};
