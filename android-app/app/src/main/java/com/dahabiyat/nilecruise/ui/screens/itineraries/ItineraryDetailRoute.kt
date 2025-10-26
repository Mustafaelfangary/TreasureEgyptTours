package com.dahabiyat.nilecruise.ui.screens.itineraries

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.hilt.navigation.compose.hiltViewModel
import com.dahabiyat.nilecruise.ui.viewmodels.ItineraryDetailViewModel
import com.dahabiyat.nilecruise.ui.screens.ItineraryDetailScreen

@Composable
fun ItineraryDetailRoute(
    itineraryId: String,
    onBackClick: () -> Unit,
    onBookNowClick: (String) -> Unit
) {
    val vm: ItineraryDetailViewModel = hiltViewModel()
    val ui by vm.uiState.collectAsState()

    LaunchedEffect(itineraryId) {
        vm.load(itineraryId)
    }

    when {
        ui.isLoading -> CircularProgressIndicator()
        ui.error != null -> Text(text = ui.error ?: "Error", color = MaterialTheme.colorScheme.error)
        ui.data != null -> ItineraryDetailScreen(
            itinerary = ui.data!!,
            onBackClick = onBackClick,
            onBookNowClick = onBookNowClick
        )
    }
}
