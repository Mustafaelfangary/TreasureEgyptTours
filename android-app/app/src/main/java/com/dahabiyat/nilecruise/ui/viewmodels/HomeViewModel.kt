package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.data.repository.DahabiyaRepository
import com.dahabiyat.nilecruise.data.repository.PackageRepository
import com.dahabiyat.nilecruise.data.repository.ItineraryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = false,
    val featuredDahabiyas: List<Dahabiya> = emptyList(),
    val popularPackages: List<Package> = emptyList(),
    val featuredItineraries: List<Itinerary> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val dahabiyaRepository: DahabiyaRepository,
    private val packageRepository: PackageRepository,
    private val itineraryRepository: ItineraryRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun loadHomeData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            try {
                // Load featured dahabiyas
                dahabiyaRepository.getFeaturedDahabiyas().collect { resource ->
                    when {
                        resource.data != null -> {
                            _uiState.value = _uiState.value.copy(
                                featuredDahabiyas = resource.data.take(5)
                            )
                        }
                        resource.error != null -> {
                            _uiState.value = _uiState.value.copy(
                                error = resource.error
                            )
                        }
                    }
                }

                // Load featured packages (popular)
                packageRepository.getFeaturedPackages().collect { resource ->
                    when {
                        resource.data != null -> {
                            _uiState.value = _uiState.value.copy(
                                popularPackages = resource.data.take(5)
                            )
                        }
                        resource.error != null && _uiState.value.error == null -> {
                            _uiState.value = _uiState.value.copy(
                                error = resource.error
                            )
                        }
                    }
                }

                // Load featured itineraries
                itineraryRepository.getFeaturedItineraries().collect { resource ->
                    when {
                        resource.data != null -> {
                            _uiState.value = _uiState.value.copy(
                                featuredItineraries = resource.data.take(5),
                                isLoading = false
                            )
                        }
                        resource.error != null && _uiState.value.error == null -> {
                            _uiState.value = _uiState.value.copy(
                                error = resource.error,
                                isLoading = false
                            )
                        }
                    }
                }

            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Unknown error occurred"
                )
            }
        }
    }

    fun refresh() {
        loadHomeData()
    }
}