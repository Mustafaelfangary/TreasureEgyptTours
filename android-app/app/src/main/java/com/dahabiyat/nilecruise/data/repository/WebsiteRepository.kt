package com.dahabiyat.nilecruise.data.repository

import com.dahabiyat.nilecruise.data.api.DahabiyatWebsiteApiService
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository that handles all interactions with the main Dahabiyat Nile Cruise website
 */
@Singleton
class WebsiteRepository @Inject constructor(
    private val apiService: DahabiyatWebsiteApiService,
    private val preferencesManager: PreferencesManager
) {
    // Authentication functions
    suspend fun login(email: String, password: String): Result<LoginResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.login(LoginRequest(email, password))
                if (response.isSuccessful && response.body() != null) {
                    // Save auth token
                    response.body()?.token?.let { token ->
                        preferencesManager.saveAuthToken(token)
                    }
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Login failed: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Login error")
                Result.failure(e)
            }
        }
    }

    suspend fun register(
        name: String,
        email: String,
        password: String,
        passwordConfirmation: String,
        phone: String? = null,
        country: String? = null
    ): Result<User> {
        return withContext(Dispatchers.IO) {
            try {
                val request = RegisterRequest(
                    name = name,
                    email = email,
                    password = password,
                    confirmPassword = passwordConfirmation,
                    phone = phone,
                    nationality = country
                )
                val response = apiService.register(request)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Registration failed: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Registration error")
                Result.failure(e)
            }
        }
    }

    suspend fun getCurrentUser(): Result<User> {
        return withContext(Dispatchers.IO) {
            try {
                val token = preferencesManager.getAuthToken().firstOrNull()
                if (token.isNullOrEmpty()) {
                    return@withContext Result.failure(Exception("Not authenticated"))
                }
                
                val response = apiService.getCurrentUser("Bearer $token")
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to get user: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Get current user error")
                Result.failure(e)
            }
        }
    }

    // Booking functions
    suspend fun getUserBookings(): Result<List<Booking>> {
        return withContext(Dispatchers.IO) {
            try {
                val token = preferencesManager.getAuthToken().firstOrNull()
                if (token.isNullOrEmpty()) {
                    return@withContext Result.failure(Exception("Not authenticated"))
                }
                
                val response = apiService.getUserBookings("Bearer $token")
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to get bookings: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Get user bookings error")
                Result.failure(e)
            }
        }
    }

    suspend fun createBooking(
        dahabiyaId: String,
        startDate: String,
        endDate: String,
        numberOfAdults: Int,
        numberOfChildren: Int = 0,
        packageId: String? = null,
        specialRequests: String? = null
    ): Result<Booking> {
        return withContext(Dispatchers.IO) {
            try {
                val token = preferencesManager.getAuthToken().firstOrNull()
                if (token.isNullOrEmpty()) {
                    return@withContext Result.failure(Exception("Not authenticated"))
                }
                
                val request = BookingRequest(
                    packageId = packageId,
                    dahabiyaId = dahabiyaId,
                    startDate = startDate,
                    endDate = endDate,
                    numberOfAdults = numberOfAdults,
                    numberOfChildren = numberOfChildren,
                    specialRequests = specialRequests
                )
                
                val response = apiService.createBooking("Bearer $token", request)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to create booking: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Create booking error")
                Result.failure(e)
            }
        }
    }

    suspend fun getBookingDetails(bookingId: String): Result<Booking> {
        return withContext(Dispatchers.IO) {
            try {
                val token = preferencesManager.getAuthToken().firstOrNull()
                if (token.isNullOrEmpty()) {
                    return@withContext Result.failure(Exception("Not authenticated"))
                }
                
                val response = apiService.getBookingDetails("Bearer $token", bookingId)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to get booking details: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Get booking details error")
                Result.failure(e)
            }
        }
    }

    suspend fun cancelBooking(bookingId: String): Result<Unit> {
        return withContext(Dispatchers.IO) {
            try {
                val token = preferencesManager.getAuthToken().firstOrNull()
                if (token.isNullOrEmpty()) {
                    return@withContext Result.failure(Exception("Not authenticated"))
                }
                
                val response = apiService.cancelBooking("Bearer $token", bookingId)
                if (response.isSuccessful) {
                    Result.success(Unit)
                } else {
                    Result.failure(Exception("Failed to cancel booking: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Cancel booking error")
                Result.failure(e)
            }
        }
    }

    // Data synchronization functions
    suspend fun getAllDahabiyas(): Result<List<Dahabiya>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getAllDahabiyas()
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to get dahabiyas: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Get all dahabiyas error")
                Result.failure(e)
            }
        }
    }

    suspend fun getDahabiyaDetails(dahabiyaId: String): Result<Dahabiya> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getDahabiyaDetails(dahabiyaId)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to get dahabiya details: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Get dahabiya details error")
                Result.failure(e)
            }
        }
    }

    suspend fun getAllPackages(): Result<List<Package>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getAllPackages()
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to get packages: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Get all packages error")
                Result.failure(e)
            }
        }
    }

    suspend fun getPackageDetails(packageId: String): Result<Package> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getPackageDetails(packageId)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to get package details: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Get package details error")
                Result.failure(e)
            }
        }
    }

    suspend fun checkAvailability(
        dahabiyaId: String,
        startDate: String,
        endDate: String
    ): Result<Map<String, Boolean>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.checkAvailability(dahabiyaId, startDate, endDate)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Failed to check availability: ${response.errorBody()?.string()}"))
                }
            } catch (e: Exception) {
                Timber.e(e, "Check availability error")
                Result.failure(e)
            }
        }
    }
}