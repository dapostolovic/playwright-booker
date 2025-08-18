import { BookingData } from '../types/common.types';

/**
 * Sample test data for booking scenarios
 */
export const testBookings: Omit<BookingData, 'id'>[] = [
  {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-02'
    },
    additionalneeds: 'Breakfast'
  },
  {
    firstname: 'Jane',
    lastname: 'Smith',
    totalprice: 200,
    depositpaid: false,
    bookingdates: {
      checkin: '2024-02-01',
      checkout: '2024-02-05'
    },
    additionalneeds: 'Late checkout'
  },
  {
    firstname: 'Bob',
    lastname: 'Wilson',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-03-15',
      checkout: '2024-03-20'
    }
  },
  {
    firstname: 'Alice',
    lastname: 'Johnson',
    totalprice: 300,
    depositpaid: false,
    bookingdates: {
      checkin: '2024-04-01',
      checkout: '2024-04-07'
    },
    additionalneeds: 'Pet friendly room'
  }
];

/**
 * Generate random booking data
 */
export const generateRandomBooking = (): Omit<BookingData, 'id'> => {
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Doe', 'Smith', 'Wilson', 'Johnson', 'Brown', 'Davis', 'Miller', 'Garcia'];
  const additionalNeeds = ['Breakfast', 'Late checkout', 'Pet friendly room', 'High floor', 'Ocean view', ''];

  const checkinDate = new Date();
  checkinDate.setDate(checkinDate.getDate() + Math.floor(Math.random() * 30)); // Random date within 30 days
  
  const checkoutDate = new Date(checkinDate);
  checkoutDate.setDate(checkoutDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after checkin

  return {
    firstname: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastname: lastNames[Math.floor(Math.random() * lastNames.length)],
    totalprice: Math.floor(Math.random() * 500) + 50, // $50-$550
    depositpaid: Math.random() > 0.5,
    bookingdates: {
      checkin: checkinDate.toISOString().split('T')[0],
      checkout: checkoutDate.toISOString().split('T')[0]
    },
    additionalneeds: additionalNeeds[Math.floor(Math.random() * additionalNeeds.length)]
  };
};

/**
 * Generate multiple random bookings
 */
export const generateRandomBookings = (count: number): Omit<BookingData, 'id'>[] => {
  return Array.from({ length: count }, () => generateRandomBooking());
};

/**
 * Test data for authentication scenarios
 */
export const testCredentials = {
  valid: {
    username: 'admin',
    password: 'password123'
  },
  invalid: [
    { username: 'invalid', password: 'wrongpass' },
    { username: 'admin', password: 'wrongpass' },
    { username: 'wronguser', password: 'password123' },
    { username: '', password: '' }
  ]
};

/**
 * Test data for edge cases
 */
export const edgeCaseBookings = {
  minimumPrice: {
    firstname: 'Min',
    lastname: 'Price',
    totalprice: 1,
    depositpaid: false,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-02'
    }
  },
  maximumPrice: {
    firstname: 'Max',
    lastname: 'Price',
    totalprice: 99999,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-02'
    }
  },
  longStay: {
    firstname: 'Long',
    lastname: 'Stay',
    totalprice: 1000,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-12-31'
    },
    additionalneeds: 'Extended stay with special requirements including daily housekeeping, laundry service, and premium amenities'
  },
  specialCharacters: {
    firstname: 'José',
    lastname: "O'Connor-Smith",
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-02'
    },
    additionalneeds: 'Habitación con vista al mar & desayuno incluído'
  }
};

/**
 * Performance test data
 */
export const performanceTestData = {
  lightLoad: generateRandomBookings(10),
  mediumLoad: generateRandomBookings(50),
  heavyLoad: generateRandomBookings(100)
};

export interface RoomData {
  type: 'Single' | 'Double' | 'Suite';
  title: string;
  price?: number;
  description?: string;
  amenities?: string[];
}

export interface RoomBookingData {
  roomType: string;
  roomTitle: string;
  isReserveButtonVisible: boolean;
}

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

