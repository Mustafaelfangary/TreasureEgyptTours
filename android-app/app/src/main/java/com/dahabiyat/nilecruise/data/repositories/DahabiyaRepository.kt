package com.dahabiyat.nilecruise.data.repositories

import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.data.models.GalleryImage
import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DahabiyaRepository @Inject constructor(
    private val api: DahabiyatApiService
) {

    fun getFeaturedDahabiyas(): Flow<Resource<List<Dahabiya>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getFeaturedDahabiyas()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success) {
                    emit(Resource.Success(body.data ?: emptyList()))
                } else {
                    emit(Resource.Error(body?.error ?: body?.message ?: "Failed to load featured dahabiyas"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load dahabiyas: ${e.message}"))
        }
    }

    fun getDahabiyaBySlug(slug: String): Flow<Resource<Dahabiya>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getDahabiyaBySlug(slug)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    emit(Resource.Success(body.data))
                } else {
                    emit(Resource.Error(body?.error ?: body?.message ?: "Dahabiya not found"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load dahabiya: ${e.message}"))
        }
    }

    fun getDahabiyaById(id: String): Flow<Resource<Dahabiya>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getDahabiyaById(id)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.success && body.data != null) {
                    emit(Resource.Success(body.data))
                } else {
                    emit(Resource.Error(body?.error ?: body?.message ?: "Dahabiya not found"))
                }
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load dahabiya: ${e.message}"))
        }
    }

    fun getDahabiyaByIdOrSlug(idOrSlug: String): Flow<Resource<Dahabiya>> = flow {
        // Simple heuristic: if contains non-url-safe or is long UUID-like, try ID first, else slug
        val looksLikeId = idOrSlug.contains("-") || idOrSlug.length >= 12
        emit(Resource.Loading())
        try {
            val resp = if (looksLikeId) api.getDahabiyaById(idOrSlug) else api.getDahabiyaBySlug(idOrSlug)
            if (resp.isSuccessful) {
                val body = resp.body()
                if (body != null && body.success && body.data != null) {
                    emit(Resource.Success(body.data))
                } else if (!looksLikeId) {
                    // If slug attempt failed, try by ID as fallback
                    val byId = api.getDahabiyaById(idOrSlug)
                    if (byId.isSuccessful) {
                        val b2 = byId.body()
                        if (b2 != null && b2.success && b2.data != null) {
                            emit(Resource.Success(b2.data))
                        } else {
                            emit(Resource.Error(b2?.error ?: b2?.message ?: "Dahabiya not found"))
                        }
                    } else {
                        emit(Resource.Error("HTTP ${byId.code()}: ${byId.message()}"))
                    }
                } else {
                    emit(Resource.Error(body?.error ?: body?.message ?: "Dahabiya not found"))
                }
            } else if (looksLikeId) {
                // If ID attempt failed, try slug as fallback
                val bySlug = api.getDahabiyaBySlug(idOrSlug)
                if (bySlug.isSuccessful) {
                    val b2 = bySlug.body()
                    if (b2 != null && b2.success && b2.data != null) {
                        emit(Resource.Success(b2.data))
                    } else {
                        emit(Resource.Error(b2?.error ?: b2?.message ?: "Dahabiya not found"))
                    }
                } else {
                    emit(Resource.Error("HTTP ${bySlug.code()}: ${bySlug.message()}"))
                }
            } else {
                emit(Resource.Error("HTTP ${resp.code()}: ${resp.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Failed to load dahabiya: ${e.message}"))
        }
    }

    fun getAllDahabiyas(page: Int = 1, limit: Int = 20): Flow<Resource<List<Dahabiya>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getDahabiyas(page = page, limit = limit)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    emit(Resource.Success(body.dahabiyas))
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
            emit(Resource.Error("Failed to load all dahabiyas: ${e.message}"))
        }
    }

    // Backward-compatible overload
    fun getAllDahabiyas(): Flow<Resource<List<Dahabiya>>> = getAllDahabiyas(page = 1, limit = 20)

    fun getDahabiyaGallery(dahabiyaId: String, page: Int = 1, limit: Int = 20): Flow<Resource<List<GalleryImage>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getGalleryImages(page = page, limit = limit, category = null, dahabiyaId = dahabiyaId)
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
            emit(Resource.Error("Failed to load gallery: ${e.message}"))
        }
    }
}