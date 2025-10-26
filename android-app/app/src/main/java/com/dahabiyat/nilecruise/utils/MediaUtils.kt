package com.dahabiyat.nilecruise.utils

import com.dahabiyat.nilecruise.BuildConfig

object MediaUtils {
    
    private val BASE_URLS = listOf(
        "https://www.dahabiyatnilecruise.com",
        "https://dahabiyatnilecruise.com",
        "https://api.dahabiyatnilecruise.com"
    )
    
    fun normalizeUrl(url: String?): String {
        if (url.isNullOrBlank()) return ""
        val trimmed = url.trim()
        
        // If already absolute (http/https), return as is
        if (trimmed.startsWith("http://", ignoreCase = true) || trimmed.startsWith("https://", ignoreCase = true)) {
            return trimmed
        }
        
        // For relative URLs, try different base URLs
        val base = BASE_URLS.first().trimEnd('/')
        val path = if (trimmed.startsWith('/')) trimmed else "/$trimmed"
        return base + path
    }
    
    // Helper method for image URLs with multiple fallback options
    fun getImageUrl(path: String?): String {
        if (path.isNullOrBlank()) return ""
        
        val normalizedUrl = normalizeUrl(path)
        if (normalizedUrl.isNotEmpty()) {
            return normalizedUrl
        }
        
        return ""
    }
    
    // Helper method for thumbnail URLs with comprehensive fallbacks
    fun getThumbnailUrl(path: String?): String {
        val normalizedUrl = normalizeUrl(path)
        
        return if (normalizedUrl.isNotEmpty()) {
            normalizedUrl
        } else {
            // Try different placeholder options
            listOf(
                "https://www.dahabiyatnilecruise.com/images/placeholder.jpg",
                "https://www.dahabiyatnilecruise.com/assets/images/default-boat.jpg",
                "https://via.placeholder.com/400x300?text=Dahabiya+Nile+Cruise",
                "https://images.unsplash.com/photo-1539650116574-75c0c6d0d795?w=400&h=300&fit=crop" // Nile river fallback
            ).first()
        }
    }
    
    // Method to validate if an image URL is likely to work
    fun isValidImageUrl(url: String?): Boolean {
        if (url.isNullOrBlank()) return false
        val trimmed = url.trim()
        
        // Check if it's a proper URL format
        val urlPattern = "^https?://.*\\.(jpg|jpeg|png|gif|webp|svg)$".toRegex(RegexOption.IGNORE_CASE)
        return urlPattern.matches(trimmed) || 
               trimmed.startsWith("http://", ignoreCase = true) ||
               trimmed.startsWith("https://", ignoreCase = true)
    }
    
    // Get the best available image URL from a list of options
    fun getBestImageUrl(vararg urls: String?): String {
        for (url in urls) {
            val normalized = getImageUrl(url)
            if (normalized.isNotEmpty()) {
                return normalized
            }
        }
        return getThumbnailUrl(null)
    }
}
