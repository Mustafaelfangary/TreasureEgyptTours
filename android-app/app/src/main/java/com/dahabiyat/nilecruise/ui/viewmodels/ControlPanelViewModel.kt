package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.controlpanel.ControlPanelConfig
import com.dahabiyat.nilecruise.data.repository.ControlPanelRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ControlPanelViewModel @Inject constructor(
    private val controlPanelRepository: ControlPanelRepository
) : ViewModel() {

    private val _controlPanelConfig = MutableStateFlow<ControlPanelConfig?>(null)
    val controlPanelConfig: StateFlow<ControlPanelConfig?> = _controlPanelConfig.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    init {
        loadControlPanelConfig()
    }

    private fun loadControlPanelConfig() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            try {
                val result = controlPanelRepository.syncControlPanelData()
                result.onSuccess { config ->
                    _controlPanelConfig.value = config
                }.onFailure { exception ->
                    _error.value = exception.message ?: "Failed to load configuration"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Unknown error occurred"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun refreshConfig() {
        loadControlPanelConfig()
    }

    fun clearError() {
        _error.value = null
    }
}