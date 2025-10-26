package com.dahabiyat.nilecruise.data.models.controlpanel

import kotlinx.serialization.Serializable

@Serializable
data class ControlPanelConfig(
    val id: String,
    val appName: String = "Dahabiyat Nile Cruise",
    val appVersion: String = "1.0.0",
    val maintenanceMode: Boolean = false,
    val maintenanceMessage: String = "",
    val featuresEnabled: FeaturesConfig = FeaturesConfig(),
    val apiConfig: ApiConfig = ApiConfig(),
    val uiConfig: UiConfig = UiConfig(),
    val socialLinks: SocialLinks = SocialLinks(),
    val contactInfo: ContactInfo = ContactInfo(),
    val lastUpdated: String = ""
)

@Serializable
data class FeaturesConfig(
    val bookingEnabled: Boolean = true,
    val paymentEnabled: Boolean = true,
    val reviewsEnabled: Boolean = true,
    val chatEnabled: Boolean = true,
    val notificationsEnabled: Boolean = true,
    val offlineMode: Boolean = false,
    val biometricAuth: Boolean = true,
    val socialLogin: Boolean = true,
    val guestMode: Boolean = true,
    val multiLanguage: Boolean = true
)

@Serializable
data class ApiConfig(
    val baseUrl: String = "https://www.dahabiyatnilecruise.com/api/v1/",
    val timeout: Int = 30000,
    val retryAttempts: Int = 3,
    val enableLogging: Boolean = true,
    val enableCaching: Boolean = true,
    val cacheTimeout: Int = 300000
)

@Serializable
data class UiConfig(
    val primaryColor: String = "#0080FF",
    val secondaryColor: String = "#FFD700",
    val darkModeEnabled: Boolean = true,
    val animationsEnabled: Boolean = true,
    val showSplashScreen: Boolean = true,
    val splashDuration: Int = 3000,
    val defaultLanguage: String = "en",
    val defaultCurrency: String = "USD"
)

@Serializable
data class SocialLinks(
    val facebook: String = "https://facebook.com/dahabiyatnilecruise",
    val instagram: String = "https://instagram.com/dahabiyatnilecruise",
    val twitter: String = "https://twitter.com/dahabiyatnile",
    val youtube: String = "https://youtube.com/dahabiyatnilecruise",
    val linkedin: String = "https://linkedin.com/company/dahabiyat-nile-cruise"
)

@Serializable
data class ContactInfo(
    val phone: String = "+20 123 456 7890",
    val email: String = "info@dahabiyatnilecruise.com",
    val whatsapp: String = "+20 123 456 7890",
    val address: String = "Luxor, Egypt",
    val emergencyContact: String = "+20 123 456 7890",
    val supportHours: String = "24/7"
)