/**
 * API Test: Create Routine and Get Routine Detail
 * 
 * Tests creating a routine using write service and retrieving its details using read service
 */

import { test, expect } from '../../fixtures/api-clients';

test('Create Routine and Get Routine Detail', async ({ xqRead, xqWrite }) => {
  let routineId: number | undefined;

  try {
    // Step 1: Create routine using write service
    const createResponse = await xqWrite.routines.createRoutine({
      name: `Test Routine ${Date.now()}`,
      description: 'Test routine for create and get workflow',
      isActive: true,
    });

    expect(createResponse.status).toBe(201);
    const createdRoutine = createResponse.data;
    routineId = createdRoutine.id;

    // Validate created routine response
    expect(createdRoutine).toBeDefined();
    expect(createdRoutine.id).toBeDefined();
    expect(createdRoutine.name).toContain('Test Routine');
    expect(createdRoutine.description).toBe('Test routine for create and get workflow');
    expect(createdRoutine.isActive).toBe(true);

    // Step 2: Get routine detail using read service
    const getResponse = await xqRead.routines.getRoutineById(routineId);
    
    expect(getResponse.status).toBe(200);
    const routineDetail = getResponse.data;

    // Validate routine detail response
    expect(routineDetail).toBeDefined();
    expect(routineDetail.id).toBe(routineId);
    expect(routineDetail.name).toBe(createdRoutine.name);
    expect(routineDetail.description).toBe(createdRoutine.description);
    expect(routineDetail.isActive).toBe(createdRoutine.isActive);
    expect(routineDetail.workoutDays).toBeDefined();
    expect(Array.isArray(routineDetail.workoutDays)).toBe(true);
  } catch (error: any) {
    // Handle axios errors
    if (error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);
      throw error;
    }
    throw error;
  } finally {
    // Cleanup: Delete routine
    if (routineId) {
      try {
        await xqWrite.routines.deleteRoutine(routineId);
      } catch (error) {
        console.warn(`Failed to cleanup routine ${routineId}:`, error);
      }
    }
  }
});

