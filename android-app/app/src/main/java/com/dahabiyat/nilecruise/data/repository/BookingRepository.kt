package com.dahabiyat.nilecruise.data.repository

import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.flowOn
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BookingRepository @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    
    fun createBooking(request: CreateBookingRequest): Flow<Resource<Booking>> = flow {
        try {
            emit(Resource.Loading<Booking>())
            val response = apiService.createBooking(request)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Failed to create booking"))
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
    }.flowOn(Dispatchers.IO)
    
    fun getUserBookings(
        page: Int = 1,
        limit: Int = 20,
        status: BookingStatus? = null
    ): Flow<Resource<PaginatedResponse<Booking>>> = flow {
        try {
            emit(Resource.Loading<PaginatedResponse<Booking>>())
            val response = apiService.getUserBookings(page, limit, status?.name)
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
    
    fun getBookingById(id: String): Flow<Resource<Booking>> = flow {
        try {
            emit(Resource.Loading<Booking>())
            val response = apiService.getBookingById(id)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Booking not found"))
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
    
    fun cancelBooking(id: String): Flow<Resource<Booking>> = flow {
        try {
            emit(Resource.Loading<Booking>())
            val response = apiService.cancelBooking(id)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Failed to cancel booking"))
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
    
    fun updateBooking(id: String, request: CreateBookingRequest): Flow<Resource<Booking>> = flow {
        emit(Resource.Error("Update booking endpoint is not available in API"))
    }
    
    fun getAvailableDates(
        dahabiyaId: String? = null,
        packageId: String? = null,
        month: String? = null
    ): Flow<Resource<List<String>>> = flow {
        emit(Resource.Error("Available dates endpoint is not available in API"))
    }
    
    fun calculateBookingPrice(
        dahabiyaId: String? = null,
        packageId: String? = null,
        startDate: String,
        endDate: String,
        guests: Int,
        promoCode: String? = null
    ): Flow<Resource<Double>> = flow {
        emit(Resource.Error("Price calculation endpoint is not available in API"))
    }
}
