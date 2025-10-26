package com.dahabiyat.nilecruise.data.repository

import com.dahabiyat.nilecruise.data.models.User
import com.dahabiyat.nilecruise.data.models.UserRole
import com.dahabiyat.nilecruise.data.models.UserPreferences
import com.dahabiyat.nilecruise.data.models.UserStats
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.delay
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserRepository @Inject constructor(
    // TODO: Inject API service and preferences manager
) {
    
    fun getUserProfile(): Flow<Resource<User>> = flow {
        emit(Resource.Loading())
        
        try {
            delay(800)
            
            // Mock user data - replace with actual API call
            val mockUser = User(
                id = "user123",
                email = "john.doe@example.com",
                firstName = "John",
                lastName = "Doe",
                phone = "+1234567890",
                dateOfBirth = "1985-06-15",
                nationality = "American",
                profileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                isEmailVerified = true,
                isPhoneVerified = false,
                role = UserRole.USER,
                preferences = UserPreferences(
                    language = "en",
                    currency = "USD"
                ),
                stats = UserStats(
                    totalBookings = 3,
                    totalSpent = 4500.0,
                    favoriteDestinations = listOf("Luxor", "Aswan", "Abu Simbel"),
                    memberSince = "2022-03-15",
                    loyaltyPoints = 1250
                ),
                createdAt = "2022-03-15T10:30:00Z",
                updatedAt = "2024-01-15T14:20:00Z"
            )
            
            emit(Resource.Success(mockUser))
            
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load user profile: ${e.message}"))
        }
    }
    
    fun updateUserProfile(user: User): Flow<Resource<User>> = flow {
        emit(Resource.Loading())
        
        try {
            delay(1000)
            
            // Mock update - replace with actual API call
            emit(Resource.Success(user))
            
        } catch (e: Exception) {
            emit(Resource.Error("Failed to update profile: ${e.message}"))
        }
    }
}