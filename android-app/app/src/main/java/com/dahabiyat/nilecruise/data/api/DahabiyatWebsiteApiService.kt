package com.dahabiyat.nilecruise.data.api

import com.dahabiyat.nilecruise.data.models.Booking
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.data.models.Package
import com.dahabiyat.nilecruise.data.models.User
import com.dahabiyat.nilecruise.data.models.LoginRequest
import com.dahabiyat.nilecruise.data.models.LoginResponse
import com.dahabiyat.nilecruise.data.models.RegisterRequest
import com.dahabiyat.nilecruise.data.models.BookingRequest
import retrofit2.Response
import retrofit2.http.*

/**
 * API service interface for connecting to the main Dahabiyat Nile Cruise website
 * This service handles authentication, bookings, and data synchronization
 */
interface DahabiyatWebsiteApiService {
    
    companion object {
        const val BASE_URL = "https://www.dahabiyatnilecruise.com/api/"
    }
    
    // Authentication endpoints
    @POST("auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>
    
    @POST("auth/register")
    suspend fun register(@Body registerRequest: RegisterRequest): Response<User>
    
    @GET("auth/user")
    suspend fun getCurrentUser(@Header("Authorization") token: String): Response<User>
    
    // Booking endpoints
    @GET("bookings")
    suspend fun getUserBookings(@Header("Authorization") token: String): Response<List<Booking>>
    
    @POST("bookings")
    suspend fun createBooking(
        @Header("Authorization") token: String,
        @Body bookingRequest: BookingRequest
    ): Response<Booking>
    
    @GET("bookings/{id}")
    suspend fun getBookingDetails(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String
    ): Response<Booking>
    
    @DELETE("bookings/{id}")
    suspend fun cancelBooking(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String
    ): Response<Unit>
    
    // Data synchronization endpoints
    @GET("dahabiyas")
    suspend fun getAllDahabiyas(): Response<List<Dahabiya>>
    
    @GET("dahabiyas/{id}")
    suspend fun getDahabiyaDetails(@Path("id") dahabiyaId: String): Response<Dahabiya>
    
    @GET("packages")
    suspend fun getAllPackages(): Response<List<Package>>
    
    @GET("packages/{id}")
    suspend fun getPackageDetails(@Path("id") packageId: String): Response<Package>
    
    @GET("availability")
    suspend fun checkAvailability(
        @Query("dahabiya_id") dahabiyaId: String,
        @Query("start_date") startDate: String,
        @Query("end_date") endDate: String
    ): Response<Map<String, Boolean>>
}