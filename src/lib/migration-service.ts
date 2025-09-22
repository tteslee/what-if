import { databaseService } from './database-service';
import { storageService } from './storage-service';

export class MigrationService {
  static async migrateLocalStorageToDatabase(): Promise<{
    success: boolean;
    migrated: {
      cities: number;
      interventions: number;
    };
    errors: string[];
  }> {
    const errors: string[] = [];
    let migratedCities = 0;
    let migratedInterventions = 0;

    try {
      // Get data from localStorage
      const localCities = storageService.getCustomCities();
      const localInterventions = storageService.getCustomInterventions();

      console.log('Starting migration:', {
        cities: localCities.length,
        interventions: localInterventions.length,
      });

      // Migrate cities
      for (const city of localCities) {
        try {
          const success = await databaseService.saveCity(city);
          if (success) {
            migratedCities++;
            console.log(`Migrated city: ${city.name}`);
          } else {
            errors.push(`Failed to migrate city: ${city.name}`);
          }
        } catch (error) {
          errors.push(`Error migrating city ${city.name}: ${error}`);
        }
      }

      // Migrate interventions
      for (const intervention of localInterventions) {
        try {
          const success = await databaseService.saveIntervention(intervention);
          if (success) {
            migratedInterventions++;
            console.log(`Migrated intervention: ${intervention.title}`);
          } else {
            errors.push(`Failed to migrate intervention: ${intervention.title}`);
          }
        } catch (error) {
          errors.push(`Error migrating intervention ${intervention.title}: ${error}`);
        }
      }

      console.log('Migration completed:', {
        migratedCities,
        migratedInterventions,
        errors: errors.length,
      });

      return {
        success: errors.length === 0,
        migrated: {
          cities: migratedCities,
          interventions: migratedInterventions,
        },
        errors,
      };
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        migrated: {
          cities: migratedCities,
          interventions: migratedInterventions,
        },
        errors: [...errors, `Migration failed: ${error}`],
      };
    }
  }

  static async checkMigrationNeeded(): Promise<boolean> {
    try {
      const localCities = storageService.getCustomCities();
      const localInterventions = storageService.getCustomInterventions();
      
      return localCities.length > 0 || localInterventions.length > 0;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  }

  static clearLocalStorageAfterMigration(): void {
    try {
      storageService.clearAllCustomData();
      console.log('LocalStorage cleared after successful migration');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
