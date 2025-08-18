import { ApiUtils } from './api.utils';
import { apiRoomTestData, generateApiRoomData } from '../data/test-data';
import { ApiRoomData, AdminAuthCredentials } from '../types/common.types';

/**
 * Room API helper utilities for test preconditions
 */
export class ApiRoomHelpers {
  
  /**
   * Quick room creation for test preconditions
   */
  static async createRoomForTest(
    roomData?: ApiRoomData,
    adminCredentials?: AdminAuthCredentials
  ): Promise<{ success: boolean; roomName: string; error?: string }> {
    const apiUtils = new ApiUtils();
    
    const defaultCredentials = { username: 'admin', password: 'password' };
    const credentials = adminCredentials || defaultCredentials;
    
    const roomToCreate = roomData || generateApiRoomData();
    
    try {
      const response = await apiUtils.createRoomWithAdminAuth(credentials, roomToCreate);
      
      if (response.success) {
        console.log(`✅ Room ${roomToCreate.roomName} created successfully via API`);
        return {
          success: true,
          roomName: roomToCreate.roomName
        };
      } else {
        console.error(`❌ Failed to create room via API:`, response.message);
        return {
          success: false,
          roomName: roomToCreate.roomName,
          error: response.message
        };
      }
    } catch (error) {
      console.error('❌ API room creation failed:', error);
      return {
        success: false,
        roomName: roomToCreate.roomName,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Create default room for testing
   */
  static async createDefaultTestRoom(): Promise<{ success: boolean; roomName: string; error?: string }> {
    return this.createRoomForTest(apiRoomTestData.defaultRoom);
  }
  
  /**
   * Create custom test room
   */
  static async createCustomTestRoom(): Promise<{ success: boolean; roomName: string; error?: string }> {
    return this.createRoomForTest(apiRoomTestData.customTestRoom);
  }
  
  /**
   * Create room with specific room number
   */
  static async createRoomWithNumber(roomNumber: string): Promise<{ success: boolean; roomName: string; error?: string }> {
    const roomData = generateApiRoomData(roomNumber);
    return this.createRoomForTest(roomData);
  }
}
