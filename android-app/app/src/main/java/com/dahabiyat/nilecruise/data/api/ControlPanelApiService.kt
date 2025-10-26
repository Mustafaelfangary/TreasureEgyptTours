package com.dahabiyat.nilecruise.data.api

import com.dahabiyat.nilecruise.data.models.controlpanel.ControlPanelConfig
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * API service for fetching control panel configuration
 */
interface ControlPanelApiService {
    @GET("control-panel/config")
    suspend fun getControlPanelConfig(
        @Query("version") currentVersion: Int = 0
    ): Response<ControlPanelConfig>
}