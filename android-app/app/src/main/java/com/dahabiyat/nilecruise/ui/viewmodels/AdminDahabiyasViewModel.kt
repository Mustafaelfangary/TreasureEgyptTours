package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.CreateDahabiyaRequest
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.data.models.UpdateDahabiyaRequest
import com.dahabiyat.nilecruise.data.repository.DahabiyaRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AdminDahabiyasViewModel @Inject constructor(
    private val repo: DahabiyaRepository
) : ViewModel() {

    data class UiState(
        val isLoading: Boolean = false,
        val error: String? = null,
        val items: List<Dahabiya> = emptyList()
    )

    private val _ui = MutableStateFlow(UiState())
    val ui: StateFlow<UiState> = _ui

    fun load() {
        viewModelScope.launch {
            repo.getDahabiyas(page = 1, limit = 50).collect { res ->
                when (res) {
                    is Resource.Loading -> _ui.value = _ui.value.copy(isLoading = true, error = null)
                    is Resource.Error -> _ui.value = _ui.value.copy(isLoading = false, error = res.message)
                    is Resource.Success -> _ui.value = _ui.value.copy(isLoading = false, error = null, items = res.data?.data ?: emptyList())
                }
            }
        }
    }

    fun create(name: String, pricePerDay: Double?, capacity: Int?) {
        viewModelScope.launch {
            repo.createDahabiya(CreateDahabiyaRequest(name = name, pricePerDay = pricePerDay, capacity = capacity)).collect { res ->
                when (res) {
                    is Resource.Loading -> _ui.value = _ui.value.copy(isLoading = true)
                    is Resource.Error -> _ui.value = _ui.value.copy(isLoading = false, error = res.message)
                    is Resource.Success -> {
                        _ui.value = _ui.value.copy(isLoading = false, error = null)
                        load()
                    }
                }
            }
        }
    }

    fun delete(id: String) {
        viewModelScope.launch {
            repo.deleteDahabiya(id).collect { res ->
                when (res) {
                    is Resource.Loading -> _ui.value = _ui.value.copy(isLoading = true)
                    is Resource.Error -> _ui.value = _ui.value.copy(isLoading = false, error = res.message)
                    is Resource.Success -> {
                        _ui.value = _ui.value.copy(isLoading = false, error = null)
                        load()
                    }
                }
            }
        }
    }
}
