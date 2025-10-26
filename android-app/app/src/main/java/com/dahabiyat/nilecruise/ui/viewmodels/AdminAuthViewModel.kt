package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import com.dahabiyat.nilecruise.data.repository.AuthRepository
import com.dahabiyat.nilecruise.di.NetworkModule
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AdminAuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val prefs: PreferencesManager
) : ViewModel() {

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun login(email: String, password: String, onSuccess: () -> Unit) {
        if (_loading.value) return
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            authRepository.adminSignIn(email, password).collect { res ->
                when (res) {
                    is Resource.Loading -> _loading.value = true
                    is Resource.Error -> {
                        _loading.value = false
                        _error.value = res.message
                    }
                    is Resource.Success -> {
                        _loading.value = false
                        val token = res.data?.data?.token
                        if (!token.isNullOrBlank()) {
                            // Persist token and set for interceptor
                            prefs.saveAuthToken(token)
                            NetworkModule.TokenProvider.token = token
                            onSuccess()
                        } else {
                            _error.value = "Missing token"
                        }
                    }
                }
            }
        }
    }
}
