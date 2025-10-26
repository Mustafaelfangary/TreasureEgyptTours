package com.dahabiyat.nilecruise

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.rememberNavController
import com.dahabiyat.nilecruise.ui.navigation.DahabiyatNavigation
import com.dahabiyat.nilecruise.ui.theme.DahabiyatNileCruiseTheme
import com.dahabiyat.nilecruise.ui.viewmodels.MainViewModel
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.rememberDrawerState
import androidx.lifecycle.lifecycleScope
import com.dahabiyat.nilecruise.data.repository.ControlPanelRepository
import com.dahabiyat.nilecruise.ui.viewmodels.ControlPanelViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import com.dahabiyat.nilecruise.di.NetworkModule
import kotlinx.coroutines.flow.first

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var controlPanelRepository: ControlPanelRepository
    
    @Inject
    lateinit var preferencesManager: PreferencesManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        // Apply saved auth token (if any) to the global interceptor on startup
        restoreAuthToken()
        
        // Sync control panel data
        syncControlPanelData()
        
        setContent {
            DahabiyatNileCruiseTheme {
                DahabiyatApp()
            }
        }
        
        Timber.d("MainActivity created")
    }
    
    private fun restoreAuthToken() {
        lifecycleScope.launch {
            try {
                val token = preferencesManager.getAuthToken().first()
                if (!token.isNullOrBlank()) {
                    NetworkModule.TokenProvider.token = token
                    Timber.d("Auth token restored for API calls")
                }
            } catch (e: Exception) {
                Timber.e(e, "Failed to restore auth token")
            }
        }
    }
    
    private fun syncControlPanelData() {
        lifecycleScope.launch {
            try {
                val result = controlPanelRepository.syncControlPanelData()
                result.onSuccess {
                    Timber.d("Control panel data synced successfully")
                }.onFailure { error ->
                    Timber.e(error, "Failed to sync control panel data")
                }
            } catch (e: Exception) {
                Timber.e(e, "Exception during control panel sync")
            }
        }
    }
}

@Composable
fun DahabiyatApp() {
    val navController = rememberNavController()
    val mainViewModel: MainViewModel = hiltViewModel()
    val controlPanelViewModel: ControlPanelViewModel = hiltViewModel()
    
    val isLoading by mainViewModel.isLoading.collectAsState()
    val isLoggedIn by mainViewModel.isLoggedIn.collectAsState()
    val currentUser by mainViewModel.currentUser.collectAsState()
    val controlPanelConfig by controlPanelViewModel.controlPanelConfig.collectAsState()
    val controlPanelLoading by controlPanelViewModel.isLoading.collectAsState()
    
    // Initialize app data
    LaunchedEffect(Unit) {
        mainViewModel.initializeApp()
    }
    
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        DahabiyatNavigation(
            navController = navController,
            isLoading = isLoading,
            isLoggedIn = isLoggedIn,
            currentUser = currentUser,
            controlPanelConfig = controlPanelConfig
        )
    }
}
