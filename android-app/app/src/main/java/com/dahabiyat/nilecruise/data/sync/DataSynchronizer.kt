package com.dahabiyat.nilecruise.data.sync

import com.dahabiyat.nilecruise.data.repository.WebsiteRepository
import com.dahabiyat.nilecruise.data.repository.DahabiyaRepository
import com.dahabiyat.nilecruise.data.repository.PackageRepository
import com.dahabiyat.nilecruise.data.repository.BookingRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

data class SyncState(
    val isSyncing: Boolean = false,
    val lastSyncTime: Long? = null,
    val error: String? = null,
    val syncProgress: Float = 0f
)

@Singleton
class DataSynchronizer @Inject constructor(
    private val websiteRepository: WebsiteRepository,
    private val dahabiyaRepository: DahabiyaRepository,
    private val packageRepository: PackageRepository,
    private val bookingRepository: BookingRepository
) {
    private val coroutineScope = CoroutineScope(Dispatchers.IO)
    
    private val _syncState = MutableStateFlow(SyncState())
    val syncState: StateFlow<SyncState> = _syncState.asStateFlow()
    
    fun syncAllData(onComplete: () -> Unit = {}) {
        coroutineScope.launch {
            try {
                _syncState.value = SyncState(isSyncing = true, syncProgress = 0f)
                
                // Sync dahabiyas
                _syncState.value = _syncState.value.copy(syncProgress = 0.2f)
                websiteRepository.getAllDahabiyas()
                    .onSuccess { dahabiyas ->
                        Timber.d("Synced ${dahabiyas.size} dahabiyas from website")
                        // TODO: Persist to local cache/database if needed
                    }
                    .onFailure { error ->
                        Timber.e(error, "Failed to sync dahabiyas")
                    }
                
                // Sync packages
                _syncState.value = _syncState.value.copy(syncProgress = 0.4f)
                websiteRepository.getAllPackages()
                    .onSuccess { packages ->
                        Timber.d("Synced ${packages.size} packages from website")
                        // TODO: Persist to local cache/database if needed
                    }
                    .onFailure { error ->
                        Timber.e(error, "Failed to sync packages")
                    }
                
                // Sync bookings
                _syncState.value = _syncState.value.copy(syncProgress = 0.6f)
                websiteRepository.getUserBookings()
                    .onSuccess { bookings ->
                        Timber.d("Synced ${bookings.size} bookings from website")
                        // TODO: Persist to local cache/database if needed
                    }
                    .onFailure { error ->
                        Timber.d("Not syncing bookings: ${error.message}")
                    }
                
                // Sync availability data
                _syncState.value = _syncState.value.copy(syncProgress = 0.8f)
                // This would typically involve syncing availability for the next few months
                // for popular dahabiyas to have offline availability data
                
                // Complete sync
                _syncState.value = SyncState(
                    isSyncing = false,
                    lastSyncTime = System.currentTimeMillis(),
                    syncProgress = 1.0f
                )
                
                onComplete()
            } catch (e: Exception) {
                Timber.e(e, "Error during data synchronization")
                _syncState.value = SyncState(
                    isSyncing = false,
                    error = "Sync failed: ${e.message}",
                    lastSyncTime = _syncState.value.lastSyncTime
                )
            }
        }
    }
    
    fun syncBookings() {
        coroutineScope.launch {
            try {
                websiteRepository.getUserBookings()
                    .onSuccess { bookings ->
                        Timber.d("Synced ${bookings.size} bookings from website")
                        // TODO: Persist to local cache/database if needed
                    }
                    .onFailure { error ->
                        Timber.e(error, "Failed to sync bookings")
                    }
            } catch (e: Exception) {
                Timber.e(e, "Error syncing bookings")
            }
        }
    }
    
    fun schedulePeriodicSync() {
        // In a real app, this would use WorkManager to schedule periodic syncs
        // For this example, we'll just log that it would be scheduled
        Timber.d("Scheduled periodic sync with dahabiyatnilecruise.com")
    }
}