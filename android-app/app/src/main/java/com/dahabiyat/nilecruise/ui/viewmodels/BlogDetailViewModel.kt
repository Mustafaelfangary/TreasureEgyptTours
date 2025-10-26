package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.BlogPost
import com.dahabiyat.nilecruise.data.repositories.BlogRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class BlogDetailViewModel @Inject constructor(
    private val repo: BlogRepository
) : ViewModel() {

    data class UiState(
        val isLoading: Boolean = false,
        val data: BlogPost? = null,
        val error: String? = null
    )

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun load(blogId: String) {
        viewModelScope.launch {
            repo.getBlogById(blogId).collect { res ->
                when (res) {
                    is Resource.Loading -> _uiState.value = _uiState.value.copy(isLoading = true, error = null)
                    is Resource.Success -> _uiState.value = UiState(isLoading = false, data = res.data)
                    is Resource.Error -> _uiState.value = UiState(isLoading = false, error = res.message)
                }
            }
        }
    }
}
