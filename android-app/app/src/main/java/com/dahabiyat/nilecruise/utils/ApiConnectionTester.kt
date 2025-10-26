package com.dahabiyat.nilecruise.utils

import android.util.Log
import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Utility class to test API connectivity with the Dahabiyat Nile Cruise website
 */
@Singleton
class ApiConnectionTester @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    private val TAG = "ApiConnectionTester"
    
    /**
     * Tests the API connection by making a simple request
     * @return true if connection is successful, false otherwise
     */
    suspend fun testConnection(): Boolean = withContext(Dispatchers.IO) {
        try {
            // Try to fetch featured dahabiyas as a simple test
            val response = apiService.getFeaturedDahabiyas(1)
            val isSuccessful = response.isSuccessful
            
            if (isSuccessful) {
                Log.d(TAG, "API Connection successful: ${response.body()}")
            } else {
                Log.e(TAG, "API Connection failed: ${response.code()} - ${response.message()}")
            }
            
            return@withContext isSuccessful
        } catch (e: Exception) {
            Log.e(TAG, "API Connection exception: ${e.message}", e)
            return@withContext false
        }
    }
}