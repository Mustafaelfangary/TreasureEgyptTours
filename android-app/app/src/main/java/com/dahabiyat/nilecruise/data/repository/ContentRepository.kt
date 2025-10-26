package com.dahabiyat.nilecruise.data.repository

import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ContentRepository @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    
    fun getBlogPosts(
        page: Int = 1,
        limit: Int = 20,
        category: String? = null,
        tag: String? = null,
        search: String? = null
    ): Flow<Resource<PaginatedResponse<BlogPost>>> = flow {
        try {
            emit(Resource.Loading())
            // Map to available API: getBlogs(page, limit, category, featured, search)
            val response = apiService.getBlogs(page = page, limit = limit, category = category, featured = null, search = search)
            if (response.isSuccessful) {
                response.body()?.let { paginatedResponse ->
                    emit(Resource.Success(paginatedResponse))
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    fun getBlogPostById(id: String): Flow<Resource<BlogPost>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getBlogById(id)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Blog post not found"))
                    }
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    fun getGalleryImages(
        page: Int = 1,
        limit: Int = 20,
        category: String? = null
    ): Flow<Resource<PaginatedResponse<GalleryImage>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getGalleryImages(page, limit, category)
            if (response.isSuccessful) {
                response.body()?.let { paginatedResponse ->
                    emit(Resource.Success(paginatedResponse))
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    fun getReviews(
        page: Int = 1,
        limit: Int = 20,
        dahabiyaId: String? = null,
        packageId: String? = null,
        rating: Int? = null
    ): Flow<Resource<PaginatedResponse<Review>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getReviews(page, limit, dahabiyaId, packageId, rating)
            if (response.isSuccessful) {
                response.body()?.let { paginatedResponse ->
                    emit(Resource.Success(paginatedResponse))
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    fun submitContactForm(
        name: String,
        email: String,
        phone: String? = null,
        subject: String,
        message: String
    ): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val request = ContactMessage(
                name = name,
                email = email,
                phone = phone,
                subject = subject,
                message = message
            )
            val response = apiService.sendContactMessage(request)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success) {
                        emit(Resource.Success(apiResponse.data ?: "Message sent successfully"))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Failed to send message"))
                    }
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
}
