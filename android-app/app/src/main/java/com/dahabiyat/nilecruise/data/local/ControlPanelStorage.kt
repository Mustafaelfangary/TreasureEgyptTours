package com.dahabiyat.nilecruise.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.dahabiyat.nilecruise.data.models.controlpanel.ControlPanelConfig
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import timber.log.Timber
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "control_panel_prefs")

@Singleton
class ControlPanelStorage @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val gson: Gson = GsonBuilder()
        .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
        .create()
    
    private val controlPanelKey = stringPreferencesKey("control_panel_config")
    private val lastSyncKey = stringPreferencesKey("last_sync_time")
    
    // Get the control panel config as a Flow
    val controlPanelConfig: Flow<ControlPanelConfig?> = context.dataStore.data.map { preferences ->
        preferences[controlPanelKey]?.let { jsonString ->
            try {
                gson.fromJson(jsonString, ControlPanelConfig::class.java)
            } catch (e: Exception) {
                Timber.e(e, "Error parsing control panel config")
                null
            }
        }
    }
    
    // Get the last sync time as a Flow
    val lastSyncTime: Flow<Date?> = context.dataStore.data.map { preferences ->
        preferences[lastSyncKey]?.let { dateString ->
            try {
                SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US).parse(dateString)
            } catch (e: Exception) {
                Timber.e(e, "Error parsing last sync time")
                null
            }
        }
    }
    
    // Save the control panel config
    suspend fun saveControlPanelConfig(config: ControlPanelConfig) {
        try {
            val jsonString = gson.toJson(config)
            context.dataStore.edit { preferences ->
                preferences[controlPanelKey] = jsonString
            }
        } catch (e: Exception) {
            Timber.e(e, "Error saving control panel config")
        }
    }
    
    // Update the last sync time
    suspend fun updateLastSyncTime() {
        val currentTime = Date()
        val dateString = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US).format(currentTime)
        context.dataStore.edit { preferences ->
            preferences[lastSyncKey] = dateString
        }
    }
    
    // Clear all stored data
    suspend fun clearAll() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}