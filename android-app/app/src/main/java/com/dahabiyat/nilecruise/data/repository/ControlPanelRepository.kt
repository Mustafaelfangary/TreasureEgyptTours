package com.dahabiyat.nilecruise.data.repository

import com.dahabiyat.nilecruise.data.api.ControlPanelApiService
import com.dahabiyat.nilecruise.data.models.controlpanel.ControlPanelConfig
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ControlPanelRepository @Inject constructor(
    private val api: ControlPanelApiService
) {

    suspend fun syncControlPanelData(): Result<ControlPanelConfig> {
        return try {
            val response = api.getControlPanelConfig()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Control panel fetch failed: HTTP ${response.code()} ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getControlPanelConfig(): ControlPanelConfig? {
        return try {
            syncControlPanelData().getOrNull()
        } catch (_: Exception) {
            null
        }
    }
}