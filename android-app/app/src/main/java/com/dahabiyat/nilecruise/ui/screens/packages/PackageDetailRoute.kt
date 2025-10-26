package com.dahabiyat.nilecruise.ui.screens.packages

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.hilt.navigation.compose.hiltViewModel
import com.dahabiyat.nilecruise.ui.viewmodels.PackageDetailViewModel

@Composable
fun PackageDetailRoute(
    packageId: String,
    onBackClick: () -> Unit,
    onBookNowClick: () -> Unit,
    onShareClick: () -> Unit,
    onFavoriteClick: () -> Unit,
    isFavorite: Boolean = false
) {
    val vm: PackageDetailViewModel = hiltViewModel()
    val ui by vm.uiState.collectAsState()

    LaunchedEffect(packageId) {
        vm.load(packageId)
    }

    when {
        ui.isLoading -> {
            // Simple centered loader
            CircularProgressIndicator()
        }
        ui.error != null -> {
            // Error snackbar-like text; can be improved later
            Text(text = ui.error ?: "Error", color = MaterialTheme.colorScheme.error)
        }
        ui.data != null -> {
            PackageDetailScreen(
                packageItem = ui.data!!,
                onBackClick = onBackClick,
                onBookNowClick = onBookNowClick,
                onShareClick = onShareClick,
                onFavoriteClick = onFavoriteClick,
                isFavorite = isFavorite
            )
        }
    }
}
