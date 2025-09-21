'use client';

import { useState, useEffect } from 'react';
import { MigrationService } from '../lib/migration-service';

export default function MigrationBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    migrated: { cities: number; interventions: number };
    errors: string[];
  } | null>(null);

  useEffect(() => {
    const checkMigration = async () => {
      const needsMigration = await MigrationService.checkMigrationNeeded();
      setShowBanner(needsMigration);
    };
    
    checkMigration();
  }, []);

  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const result = await MigrationService.migrateLocalStorageToDatabase();
      setMigrationResult(result);
      
      if (result.success) {
        // Clear localStorage after successful migration
        MigrationService.clearLocalStorageAfterMigration();
        // Hide banner after successful migration
        setTimeout(() => setShowBanner(false), 3000);
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationResult({
        success: false,
        migrated: { cities: 0, interventions: 0 },
        errors: [`Migration failed: ${error}`],
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Database Migration Available
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              We&apos;ve upgraded to a shared database! You have local data that can be migrated to the new system.
            </p>
            {migrationResult ? (
              <div className="mt-2">
                {migrationResult.success ? (
                  <div className="text-green-700">
                    ✅ Successfully migrated {migrationResult.migrated.cities} cities and {migrationResult.migrated.interventions} interventions!
                  </div>
                ) : (
                  <div className="text-red-700">
                    ❌ Migration failed. Please try again or contact support.
                    {migrationResult.errors.length > 0 && (
                      <details className="mt-1">
                        <summary className="cursor-pointer">View errors</summary>
                        <ul className="list-disc list-inside mt-1">
                          {migrationResult.errors.map((error, index) => (
                            <li key={index} className="text-xs">{error}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <button
                  onClick={handleMigrate}
                  disabled={isMigrating}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMigrating ? 'Migrating...' : 'Migrate Now'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
