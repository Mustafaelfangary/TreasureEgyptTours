package com.dahabiyat.nilecruise.data.models

import kotlinx.serialization.Serializable

@Serializable
data class Itinerary(
    val id: String,
    val name: String,
    val slug: String,
    val description: String,
    val shortDescription: String? = null,
    val durationDays: Int,
    val mainImageUrl: String? = null,
    val gallery: List<String> = emptyList(),
    val videoUrl: String? = null,
    val price: Double? = null,
    val maxGuests: Int? = null,
    val highlights: List<String> = emptyList(),
    val included: List<String> = emptyList(),
    val notIncluded: List<String> = emptyList(),
    val days: List<ItineraryDay> = emptyList(),
    val rating: Double = 0.0,
    val reviewCount: Int = 0,
    val isActive: Boolean = true,
    val featured: Boolean = false,
    val difficulty: ItineraryDifficulty = ItineraryDifficulty.EASY,
    val category: ItineraryCategory = ItineraryCategory.PREMIUM
)

@Serializable
enum class ItineraryDifficulty {
    EASY, MODERATE, CHALLENGING
}

@Serializable
enum class ItineraryCategory {
    PREMIUM, LUXURY
}

@Serializable
data class ItineraryDay(
    val dayNumber: Int,
    val title: String,
    val description: String,
    val location: String? = null,
    val activities: List<String> = emptyList(),
    val meals: List<String> = emptyList(),
    val accommodation: String? = null
)

@Serializable
data class ItineraryPricingTier(
    val id: String,
    val category: ItineraryCategory,
    val paxRange: String,
    val price: Double,
    val singleSupplement: Double? = null
)
