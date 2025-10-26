package com.dahabiyat.nilecruise.data.repositories

import com.dahabiyat.nilecruise.data.models.Itinerary
import com.dahabiyat.nilecruise.data.models.ItineraryDay
import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ItineraryRepository @Inject constructor(
    private val api: DahabiyatApiService
) {

    fun getFeaturedItineraries(limit: Int = 5): Flow<Resource<List<Itinerary>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getItineraries(page = 1, limit = limit)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    emit(Resource.Success(body.data))
                } else {
                    emit(Resource.Error("Empty response"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load itineraries: ${e.message}"))
        }
    }

    fun getItineraryById(id: String): Flow<Resource<Itinerary>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getItineraryById(id)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    emit(Resource.Success(body.data))
                } else {
                    emit(Resource.Error(body?.error ?: body?.message ?: "Itinerary not found"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load itinerary: ${e.message}"))
        }
    }

    fun getAllItineraries(page: Int = 1, limit: Int = 20): Flow<Resource<List<Itinerary>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getItineraries(page = page, limit = limit)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    emit(Resource.Success(body.data))
                } else {
                    emit(Resource.Error("Empty response"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load all itineraries: ${e.message}"))
        }
    }
}