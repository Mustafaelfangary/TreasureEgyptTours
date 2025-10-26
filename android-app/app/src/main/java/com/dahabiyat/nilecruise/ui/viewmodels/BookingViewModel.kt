package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.data.repository.BookingRepository
import com.dahabiyat.nilecruise.data.repository.WebsiteRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import timber.log.Timber
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject

data class BookingUiState(
    val isLoading: Boolean = false,
    val bookings: List<Booking> = emptyList(),
    val currentBooking: Booking? = null,
    val availableDates: List<String> = emptyList(),
    val calculatedPrice: Double? = null,
    val error: String? = null,
    val successMessage: String? = null,
    val isCreatingBooking: Boolean = false,
    val isCancellingBooking: Boolean = false
)

@HiltViewModel
class BookingViewModel @Inject constructor(
    private val bookingRepository: BookingRepository,
    private val websiteRepository: WebsiteRepository
) : ViewModel() {
    
    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    private val _uiState = MutableStateFlow(BookingUiState())
    val uiState: StateFlow<BookingUiState> = _uiState.asStateFlow()
    
    // Website integration methods
    fun syncWithWebsite() {
        viewModelScope.launch {
            try {
                // Sync dahabiyas
                websiteRepository.getAllDahabiyas()
                    .onSuccess { dahabiyas ->
                        Timber.d("Successfully synced ${dahabiyas.size} dahabiyas from website")
                    }
                    .onFailure { error ->
                        Timber.e(error, "Failed to sync dahabiyas from website")
                    }
                
                // Sync packages
                websiteRepository.getAllPackages()
                    .onSuccess { packages ->
                        Timber.d("Successfully synced ${packages.size} packages from website")
                    }
                    .onFailure { error ->
                        Timber.e(error, "Failed to sync packages from website")
                    }
                
                // Sync user bookings if logged in
                websiteRepository.getUserBookings()
                    .onSuccess { bookings ->
                        Timber.d("Successfully synced ${bookings.size} bookings from website")
                        _uiState.update { state ->
                            state.copy(
                                bookings = bookings,
                                error = null
                            )
                        }
                    }
                    .onFailure { error ->
                        Timber.d("Not syncing bookings: ${error.message}")
                        // Don't show error as user might not be logged in
                    }
            } catch (e: Exception) {
                Timber.e(e, "Error syncing with website")
            }
        }
    }
    
    fun createWebsiteBooking(
        dahabiyaId: String,
        startDate: LocalDate,
        endDate: LocalDate,
        adults: Int,
        children: Int = 0,
        packageId: String? = null,
        specialRequests: String? = null,
        onSuccess: (String) -> Unit
    ) {
        viewModelScope.launch {
            _uiState.update { it.copy(isCreatingBooking = true, error = null) }
            
            websiteRepository.createBooking(
                dahabiyaId = dahabiyaId,
                startDate = startDate.format(dateFormatter),
                endDate = endDate.format(dateFormatter),
                numberOfAdults = adults,
                numberOfChildren = children,
                packageId = packageId,
                specialRequests = specialRequests
            ).onSuccess { booking ->
                _uiState.update { 
                    it.copy(
                        isCreatingBooking = false,
                        currentBooking = booking,
                        successMessage = "Booking created successfully on dahabiyatnilecruise.com!"
                    )
                }
                onSuccess(booking.id)
            }.onFailure { error ->
                _uiState.update { 
                    it.copy(
                        isCreatingBooking = false,
                        error = "Failed to create booking on website: ${error.message}"
                    )
                }
            }
        }
    }
    
    fun checkWebsiteAvailability(
        dahabiyaId: String,
        startDate: LocalDate,
        endDate: LocalDate,
        onResult: (Boolean, String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val startDateStr = startDate.format(dateFormatter)
                val endDateStr = endDate.format(dateFormatter)
                
                websiteRepository.checkAvailability(dahabiyaId, startDateStr, endDateStr)
                    .onSuccess { availability ->
                        val isAvailable = availability.values.all { it }
                        val message = if (isAvailable) 
                            "Available for selected dates" 
                        else 
                            "Not available for selected dates. Please choose different dates."
                        
                        onResult(isAvailable, message)
                    }
                    .onFailure { error ->
                        onResult(false, "Could not check availability: ${error.message}")
                    }
            } catch (e: Exception) {
                Timber.e(e, "Error checking availability")
                onResult(false, "Error checking availability: ${e.message}")
            }
        }
    }

    fun createBooking(
        dahabiyaId: String? = null,
        packageId: String? = null,
        startDate: String,
        endDate: String,
        guests: Int,
        guestDetails: List<GuestDetail>,
        contactInfo: ContactInfo,
        specialRequests: String? = null,
        promoCode: String? = null
    ) {
        viewModelScope.launch {
            val request = CreateBookingRequest(
                dahabiyaId = dahabiyaId,
                packageId = packageId,
                startDate = startDate,
                endDate = endDate,
                guests = guests,
                guestDetails = guestDetails,
                contactInfo = contactInfo,
                specialRequests = specialRequests,
                promoCode = promoCode
            )
            
            bookingRepository.createBooking(request).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isCreatingBooking = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isCreatingBooking = false,
                            currentBooking = resource.data,
                            successMessage = "Booking created successfully!",
                            error = null
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isCreatingBooking = false,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun loadUserBookings(status: BookingStatus? = null) {
        viewModelScope.launch {
            bookingRepository.getUserBookings(status = status).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            bookings = resource.data?.data ?: emptyList(),
                            error = null
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun loadBookingById(id: String) {
        viewModelScope.launch {
            bookingRepository.getBookingById(id).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            currentBooking = resource.data,
                            error = null
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun cancelBooking(id: String) {
        viewModelScope.launch {
            bookingRepository.cancelBooking(id).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isCancellingBooking = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isCancellingBooking = false,
                            currentBooking = resource.data,
                            successMessage = "Booking cancelled successfully",
                            error = null
                        )
                        // Refresh bookings list
                        loadUserBookings()
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isCancellingBooking = false,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun loadAvailableDates(
        dahabiyaId: String? = null,
        packageId: String? = null,
        month: String? = null
    ) {
        viewModelScope.launch {
            bookingRepository.getAvailableDates(dahabiyaId, packageId, month).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        // Don't show loading for date availability
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            availableDates = resource.data ?: emptyList(),
                            error = null
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            availableDates = emptyList(),
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun calculatePrice(
        dahabiyaId: String? = null,
        packageId: String? = null,
        startDate: String,
        endDate: String,
        guests: Int,
        promoCode: String? = null
    ) {
        viewModelScope.launch {
            bookingRepository.calculateBookingPrice(
                dahabiyaId, packageId, startDate, endDate, guests, promoCode
            ).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        // Don't show loading for price calculation
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            calculatedPrice = resource.data,
                            error = null
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            calculatedPrice = null,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun clearSuccessMessage() {
        _uiState.value = _uiState.value.copy(successMessage = null)
    }

    fun clearCurrentBooking() {
        _uiState.value = _uiState.value.copy(currentBooking = null)
    }

    // Validation helpers
    fun validateBookingDates(startDate: String, endDate: String): String? {
        return when {
            startDate.isBlank() -> "Start date is required"
            endDate.isBlank() -> "End date is required"
            startDate >= endDate -> "End date must be after start date"
            else -> null
        }
    }

    fun validateGuestCount(guests: Int): String? {
        return when {
            guests < 1 -> "At least 1 guest is required"
            guests > 20 -> "Maximum 20 guests allowed"
            else -> null
        }
    }

    fun validateContactInfo(contactInfo: ContactInfo): String? {
        return when {
            contactInfo.email.isBlank() -> "Email is required"
            !android.util.Patterns.EMAIL_ADDRESS.matcher(contactInfo.email).matches() -> "Invalid email format"
            contactInfo.phone.isBlank() -> "Phone number is required"
            else -> null
        }
    }
}
