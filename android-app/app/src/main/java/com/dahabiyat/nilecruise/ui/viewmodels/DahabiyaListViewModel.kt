package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.data.repositories.DahabiyaRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DahabiyaListUiState(
    val isLoading: Boolean = false,
    val dahabiyas: List<Dahabiya> = emptyList(),
    val filteredDahabiyas: List<Dahabiya> = emptyList(),
    val error: String? = null,
    val searchQuery: String = ""
)

@HiltViewModel
class DahabiyaListViewModel @Inject constructor(
    private val dahabiyaRepository: DahabiyaRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DahabiyaListUiState())
    val uiState: StateFlow<DahabiyaListUiState> = _uiState.asStateFlow()

    fun loadDahabiyas() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            dahabiyaRepository.getAllDahabiyas().collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(isLoading = true)
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            dahabiyas = resource.data ?: emptyList(),
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

    fun searchDahabiyas(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
        
        if (query.isBlank()) {
            _uiState.value = _uiState.value.copy(filteredDahabiyas = emptyList())
            return
        }
        
        val filtered = _uiState.value.dahabiyas.filter { dahabiya ->
            dahabiya.name.contains(query, ignoreCase = true) ||
            dahabiya.description.contains(query, ignoreCase = true) ||
            dahabiya.features.any { it.contains(query, ignoreCase = true) }
        }
        
        _uiState.value = _uiState.value.copy(filteredDahabiyas = filtered)
    }

    fun filterByCategory(category: com.dahabiyat.nilecruise.data.models.DahabiyaCategory) {
        val filtered = _uiState.value.dahabiyas.filter { it.category == category }
        _uiState.value = _uiState.value.copy(filteredDahabiyas = filtered)
    }

    fun clearFilters() {
        _uiState.value = _uiState.value.copy(
            filteredDahabiyas = emptyList(),
            searchQuery = ""
        )
    }
}