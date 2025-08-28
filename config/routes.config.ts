export const Routes = {
  // Public routes
  home: '/',
  
  // Admin routes
  admin: {
    login: '/admin',
    rooms: '/admin/rooms',
  },
  
  // Helper methods for URL validation
  isAdminRoute: (url: string): boolean => url.includes('/admin'),
  isAdminRoomsRoute: (url: string): boolean => url.includes('/admin/rooms'),
  isAdminLoginRoute: (url: string): boolean => url.includes('/admin') && !url.includes('/admin/rooms'),
} as const;

// Type for better IntelliSense
export type RouteKey = keyof typeof Routes;
