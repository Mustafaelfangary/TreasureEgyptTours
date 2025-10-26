package com.dahabiyat.nilecruise.config

/**
 * Configuration settings for production builds
 */
object ProductionConfig {
    // Enable control panel in production builds
    const val CONTROL_PANEL_ENABLED = true
    
    // Control panel access settings
    const val REQUIRE_ADMIN_LOGIN = true
    
    // Feature flags for production
    const val ENABLE_BOOKING_FEATURES = true
    const val ENABLE_PAYMENT_GATEWAY = true
    const val ENABLE_ANALYTICS = true
    
    // Admin access configuration
    object AdminAccess {
        const val ADMIN_PANEL_ROUTE = "admin_panel"
        const val ADMIN_LOGIN_ROUTE = "admin_login"
        
        // Number of failed login attempts before temporary lockout
        const val MAX_LOGIN_ATTEMPTS = 5
        
        // Lockout duration in minutes after exceeding max login attempts
        const val LOCKOUT_DURATION_MINUTES = 30
    }
}