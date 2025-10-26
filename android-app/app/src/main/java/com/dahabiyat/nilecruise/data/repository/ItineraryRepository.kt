package com.dahabiyat.nilecruise.data.repository

import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.models.Itinerary
import com.dahabiyat.nilecruise.data.models.PaginatedResponse
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ItineraryRepository @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    fun getItineraries(
        page: Int = 1,
        limit: Int = 20,
        duration: Int? = null,
        search: String? = null
    ): Flow<Resource<PaginatedResponse<Itinerary>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getItineraries(
                page = page,
                limit = limit,
                duration = duration,
                search = search
            )
            if (response.isSuccessful) {
                response.body()?.let { paginated ->
                    emit(Resource.Success(paginated))
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

    fun getItineraryById(id: String): Flow<Resource<Itinerary>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getItineraryById(id)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Itinerary not found"))
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

    fun getFeaturedItineraries(limit: Int = 5): Flow<Resource<List<Itinerary>>> = flow {
        try {
            emit(Resource.Loading())
            // If backend doesn't have a /featured endpoint, fetch and filter client-side
            val response = apiService.getItineraries(page = 1, limit = limit * 3)
            if (response.isSuccessful) {
                response.body()?.let { paginated ->
                    val featured = paginated.data.filter { it.featured }.take(limit)
                    emit(Resource.Success(featured))
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
