package com.dahabiyat.nilecruise.data.models

/**
 * Request model for user login
 */
data class LoginRequest(
    val email: String,
    val password: String
)

/**
 * Response model for successful login
 */
data class LoginResponse(
    val token: String,
    val user: User
)

/**
 * Request model for user registration
 */
// Removed duplicate; use RegisterRequest from Auth.kt

/**
 * Request model for creating a booking
 */
data class BookingRequest(
    val packageId: String? = null,
    val dahabiyaId: String,
    val startDate: String,
    val endDate: String,
    val numberOfAdults: Int,
    val numberOfChildren: Int = 0,
    val specialRequests: String? = null,
    val paymentMethod: String = "credit_card"
)