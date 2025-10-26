package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.GalleryImage
import com.dahabiyat.nilecruise.data.models.PaginatedResponse
import com.dahabiyat.nilecruise.data.repository.ContentRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class GalleryViewModel @Inject constructor(
    private val contentRepository: ContentRepository
) : ViewModel() {

    data class UiState(
        val isLoading: Boolean = false,
        val error: String? = null,
        val data: List<GalleryImage> = emptyList()
    )

    private val _uiState = MutableStateFlow(UiState(isLoading = true))
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        loadGallery()
    }

    fun loadGallery(page: Int = 1, limit: Int = 20, category: String? = null) {
        viewModelScope.launch {
            contentRepository.getGalleryImages(page, limit, category).collect { res: Resource<PaginatedResponse<GalleryImage>> ->
                when (res) {
                    is Resource.Loading -> _uiState.value = _uiState.value.copy(isLoading = true, error = null)
                    is Resource.Success -> {
                        val list = res.data?.data ?: emptyList()
                        _uiState.value = UiState(isLoading = false, error = null, data = list)
                    }
                    is Resource.Error -> _uiState.value = UiState(isLoading = false, error = res.message ?: "Failed to load gallery", data = emptyList())
                }
            }
        }
    }
}
