package com.dahabiyat.nilecruise.data.repositories

import com.dahabiyat.nilecruise.data.models.Package
import com.dahabiyat.nilecruise.data.models.PackageItineraryDay
import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PackageRepository @Inject constructor(
    private val api: DahabiyatApiService
) {

    fun getPopularPackages(limit: Int = 5): Flow<Resource<List<Package>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getPopularPackages(limit = limit)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success) {
                    emit(Resource.Success(body.data ?: emptyList()))
                } else {
                    emit(Resource.Error(body?.error ?: body?.message ?: "Failed to load packages"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load packages: ${e.message}"))
        }
    }

    fun getPackageById(id: String): Flow<Resource<Package>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getPackageById(id)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    emit(Resource.Success(body.data))
                } else {
                    emit(Resource.Error(body?.error ?: body?.message ?: "Package not found"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load package: ${e.message}"))
        }
    }

    fun getAllPackages(page: Int = 1, limit: Int = 20): Flow<Resource<List<Package>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getPackages(page = page, limit = limit)
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
            emit(Resource.Error("Failed to load all packages: ${e.message}"))
        }
    }

    // Backward-compatible overload
    fun getAllPackages(): Flow<Resource<List<Package>>> = getAllPackages(page = 1, limit = 20)
}