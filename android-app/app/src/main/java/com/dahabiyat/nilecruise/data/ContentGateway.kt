package com.dahabiyat.nilecruise.data

import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.first
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Single entry point for read data fetching across the app.
 * Always uses the live backend at Constants.BASE_URL.
 * Decides between full-site endpoints vs mobile-curated endpoints at runtime.
 */
@Singleton
class ContentGateway @Inject constructor(
    private val api: DahabiyatApiService,
    private val prefs: PreferencesManager,
) {
    enum class SourceStrategy { FULL_SITE, MOBILE_ONLY }

    private suspend fun strategy(): SourceStrategy {
        return if (prefs.isUseMobileContent().first()) SourceStrategy.MOBILE_ONLY else SourceStrategy.FULL_SITE
    }

    // Dahabiyas
    suspend fun listDahabiyas(
        page: Int = 1,
        limit: Int = 20,
        featured: Boolean? = null,
        minPrice: Double? = null,
        maxPrice: Double? = null,
        capacity: Int? = null,
        search: String? = null,
    ): Resource<List<Dahabiya>> {
        return try {
            when (strategy()) {
                SourceStrategy.FULL_SITE -> {
                    val res = api.getDahabiyas(page, limit, featured, minPrice, maxPrice, capacity, search)
                    if (res.isSuccessful) {
                        res.body()?.let { body ->
                            Resource.Success(body.dahabiyas)
                        } ?: Resource.Error("Empty response")
                    } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
                }
                SourceStrategy.MOBILE_ONLY -> {
                    val res = api.getMobileDahabiyas()
                    if (res.isSuccessful) {
                        val data = res.body()?.data ?: emptyList()
                        Resource.Success(data)
                    } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
                }
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Unexpected error")
        }
    }

    // Packages
    suspend fun listPackages(
        page: Int = 1,
        limit: Int = 20,
        category: String? = null,
        featured: Boolean? = null,
        popular: Boolean? = null,
        minPrice: Double? = null,
        maxPrice: Double? = null,
        duration: Int? = null,
        search: String? = null,
    ): Resource<List<Package>> {
        return try {
            // Mobile curated endpoint for packages not defined; use full-site list
            val res = api.getPackages(page, limit, category, featured, popular, minPrice, maxPrice, duration, search)
            if (res.isSuccessful) {
                val list = res.body()?.data ?: emptyList()
                Resource.Success(list)
            } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Unexpected error")
        }
    }

    // Itineraries
    suspend fun listItineraries(
        page: Int = 1,
        limit: Int = 20,
        duration: Int? = null,
        search: String? = null,
    ): Resource<List<Itinerary>> {
        return try {
            when (strategy()) {
                SourceStrategy.FULL_SITE -> {
                    val res = api.getItineraries(page, limit, duration, search)
                    if (res.isSuccessful) {
                        Resource.Success(res.body()?.data ?: emptyList())
                    } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
                }
                SourceStrategy.MOBILE_ONLY -> {
                    val res = api.getMobileItineraries()
                    if (res.isSuccessful) {
                        Resource.Success(res.body()?.data ?: emptyList())
                    } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
                }
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Unexpected error")
        }
    }

    // Blogs
    suspend fun listBlogs(
        page: Int = 1,
        limit: Int = 20,
        category: String? = null,
        featured: Boolean? = null,
        search: String? = null,
    ): Resource<List<BlogPost>> {
        return try {
            when (strategy()) {
                SourceStrategy.FULL_SITE -> {
                    val res = api.getBlogs(page, limit, category, featured, search)
                    if (res.isSuccessful) {
                        Resource.Success(res.body()?.data ?: emptyList())
                    } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
                }
                SourceStrategy.MOBILE_ONLY -> {
                    val res = api.getMobileBlogs()
                    if (res.isSuccessful) {
                        Resource.Success(res.body()?.data ?: emptyList())
                    } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
                }
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Unexpected error")
        }
    }

    // Gallery
    suspend fun listGalleryImages(
        page: Int = 1,
        limit: Int = 20,
        category: String? = null,
        dahabiyaId: String? = null,
    ): Resource<List<GalleryImage>> {
        return try {
            val res = api.getGalleryImages(page, limit, category, dahabiyaId)
            if (res.isSuccessful) {
                Resource.Success(res.body()?.data ?: emptyList())
            } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Unexpected error")
        }
    }

    // Website Content & Settings
    suspend fun getWebsiteContent(page: String? = null, section: String? = null): Resource<List<WebsiteContent>> {
        return try {
            val res = api.getWebsiteContent(page, section)
            if (res.isSuccessful) Resource.Success(res.body()?.data ?: emptyList())
            else Resource.Error("HTTP ${res.code()}: ${res.message()}")
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Unexpected error")
        }
    }

    suspend fun getAppSettings(): Resource<AppSettings> {
        return try {
            val res = api.getAppSettings()
            if (res.isSuccessful) {
                res.body()?.data?.let { Resource.Success(it) } ?: Resource.Error("Empty response")
            } else Resource.Error("HTTP ${res.code()}: ${res.message()}")
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Unexpected error")
        }
    }
}
