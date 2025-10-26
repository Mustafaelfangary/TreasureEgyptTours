package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.Itinerary
import com.dahabiyat.nilecruise.data.repositories.ItineraryRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ItineraryListUiState(
    val isLoading: Boolean = false,
    val itineraries: List<Itinerary> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class ItineraryListViewModel @Inject constructor(
    private val itineraryRepository: ItineraryRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ItineraryListUiState())
    val uiState: StateFlow<ItineraryListUiState> = _uiState.asStateFlow()

    fun loadItineraries() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            itineraryRepository.getAllItineraries().collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(isLoading = true)
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            itineraries = resource.data ?: emptyList(),
                            error = null
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.error ?: "Unknown error occurred"
                        )
                    }
                }
            }
        }
    }

    fun refresh() {
        loadItineraries()
    }
}