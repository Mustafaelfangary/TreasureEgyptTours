package com.dahabiyat.nilecruise.utils

/**
 * A generic wrapper class for handling API responses and data states
 */
sealed class Resource<T>(
    val data: T? = null,
    val error: String? = null,
    val isLoading: Boolean = false
) {
    // Backwards compatibility: some ViewModels reference `message`; alias it to `error`.
    val message: String?
        get() = error
    class Success<T>(data: T) : Resource<T>(data)
    class Error<T>(error: String, data: T? = null) : Resource<T>(data, error)
    class Loading<T>(data: T? = null) : Resource<T>(data, isLoading = true)

    fun onSuccess(action: (T) -> Unit): Resource<T> {
        if (this is Success) {
            action(data!!)
        }
        return this
    }

    fun onError(action: (String) -> Unit): Resource<T> {
        if (this is Error) {
            action(error!!)
        }
        return this
    }

    fun onLoading(action: () -> Unit): Resource<T> {
        if (this is Loading) {
            action()
        }
        return this
    }
}
/**
 * Extension function to map Resource data
 */
inline fun <T, R> Resource<T>.map(transform: (T) -> R): Resource<R> {
    return when (this) {
        is Resource.Success -> Resource.Success(transform(this.data!!))
        is Resource.Error -> Resource.Error(this.error!!, this.data?.let(transform))
        is Resource.Loading -> Resource.Loading(this.data?.let(transform))
    }
}