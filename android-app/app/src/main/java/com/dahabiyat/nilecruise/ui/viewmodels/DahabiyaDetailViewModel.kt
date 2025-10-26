package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.data.models.GalleryImage
import com.dahabiyat.nilecruise.data.repositories.DahabiyaRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DahabiyaDetailViewModel @Inject constructor(
    private val repo: DahabiyaRepository
) : ViewModel() {

    data class UiState(
        val loading: Boolean = false,
        val error: String? = null,
        val dahabiya: Dahabiya? = null,
        val galleryLoading: Boolean = false,
        val galleryError: String? = null,
        val gallery: List<GalleryImage> = emptyList()
    )

    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state

    fun load(idOrSlug: String) {
        viewModelScope.launch {
            repo.getDahabiyaByIdOrSlug(idOrSlug).collect { res ->
                when (res) {
                    is Resource.Loading -> _state.value = _state.value.copy(loading = true, error = null)
                    is Resource.Error -> _state.value = _state.value.copy(loading = false, error = res.message)
                    is Resource.Success -> {
                        val item = res.data
                        _state.value = _state.value.copy(loading = false, dahabiya = item)
                        val id = item?.id
                        if (!id.isNullOrBlank()) {
                            loadGallery(id)
                        }
                    }
                }
            }
        }
    }

    private fun loadGallery(dahabiyaId: String) {
        viewModelScope.launch {
            repo.getDahabiyaGallery(dahabiyaId).collect { res: Resource<List<GalleryImage>> ->
                when (res) {
                    is Resource.Loading<*> -> _state.value = _state.value.copy(galleryLoading = true, galleryError = null)
                    is Resource.Error<*> -> _state.value = _state.value.copy(galleryLoading = false, galleryError = res.message)
                    is Resource.Success<List<GalleryImage>> -> _state.value = _state.value.copy(galleryLoading = false, gallery = res.data ?: emptyList())
                }
            }
        }
    }
}
