package com.dahabiyat.nilecruise.data.repository

import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import retrofit2.Response
import javax.inject.Inject
import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.models.ApiResponse
import com.dahabiyat.nilecruise.data.models.GalleryImage
import java.io.File

class GalleryRepository @Inject constructor(
    private val api: DahabiyatApiService
) {
    suspend fun uploadImage(file: File, title: String? = null, caption: String? = null): Response<ApiResponse<GalleryImage>> = withContext(Dispatchers.IO) {
        val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())
        val body = MultipartBody.Part.createFormData("image", file.name, requestFile)
        api.uploadGalleryImage(body, title, caption)
    }
}
