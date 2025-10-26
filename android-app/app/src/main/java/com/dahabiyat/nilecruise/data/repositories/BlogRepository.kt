package com.dahabiyat.nilecruise.data.repositories

import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.models.ApiResponse
import com.dahabiyat.nilecruise.data.models.BlogPost
import com.dahabiyat.nilecruise.data.models.PaginatedResponse
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BlogRepository @Inject constructor(
    private val api: DahabiyatApiService
) {
    fun getBlogs(page: Int = 1, limit: Int = 20, category: String? = null, search: String? = null): Flow<Resource<PaginatedResponse<BlogPost>>> = flow {
        emit(Resource.Loading())
        try {
            val resp = api.getBlogs(page = page, limit = limit, category = category, featured = null, search = search)
            if (resp.isSuccessful) {
                resp.body()?.let { emit(Resource.Success(it)) } ?: emit(Resource.Error("Empty response"))
            } else emit(Resource.Error("HTTP ${resp.code()}: ${resp.message()}"))
        } catch (e: HttpException) { emit(Resource.Error("Network error: ${e.localizedMessage}")) }
        catch (e: IOException) { emit(Resource.Error("Connection error: ${e.localizedMessage}")) }
        catch (e: Exception) { emit(Resource.Error("Unexpected error: ${e.localizedMessage}")) }
    }

    fun getBlogById(id: String): Flow<Resource<BlogPost>> = flow {
        emit(Resource.Loading())
        try {
            val resp = api.getBlogById(id)
            if (resp.isSuccessful) {
                val body: ApiResponse<BlogPost>? = resp.body()
                if (body != null && body.success && body.data != null) emit(Resource.Success(body.data))
                else emit(Resource.Error(body?.error ?: body?.message ?: "Blog not found"))
            } else emit(Resource.Error("HTTP ${resp.code()}: ${resp.message()}"))
        } catch (e: HttpException) { emit(Resource.Error("Network error: ${e.localizedMessage}")) }
        catch (e: IOException) { emit(Resource.Error("Connection error: ${e.localizedMessage}")) }
        catch (e: Exception) { emit(Resource.Error("Unexpected error: ${e.localizedMessage}")) }
    }
}
