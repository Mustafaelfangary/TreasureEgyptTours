package com.dahabiyat.nilecruise.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.dahabiyat.nilecruise.data.models.NotificationPreferences
import com.dahabiyat.nilecruise.data.models.UserPreferences
import com.dahabiyat.nilecruise.utils.Constants
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<androidx.datastore.preferences.core.Preferences> by preferencesDataStore(
    name = "dahabiyat_preferences"
)

@Singleton
class DataStorePreferencesManager @Inject constructor(
    @ApplicationContext private val context: Context
) : PreferencesManager {

    // Keys for preferences
    private object PreferenceKeys {
        // Auth keys
        val USER_TOKEN = stringPreferencesKey(Constants.PrefsKeys.USER_TOKEN)
        val USER_ID = stringPreferencesKey(Constants.PrefsKeys.USER_ID)
        val IS_LOGGED_IN = booleanPreferencesKey(Constants.PrefsKeys.IS_LOGGED_IN)
        
        // App preferences
        val THEME_MODE = stringPreferencesKey(Constants.PrefsKeys.THEME_MODE)
        val IS_FIRST_LAUNCH = booleanPreferencesKey(Constants.PrefsKeys.IS_FIRST_LAUNCH)
        val BIOMETRIC_ENABLED = booleanPreferencesKey(Constants.PrefsKeys.BIOMETRIC_ENABLED)
        val NOTIFICATIONS_ENABLED = booleanPreferencesKey(Constants.PrefsKeys.NOTIFICATIONS_ENABLED)
        
        // Mobile content feature flag
        val USE_MOBILE_CONTENT = booleanPreferencesKey("use_mobile_content")
        
        // User preferences
        val USER_LANGUAGE = stringPreferencesKey("user_language")
        val SELECTED_LANGUAGE = stringPreferencesKey(Constants.PrefsKeys.SELECTED_LANGUAGE)
        val USER_CURRENCY = stringPreferencesKey("user_currency")
        
        // Notification preferences
        val BOOKING_UPDATES = booleanPreferencesKey("booking_updates")
        val SPECIAL_OFFERS = booleanPreferencesKey("special_offers")
        val MARKETING_EMAILS = booleanPreferencesKey("marketing_emails")
        val PUSH_NOTIFICATIONS = booleanPreferencesKey("push_notifications")
        val EMAIL_NOTIFICATIONS = booleanPreferencesKey("email_notifications")
        val SMS_NOTIFICATIONS = booleanPreferencesKey("sms_notifications")
    }
    
    // Authentication related preferences
    override suspend fun saveAuthToken(token: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.USER_TOKEN] = token
        }
    }
    
    override suspend fun getAuthToken(): Flow<String?> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.USER_TOKEN]
            }
    }
    
    override suspend fun clearAuthToken() {
        context.dataStore.edit { preferences ->
            preferences.remove(PreferenceKeys.USER_TOKEN)
        }
    }
    
    override suspend fun saveUserId(userId: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.USER_ID] = userId
        }
    }
    
    override suspend fun getUserId(): Flow<String?> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.USER_ID]
            }
    }
    
    override suspend fun setLoggedIn(isLoggedIn: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.IS_LOGGED_IN] = isLoggedIn
        }
    }
    
    override suspend fun isLoggedIn(): Flow<Boolean> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.IS_LOGGED_IN] ?: false
            }
    }
    
    // User preferences
    override suspend fun saveUserPreferences(preferences: UserPreferences) {
        context.dataStore.edit { prefs ->
            // Core user preferences
            prefs[PreferenceKeys.USER_LANGUAGE] = preferences.language
            prefs[PreferenceKeys.USER_CURRENCY] = preferences.currency

            // Notification preferences
            val notif = preferences.notifications
            prefs[PreferenceKeys.BOOKING_UPDATES] = notif.bookingUpdates
            prefs[PreferenceKeys.SPECIAL_OFFERS] = notif.specialOffers
            prefs[PreferenceKeys.MARKETING_EMAILS] = notif.marketingEmails
            prefs[PreferenceKeys.PUSH_NOTIFICATIONS] = notif.pushNotifications
            prefs[PreferenceKeys.EMAIL_NOTIFICATIONS] = notif.emailNotifications
            prefs[PreferenceKeys.SMS_NOTIFICATIONS] = notif.smsNotifications
        }
    }
    
    override suspend fun getUserPreferences(): Flow<UserPreferences> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                val notificationPrefs = NotificationPreferences(
                    bookingUpdates = preferences[PreferenceKeys.BOOKING_UPDATES] ?: true,
                    specialOffers = preferences[PreferenceKeys.SPECIAL_OFFERS] ?: true,
                    marketingEmails = preferences[PreferenceKeys.MARKETING_EMAILS] ?: true,
                    pushNotifications = preferences[PreferenceKeys.PUSH_NOTIFICATIONS] ?: true,
                    emailNotifications = preferences[PreferenceKeys.EMAIL_NOTIFICATIONS] ?: true,
                    smsNotifications = preferences[PreferenceKeys.SMS_NOTIFICATIONS] ?: false
                )

                UserPreferences(
                    language = preferences[PreferenceKeys.USER_LANGUAGE] ?: "en",
                    currency = preferences[PreferenceKeys.USER_CURRENCY] ?: "USD",
                    notifications = notificationPrefs
                )
            }
    }
    
    // App preferences
    override suspend fun setFirstLaunch(isFirstLaunch: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.IS_FIRST_LAUNCH] = isFirstLaunch
        }
    }
    
    override suspend fun isFirstLaunch(): Flow<Boolean> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.IS_FIRST_LAUNCH] ?: true
            }
    }
    
    override suspend fun setThemeMode(themeMode: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.THEME_MODE] = themeMode
        }
    }
    
    override suspend fun getThemeMode(): Flow<String> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.THEME_MODE] ?: "system"
            }
    }
    
    override suspend fun setLanguage(language: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.SELECTED_LANGUAGE] = language
        }
    }
    
    override suspend fun getLanguage(): Flow<String> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.SELECTED_LANGUAGE] ?: "en"
            }
    }
    
    override suspend fun setBiometricEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.BIOMETRIC_ENABLED] = enabled
        }
    }
    
    override suspend fun isBiometricEnabled(): Flow<Boolean> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.BIOMETRIC_ENABLED] ?: false
            }
    }
    
    override suspend fun setNotificationsEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.NOTIFICATIONS_ENABLED] = enabled
        }
    }
    
    override suspend fun areNotificationsEnabled(): Flow<Boolean> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.NOTIFICATIONS_ENABLED] ?: true
            }
    }
    
    // Mobile content feature flag
    override suspend fun setUseMobileContent(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferenceKeys.USE_MOBILE_CONTENT] = enabled
        }
    }
    
    override suspend fun isUseMobileContent(): Flow<Boolean> {
        return context.dataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map { preferences ->
                preferences[PreferenceKeys.USE_MOBILE_CONTENT] ?: true
            }
    }
    
    // Clear all preferences
    override suspend fun clearAllPreferences() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}