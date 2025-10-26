package com.dahabiyat.nilecruise.data.preferences

import com.dahabiyat.nilecruise.data.models.UserPreferences
import kotlinx.coroutines.flow.Flow

/**
 * Centralized preferences API for the app. Implemented by a DataStore-backed manager.
 */
interface PreferencesManager {
    // Auth
    suspend fun saveAuthToken(token: String)
    suspend fun getAuthToken(): Flow<String?>
    suspend fun clearAuthToken()

    suspend fun saveUserId(userId: String)
    suspend fun getUserId(): Flow<String?>

    suspend fun setLoggedIn(isLoggedIn: Boolean)
    suspend fun isLoggedIn(): Flow<Boolean>

    // User preferences (domain)
    suspend fun saveUserPreferences(preferences: UserPreferences)
    suspend fun getUserPreferences(): Flow<UserPreferences>

    // App preferences
    suspend fun setFirstLaunch(isFirstLaunch: Boolean)
    suspend fun isFirstLaunch(): Flow<Boolean>

    suspend fun setThemeMode(themeMode: String)
    suspend fun getThemeMode(): Flow<String>

    suspend fun setLanguage(language: String)
    suspend fun getLanguage(): Flow<String>

    suspend fun setBiometricEnabled(enabled: Boolean)
    suspend fun isBiometricEnabled(): Flow<Boolean>

    suspend fun setNotificationsEnabled(enabled: Boolean)
    suspend fun areNotificationsEnabled(): Flow<Boolean>

    // Feature flags
    suspend fun setUseMobileContent(enabled: Boolean)
    suspend fun isUseMobileContent(): Flow<Boolean>

    // Maintenance
    suspend fun clearAllPreferences()
}