export interface ContactFormData {
  name: string;  // Keep single name field
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormValidation {
  firstname: { required: true };
  lastname: { required: true };
  email: { required: true; format: 'email' };
  phone: { required: true; format: 'phone' };
  subject: { required: true; minLength: 5; maxLength: 100 };
  message: { required: true; minLength: 20; maxLength: 2000 };
}

/**
 * Test data for contact form scenarios
 */
export const contactFormTestData = {
  validContact: {
    name: 'John Doe',  // Keep single name field
    email: 'john.doe@example.com',
    phone: '+1234567890',
    subject: 'Inquiry about room booking',
    message: 'I would like to inquire about availability for a single room for next weekend. Please let me know the rates and availability.'
  },
  
  invalidContacts: {
    emptyName: {
      name: '',  // Keep single name field
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.'
    },
    
    invalidEmail: {
      name: 'John',
      email: 'invalid-email-format',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.'
    },
    
    shortSubject: {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Hi',  // Too short (less than 5 characters)
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.'
    },
    
    shortMessage: {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'Too short'  // Less than 20 characters
    }
  },
  
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

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  username: string;
  password: string;
  isLoggedIn?: boolean;
}

export interface AdminRoomData {
  id?: number;
  type: 'Single' | 'Double' | 'Suite';
  price: number;
  description?: string;
  amenities?: string[];
  isActive?: boolean;
}

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
  
  invalidRooms: {
    emptyRoomName: {
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
      }
    },
    
    invalidPrice: {
      roomName: '302',
      type: 'Single' as const,
      accessible: false,
      price: 0, // Invalid price (must be > 1)
      features: {
        wifi: false,
        refreshments: false,
        tv: false,
        safe: false,
        radio: false,
        views: false
      }
    }
  },
  
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

export interface AdminAuthCredentials {
  username: string;
  password: string;
}

export interface AdminAuthToken {
  token: string;
}

export interface ApiRoomData {
  roomName: string;
  type: string;
  accessible: boolean;
  description: string;
  image: string;
  roomPrice: string;
  features: string[];
}

export interface RoomCreationResponse {
  success: boolean;
}

/**
 * Test data for API room creation
 */
export const apiRoomTestData = {
  defaultRoom: {
    roomName: "105",
    type: "Suite",
    accessible: true,
    description: "Please enter a description for this room",
    image: "https://www.gentinghotel.co.uk/_next/image?url=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fstaticgh.gentinghotel.co.uk%2Fuploads%2Ffeed-cards%2F_750x750_crop_center-center_none%2FRW_Hotel_Finals_GentingSuiteTable_sqr.jpg&w=1080&q=75",
    roomPrice: "999",
    features: [
      "WiFi",
      "TV",
      "Radio", 
      "Refreshments",
      "Safe",
      "Views"
    ]
  },
  
  customTestRoom: {
    roomName: "201",
    type: "Double",
    accessible: false,
    description: "Test room created via API for UI testing",
    image: "https://www.gentinghotel.co.uk/_next/image?url=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fstaticgh.gentinghotel.co.uk%2Fuploads%2Ffeed-cards%2F_750x750_crop_center-center_none%2FRW_Hotel_Finals_GentingSuiteTable_sqr.jpg&w=1080&q=75",
    roomPrice: "150",
    features: [
      "WiFi",
      "TV"
    ]
  }
};

/**
 * Generate API room data with random room number
 */
export const generateApiRoomData = (roomNumber?: string): ApiRoomData => {
  const roomName = roomNumber || Math.floor(Math.random() * (999 - 201) + 201).toString();
  
  return {
    roomName,
    type: "Single",
    accessible: false,
    description: `Test room ${roomName} created via API`,
    image: "https://www.gentinghotel.co.uk/_next/image?url=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fstaticgh.gentinghotel.co.uk%2Fuploads%2Ffeed-cards%2F_750x750_crop_center-center_none%2FRW_Hotel_Finals_GentingSuiteTable_sqr.jpg&w=1080&q=75",
    roomPrice: Math.floor(Math.random() * (500 - 100) + 100).toString(),
    features: ["WiFi", "TV"]
  };
};
