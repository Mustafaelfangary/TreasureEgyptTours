package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.User
import com.dahabiyat.nilecruise.data.models.UserPreferences
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import com.dahabiyat.nilecruise.data.repository.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val preferencesManager: PreferencesManager,
    private val userRepository: UserRepository
) : ViewModel() {

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()
    
    private val _userPreferences = MutableStateFlow<UserPreferences?>(null)
    val userPreferences: StateFlow<UserPreferences?> = _userPreferences.asStateFlow()

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    fun initializeApp() {
        viewModelScope.launch {
            // Check if user is logged in from DataStore
            val isLoggedIn = preferencesManager.isLoggedIn().first()
            _isLoggedIn.value = isLoggedIn

            // Kick off continuous preferences collection without blocking initialization
            launch {
                preferencesManager.getUserPreferences().collectLatest { preferences ->
                    _userPreferences.value = preferences
                }
            }

            // Load user data if logged in (do not block isLoading flag)
            if (isLoggedIn) {
                val userId = preferencesManager.getUserId().first()
                userId?.let { id ->
                    launch { loadUserData(id) }
                }
            }

            // Mark loading complete immediately after kicking off background tasks
            _isLoading.value = false
        }
    }
    
    private suspend fun loadUserData(userId: String) {
        try {
            // Load user profile from API
            userRepository.getUserProfile().collectLatest { resource ->
                if (resource.data != null) {
                    _currentUser.value = resource.data
                }
            }
        } catch (e: Exception) {
            // Handle error
        }
    }

    fun signOut() {
        viewModelScope.launch {
            // Clear auth data from DataStore
            preferencesManager.clearAuthToken()
            preferencesManager.setLoggedIn(false)
            
            // Update UI state
            _isLoggedIn.value = false
            _currentUser.value = null
        }
    }
    
    fun updateUserPreferences(preferences: UserPreferences) {
        viewModelScope.launch {
            preferencesManager.saveUserPreferences(preferences)
            _userPreferences.value = preferences
        }
    }
}
