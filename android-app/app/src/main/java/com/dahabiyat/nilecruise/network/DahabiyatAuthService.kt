package com.dahabiyat.nilecruise.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

/**
 * Service interface for authentication with the Dahabiyat Nile Cruise website
 */
interface DahabiyatAuthService {
    
    @POST("auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>
    
    @POST("auth/admin/login")
    suspend fun adminLogin(@Body loginRequest: LoginRequest): Response<AdminLoginResponse>
    
    @GET("auth/user")
    suspend fun getCurrentUser(): Response<UserResponse>
    
    @POST("auth/logout")
    suspend fun logout(): Response<LogoutResponse>
}

/**
 * Data classes for authentication
 */
data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val success: Boolean,
    val message: String,
    val token: String?,
    val user: UserData?
)

data class AdminLoginResponse(
    val success: Boolean,
    val message: String,
    val token: String?,
    val admin: AdminData?
)

data class UserResponse(
    val success: Boolean,
    val message: String,
    val user: UserData?
)

data class LogoutResponse(
    val success: Boolean,
    val message: String
)

data class UserData(
    val id: String,
    val name: String,
    val email: String,
    val phone: String?,
    val role: String
)

data class AdminData(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val permissions: List<String>
)