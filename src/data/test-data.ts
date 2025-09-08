import { faker } from '@faker-js/faker';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  testName?: string; // Contact forms are used in both positive and negative scenarios, so testName should be optional
}

interface AdminRoomFormData {
  roomName: string;
  type: 'Single' | 'Double' | 'Suite';
  accessible: boolean;
  price: number;
  features: {
    wifi: boolean;
    refreshments: boolean;
    tv: boolean;
    safe: boolean;
    radio: boolean;
    views: boolean;
  };
  testName: string; //Admin rooms are primarily used in data-driven negative testing, so testName should be mandatory
}

//Test data for admin portal authentication
export const adminCredentials = { 
  valid: {
    username: 'admin',
    password: 'password'
  },
  invalid: {
    username: faker.internet.username(),
    password: faker.internet.password()
  },
};

//Test data for room selection scenarios
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

//Test data for sending contact form scenarios
export const contactFormTestData = {
  generateContact: (overrides: Partial<ContactFormData> = {}) => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'international' }),
    subject: faker.lorem.sentence({ min: 2, max: 5 }),
    message: faker.lorem.paragraph({ min: 2, max: 4 }),
    ...overrides
  }),

  generateValidContact: () => contactFormTestData.generateContact(),
  
  generateMaxLengthContact: () => contactFormTestData.generateContact({
    subject: faker.lorem.sentence({ min: 100, max: 100 }).slice(0, 100)
  }),

  generateMaxLengthMessageContact: () => contactFormTestData.generateContact({
    message: faker.lorem.paragraph({ min: 2000, max: 2000 }).slice(0, 2000)
  }),

  // Generate invalid contacts data
  generateInvalidContacts: () => [

    contactFormTestData.generateContact({
      name: '',
      testName: 'Empty name'
    }),
    
    contactFormTestData.generateContact({
      email: faker.lorem.word(), 
      testName: 'Invalid email format'
    }),
    
    contactFormTestData.generateContact({
      subject: faker.string.alpha({ length: { min: 1, max: 4 } }), // 1-4 characters
      testName: 'Short subject'
    }),
    
    contactFormTestData.generateContact({
      message: faker.string.alpha({ length: { min: 1, max: 19 } }), // 1-19 characters
      testName: 'Short message'
    }),
    
    contactFormTestData.generateContact({
      email: '',
      testName: 'Empty email'
    }),
    
    contactFormTestData.generateContact({
      phone: '',
      testName: 'Empty phone'
    })
  ],
};

//Test data for admin room management scenarios
export const adminRoomTestData = { 
  generateValidRoom: (overrides: Partial<AdminRoomFormData> = {}) => ({
    roomName: faker.string.numeric(3),
    type: faker.helpers.arrayElement(['Single', 'Double', 'Suite'] as const),
    accessible: faker.datatype.boolean(),
    price: faker.number.int({ min: 1, max: 899 }),
    features: {
      wifi: faker.datatype.boolean(),
      refreshments: faker.datatype.boolean(),
      tv: faker.datatype.boolean(),
      safe: faker.datatype.boolean(),
      radio: faker.datatype.boolean(),
      views: faker.datatype.boolean()
    },
    ...overrides
  }),

  // Generate invalid room data
  generateInvalidRooms: () => [

    adminRoomTestData.generateValidRoom({
      roomName: '',
      testName: 'Empty room name'
    }),
    
    adminRoomTestData.generateValidRoom({
      price: 0,
      testName: 'Price is zero'
    }),
    
    adminRoomTestData.generateValidRoom({
      price: faker.number.int({ min: -100, max: -1 }),
      testName: 'Negative price'
    }),
    
    adminRoomTestData.generateValidRoom({
      price: faker.number.float({ min: 0.1, max: 0.9 }),
      testName: 'Price less than 1'
    })
  ],

  //Test data for API testing scenarios
  testRoomForAPI: {
    roomName: '900api',
    type: 'Suite' as const,
    accessible: true,
    description: 'Room created via API',
    image: 'https://www.gentinghotel.co.uk/_next/image?url=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fstaticgh.gentinghotel.co.uk%2Fuploads%2Ffeed-cards%2F_750x750_crop_center-center_none%2FRW_Hotel_Finals_GentingSuiteTable_sqr.jpg&w=1080&q=75',
    roomPrice: 999,
    features: {
      wifi: true,
      refreshments: true,
      tv: true,
      safe: true,
      radio: true,
      views: true
    }
  }
};
