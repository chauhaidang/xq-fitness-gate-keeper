/**
 * Playwright Custom Fixtures for Generated API Clients
 * 
 * Provides type-safe API client fixtures that automatically configure
 * generated clients with baseURL from Playwright config.
 */

import { test as base } from '@playwright/test';
import * as WriteClient from 'xq-fitness-write-client';
import * as ReadClient from 'xq-fitness-read-client';
/**
 * Write Client Interface
 * Provides typed access to all write-service API clients
 */
export interface WriteClientInterface {
  routines: WriteClient.RoutinesApi;
  workoutDays: WriteClient.WorkoutDaysApi;
  workoutDaySets: WriteClient.WorkoutDaySetsApi;
  snapshots: WriteClient.SnapshotsApi;
}

export interface ReadClientInterface {
  routines: ReadClient.RoutinesApi;
  workoutDays: ReadClient.WorkoutDaysApi;
  muscleGroups: ReadClient.MuscleGroupsApi;
  reports: ReadClient.ReportsApi;
}

/**
 * Extended test with custom fixtures
 * 
 * Usage:
 * ```typescript
 * import { test, expect } from '../fixtures/api-clients';
 * 
 * test('My Test', async ({ writeClient }) => {
 *   const response = await writeClient.routines.createRoutine({...});
 *   expect(response.data.id).toBeDefined();
 * });
 * ```
 */
export const test = base.extend<{
  xqWrite: WriteClientInterface;
  xqRead: ReadClientInterface;
}>({
  xqWrite: async ({ baseURL }, use) => {
    // Create configuration with baseURL from Playwright config
    const config = new WriteClient.Configuration({
      basePath: baseURL+'/xq-fitness-write-service/api/v1',
    });

    // Create all API client instances
    const client: WriteClientInterface = {
      routines: new WriteClient.RoutinesApi(config),
      workoutDays: new WriteClient.WorkoutDaysApi(config),
      workoutDaySets: new WriteClient.WorkoutDaySetsApi(config),
      snapshots: new WriteClient.SnapshotsApi(config),
    };

    // Provide client to test (automatic dependency injection)
    await use(client);
  },
  xqRead: async ({ baseURL }, use) => {
    const config = new ReadClient.Configuration({
      basePath: baseURL+'/xq-fitness-read-service/api/v1',
    });
    const client: ReadClientInterface = {
      routines: new ReadClient.RoutinesApi(config),
      workoutDays: new ReadClient.WorkoutDaysApi(config),
      muscleGroups: new ReadClient.MuscleGroupsApi(config),
      reports: new ReadClient.ReportsApi(config),
    };
    await use(client);
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';

