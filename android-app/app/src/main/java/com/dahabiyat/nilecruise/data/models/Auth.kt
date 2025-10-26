package com.dahabiyat.nilecruise.data.models

import kotlinx.serialization.Serializable

@Serializable
data class AuthRequest(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val confirmPassword: String,
    val phone: String? = null,
    val nationality: String? = null
)

@Serializable
data class AuthResponse(
    val success: Boolean,
    val message: String? = null,
    val data: AuthData? = null,
    val error: String? = null
)

@Serializable
data class AuthData(
    val user: User,
    val token: String,
    val refreshToken: String? = null,
    val expiresIn: Long? = null
)

@Serializable
data class VerifyEmailRequest(
    val email: String,
    val token: String
)

@Serializable
data class ForgotPasswordRequest(
    val email: String
)

@Serializable
data class ResetPasswordRequest(
    val email: String,
    val token: String,
    val password: String,
    val confirmPassword: String
)

@Serializable
data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String,
    val confirmPassword: String
)

@Serializable
data class AdminVerifyRequest(
    val email: String,
    val verifyKey: String
)

@Serializable
data class UpdateProfileRequest(
    val name: String? = null,
    val phone: String? = null,
    val nationality: String? = null,
    val dateOfBirth: String? = null,
    val preferences: UserPreferences? = null
)



