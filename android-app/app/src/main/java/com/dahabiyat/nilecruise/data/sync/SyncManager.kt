package com.dahabiyat.nilecruise.data.sync

import android.content.Context
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.lifecycleScope
import com.dahabiyat.nilecruise.ui.viewmodels.AuthViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SyncManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dataSynchronizer: DataSynchronizer
) {
    fun initialize(lifecycleOwner: LifecycleOwner, authViewModel: AuthViewModel) {
        // Set up sync when user logs in
        lifecycleOwner.lifecycleScope.launch {
            authViewModel.uiState.collectLatest { state ->
                if (state.isLoggedIn && state.currentUser != null) {
                    Timber.d("User logged in, starting data sync")
                    dataSynchronizer.syncAllData()
                }
            }
        }
        
        // Schedule periodic sync
        dataSynchronizer.schedulePeriodicSync()
    }
    
    fun syncNow(onComplete: () -> Unit = {}) {
        dataSynchronizer.syncAllData(onComplete)
    }
}