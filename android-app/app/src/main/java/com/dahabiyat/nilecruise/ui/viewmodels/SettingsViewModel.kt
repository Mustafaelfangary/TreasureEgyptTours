package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.NotificationPreferences
import com.dahabiyat.nilecruise.data.models.UserPreferences
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val preferencesManager: PreferencesManager
) : ViewModel() {

    private val _userPreferences = MutableStateFlow(UserPreferences())
    val userPreferences: StateFlow<UserPreferences> = _userPreferences.asStateFlow()
    
    private val _isSaving = MutableStateFlow(false)
    val isSaving: StateFlow<Boolean> = _isSaving.asStateFlow()
    
    private val _saveSuccess = MutableStateFlow<Boolean?>(null)
    val saveSuccess: StateFlow<Boolean?> = _saveSuccess.asStateFlow()
    
    init {
        loadUserPreferences()
    }
    
    private fun loadUserPreferences() {
        viewModelScope.launch {
            preferencesManager.getUserPreferences().collectLatest { preferences ->
                _userPreferences.value = preferences
            }
        }
    }
    
    fun updateLanguage(language: String) {
        _userPreferences.value = _userPreferences.value.copy(language = language)
    }
    
    fun updateCurrency(currency: String) {
        _userPreferences.value = _userPreferences.value.copy(currency = currency)
    }
    
    fun updateMarketingEmails(enabled: Boolean) {
        val currentNotifications = _userPreferences.value.notifications
        val updatedNotifications = currentNotifications.copy(marketingEmails = enabled)
        _userPreferences.value = _userPreferences.value.copy(notifications = updatedNotifications)
    }
    
    fun updateBookingUpdates(enabled: Boolean) {
        val currentNotifications = _userPreferences.value.notifications
        val updatedNotifications = currentNotifications.copy(bookingUpdates = enabled)
        _userPreferences.value = _userPreferences.value.copy(notifications = updatedNotifications)
    }
    
    fun updateSpecialOffers(enabled: Boolean) {
        val currentNotifications = _userPreferences.value.notifications
        val updatedNotifications = currentNotifications.copy(specialOffers = enabled)
        _userPreferences.value = _userPreferences.value.copy(notifications = updatedNotifications)
    }
    
    fun updatePushNotifications(enabled: Boolean) {
        val currentNotifications = _userPreferences.value.notifications
        val updatedNotifications = currentNotifications.copy(pushNotifications = enabled)
        _userPreferences.value = _userPreferences.value.copy(notifications = updatedNotifications)
    }
    
    fun updateEmailNotifications(enabled: Boolean) {
        val currentNotifications = _userPreferences.value.notifications
        val updatedNotifications = currentNotifications.copy(emailNotifications = enabled)
        _userPreferences.value = _userPreferences.value.copy(notifications = updatedNotifications)
    }
    
    fun updateSmsNotifications(enabled: Boolean) {
        val currentNotifications = _userPreferences.value.notifications
        val updatedNotifications = currentNotifications.copy(smsNotifications = enabled)
        _userPreferences.value = _userPreferences.value.copy(notifications = updatedNotifications)
    }
    
    fun savePreferences() {
        viewModelScope.launch {
            _isSaving.value = true
            try {
                preferencesManager.saveUserPreferences(_userPreferences.value)
                _saveSuccess.value = true
            } catch (e: Exception) {
                _saveSuccess.value = false
            } finally {
                _isSaving.value = false
            }
        }
    }
    
    fun resetSaveStatus() {
        _saveSuccess.value = null
    }
}