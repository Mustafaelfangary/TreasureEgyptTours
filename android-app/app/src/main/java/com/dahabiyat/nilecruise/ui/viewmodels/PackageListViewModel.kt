package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.Package
import com.dahabiyat.nilecruise.data.repositories.PackageRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PackageListUiState(
    val isLoading: Boolean = false,
    val packages: List<Package> = emptyList(),
    val filteredPackages: List<Package> = emptyList(),
    val error: String? = null,
    val searchQuery: String = ""
)

@HiltViewModel
class PackageListViewModel @Inject constructor(
    private val packageRepository: PackageRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PackageListUiState())
    val uiState: StateFlow<PackageListUiState> = _uiState.asStateFlow()

    fun loadPackages() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            packageRepository.getAllPackages().collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(isLoading = true)
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            packages = resource.data ?: emptyList(),
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

    fun searchPackages(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
        
        if (query.isBlank()) {
            _uiState.value = _uiState.value.copy(filteredPackages = emptyList())
            return
        }
        
        val filtered = _uiState.value.packages.filter { packageItem ->
            packageItem.name.contains(query, ignoreCase = true) ||
            packageItem.description.contains(query, ignoreCase = true) ||
            packageItem.highlights.any { it.contains(query, ignoreCase = true) }
        }
        
        _uiState.value = _uiState.value.copy(filteredPackages = filtered)
    }

    fun filterByCategory(category: com.dahabiyat.nilecruise.data.models.PackageCategory) {
        val filtered = _uiState.value.packages.filter { it.category == category }
        _uiState.value = _uiState.value.copy(filteredPackages = filtered)
    }

    fun filterByDuration(minDays: Int, maxDays: Int) {
        val filtered = _uiState.value.packages.filter { 
            it.durationDays in minDays..maxDays 
        }
        _uiState.value = _uiState.value.copy(filteredPackages = filtered)
    }

    fun clearFilters() {
        _uiState.value = _uiState.value.copy(
            filteredPackages = emptyList(),
            searchQuery = ""
        )
    }
}