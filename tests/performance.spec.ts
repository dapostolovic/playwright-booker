import { test, expect } from '../src/fixtures/test.fixtures';
import { generateRandomBookings } from '../src/data/test-data';

test.describe('Performance Tests', () => {
  
  test('Load testing - Create multiple bookings via API', async ({ 
    api, 
    performStep 
  }) => {
    const bookingsToCreate = generateRandomBookings(5);
    const createdBookingIds: number[] = [];
    
    const startTime = Date.now();
    
    await performStep('Create multiple bookings concurrently', async () => {
      const promises = bookingsToCreate.map(bookingData => 
        api.createBooking(bookingData)
      );
      
      const results = await Promise.all(promises);
      
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        if (result.data?.id) {
          createdBookingIds.push(result.data.id);
        }
        console.log(`Booking ${index + 1} created with ID: ${result.data?.id}`);
      });
    });
    
    const creationTime = Date.now() - startTime;
    console.log(`Created ${bookingsToCreate.length} bookings in ${creationTime}ms`);
    
    await performStep('Verify all bookings exist', async () => {
      const verificationPromises = createdBookingIds.map(id => 
        api.getBooking(id)
      );
      
      const verificationResults = await Promise.all(verificationPromises);
      
      verificationResults.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
    
    await performStep('Cleanup created bookings', async () => {
      const cleanupPromises = createdBookingIds.map(id => 
        api.deleteBooking(id)
      );
      
      await Promise.all(cleanupPromises);
      console.log(`Cleaned up ${createdBookingIds.length} bookings`);
    });
    
    // Performance assertion
    expect(creationTime).toBeLessThan(10000); // Should complete within 10 seconds
  });

  test('Response time monitoring', async ({ 
    api, 
    performStep 
  }) => {
    const responseTimes: number[] = [];
    const iterations = 3;
    
    for (let i = 0; i < iterations; i++) {
      await performStep(`Response time check ${i + 1}/${iterations}`, async () => {
        const startTime = Date.now();
        const response = await api.healthCheck();
        const endTime = Date.now();
        
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);
        
        expect(response.success).toBe(true);
        console.log(`Response time ${i + 1}: ${responseTime}ms`);
      });
    }
    
    await performStep('Analyze response times', async () => {
      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);
      const minResponseTime = Math.min(...responseTimes);
      
      console.log(`Average response time: ${averageResponseTime.toFixed(2)}ms`);
      console.log(`Max response time: ${maxResponseTime}ms`);
      console.log(`Min response time: ${minResponseTime}ms`);
      
      // Performance assertions
      expect(averageResponseTime).toBeLessThan(2000); // Average should be under 2s
      expect(maxResponseTime).toBeLessThan(5000); // Max should be under 5s
    });
  });

  test('Memory usage monitoring during UI operations', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    await performStep('Navigate to application and measure memory', async () => {
      // Navigate to the application
      await ui.navigateTo('/');
      
      // Get initial memory usage
      const initialMetrics = await page.evaluate(() => {
        return {
          usedJSHeapSize: (performance as any).memory?.usedJSHeapSize || 0,
          totalJSHeapSize: (performance as any).memory?.totalJSHeapSize || 0
        };
      });
      
      console.log('Initial memory usage:', initialMetrics);
      
      // Perform some UI operations
      for (let i = 0; i < 5; i++) {
        await ui.navigateTo('/booking');
        await ui.navigateTo('/');
      }
      
      // Get final memory usage
      const finalMetrics = await page.evaluate(() => {
        return {
          usedJSHeapSize: (performance as any).memory?.usedJSHeapSize || 0,
          totalJSHeapSize: (performance as any).memory?.totalJSHeapSize || 0
        };
      });
      
      console.log('Final memory usage:', finalMetrics);
      
      // Calculate memory increase
      const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
      console.log(`Memory increase: ${memoryIncrease} bytes`);
      
      // Basic memory leak check (this is a simple check)
      if (initialMetrics.usedJSHeapSize > 0) {
        const memoryIncreasePercentage = (memoryIncrease / initialMetrics.usedJSHeapSize) * 100;
        console.log(`Memory increase percentage: ${memoryIncreasePercentage.toFixed(2)}%`);
        
        // Alert if memory increased significantly
        if (memoryIncreasePercentage > 50) {
          console.warn('⚠️ Significant memory increase detected - potential memory leak');
        }
      }
    });
  });

  test('Network performance monitoring', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    const networkMetrics: any[] = [];
    
    // Listen to network events
    page.on('response', (response) => {
      networkMetrics.push({
        url: response.url(),
        status: response.status(),
        timing: response.timing()
      });
    });
    
    await performStep('Navigate and collect network metrics', async () => {
      await ui.navigateTo('/');
      await ui.waitForPageLoad();
      
      // Navigate to different pages to collect more metrics
      await ui.navigateTo('/booking');
      await ui.waitForPageLoad();
    });
    
    await performStep('Analyze network performance', async () => {
      console.log(`Total network requests: ${networkMetrics.length}`);
      
      // Analyze response times
      const responseTimes = networkMetrics
        .filter(metric => metric.timing)
        .map(metric => metric.timing.responseEnd - metric.timing.responseStart);
      
      if (responseTimes.length > 0) {
        const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const slowRequests = responseTimes.filter(time => time > 2000);
        
        console.log(`Average network response time: ${averageResponseTime.toFixed(2)}ms`);
        console.log(`Slow requests (>2s): ${slowRequests.length}`);
        
        // Performance assertions
        expect(averageResponseTime).toBeLessThan(1000); // Average should be under 1s
        expect(slowRequests.length).toBeLessThan(networkMetrics.length * 0.1); // Less than 10% slow requests
      }
      
      // Check for failed requests
      const failedRequests = networkMetrics.filter(metric => metric.status >= 400);
      console.log(`Failed requests: ${failedRequests.length}`);
      
      expect(failedRequests.length).toBe(0); // No failed requests expected
    });
  });
});

