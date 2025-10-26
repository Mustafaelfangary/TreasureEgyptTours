package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.repository.GalleryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject

@HiltViewModel
class AdminGalleryViewModel @Inject constructor(
    private val galleryRepository: GalleryRepository
) : ViewModel() {

    private val _isUploading = MutableStateFlow(false)
    val isUploading: StateFlow<Boolean> = _isUploading

    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message

    fun upload(file: File, title: String?, caption: String?) {
        if (_isUploading.value) return
        viewModelScope.launch {
            _isUploading.value = true
            _message.value = null
            try {
                val resp = galleryRepository.uploadImage(file, title, caption)
                if (resp.isSuccessful) {
                    _message.value = "Upload successful"
                } else {
                    _message.value = "Upload failed: ${resp.code()}"
                }
            } catch (e: Exception) {
                _message.value = "Error: ${e.message}"
            } finally {
                _isUploading.value = false
            }
        }
    }
}
