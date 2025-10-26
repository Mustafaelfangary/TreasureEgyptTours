package com.dahabiyat.nilecruise.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.data.models.Itinerary
import com.dahabiyat.nilecruise.ui.components.LoadingScreen
import com.dahabiyat.nilecruise.ui.theme.*
import com.dahabiyat.nilecruise.ui.viewmodels.ItineraryListViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItineraryListScreen(
    onItineraryClick: (String) -> Unit,
    onBackClick: () -> Unit,
    isLoading: Boolean,
    viewModel: ItineraryListViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadItineraries()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        RoyalBlue.copy(alpha = 0.05f),
                        NileBackground,
                        MaterialTheme.colorScheme.background
                    )
                )
            )
    ) {
        // Top app bar
        TopAppBar(
            title = {
                Text(
                    text = stringResource(R.string.nav_itineraries),
                    fontWeight = FontWeight.Bold
                )
            },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back"
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface,
                titleContentColor = RoyalBlue
            )
        )

        // Content
        when {
            uiState.isLoading || isLoading -> {
                LoadingScreen(message = "Loading itineraries...")
            }
            uiState.error != null -> {
                ErrorState(
                    error = uiState.error ?: "",
                    onRetry = { viewModel.loadItineraries() }
                )
            }
            uiState.itineraries.isEmpty() -> {
                EmptyState()
            }
            else -> {
                ItinerariesList(
                    itineraries = uiState.itineraries,
                    onItineraryClick = onItineraryClick
                )
            }
        }
    }
}

@Composable
private fun ItinerariesList(
    itineraries: List<Itinerary>,
    onItineraryClick: (String) -> Unit
) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "${itineraries.size} itineraries available",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
        }

        items(itineraries) { itinerary ->
            ItineraryCard(
                itinerary = itinerary,
                onClick = { onItineraryClick(itinerary.id) }
            )
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun ItineraryCard(
    itinerary: Itinerary,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column {
            // Image section
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            ) {
                AsyncImage(
                    model = itinerary.mainImageUrl ?: "https://via.placeholder.com/400x200?text=Itinerary",
                    contentDescription = itinerary.name,
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)),
                    contentScale = ContentScale.Crop
                )
                
                // Gradient overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    androidx.compose.ui.graphics.Color.Transparent,
                                    androidx.compose.ui.graphics.Color.Black.copy(alpha = 0.3f)
                                ),
                                startY = 0f,
                                endY = Float.POSITIVE_INFINITY
                            )
                        )
                )
                
                // Featured badge
                if (itinerary.featured) {
                    Card(
                        modifier = Modifier
                            .padding(12.dp)
                            .align(Alignment.TopEnd),
                        colors = CardDefaults.cardColors(
                            containerColor = EgyptianGold
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "Featured",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSecondary
                        )
                    }
                }
                
                // Rating
                if (itinerary.rating > 0) {
                    Card(
                        modifier = Modifier
                            .padding(12.dp)
                            .align(Alignment.BottomStart),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f)
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = EgyptianGold,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = String.format("%.1f", itinerary.rating),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
            
            // Content section
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Title
                Text(
                    text = itinerary.name,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = RoyalBlue,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                
                // Description
                if (!itinerary.shortDescription.isNullOrBlank()) {
                    Text(
                        text = itinerary.shortDescription,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                
                // Details row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Duration
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.AccessTime,
                            contentDescription = null,
                            tint = RoyalBlue,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "${itinerary.durationDays} days",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                    
                    // Price (if available)
                    if (itinerary.price != null) {
                        Text(
                            text = "From $${String.format("%.0f", itinerary.price)}",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = EgyptianGold
                        )
                    }
                }
                
                // Difficulty badge
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = when (itinerary.difficulty) {
                            com.dahabiyat.nilecruise.data.models.ItineraryDifficulty.EASY -> androidx.compose.ui.graphics.Color.Green.copy(alpha = 0.2f)
                            com.dahabiyat.nilecruise.data.models.ItineraryDifficulty.MODERATE -> EgyptianGold.copy(alpha = 0.2f)
                            com.dahabiyat.nilecruise.data.models.ItineraryDifficulty.CHALLENGING -> androidx.compose.ui.graphics.Color.Red.copy(alpha = 0.2f)
                        }
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = itinerary.difficulty.name.lowercase().replaceFirstChar { it.uppercase() },
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = when (itinerary.difficulty) {
                            com.dahabiyat.nilecruise.data.models.ItineraryDifficulty.EASY -> androidx.compose.ui.graphics.Color.Green
                            com.dahabiyat.nilecruise.data.models.ItineraryDifficulty.MODERATE -> EgyptianGold
                            com.dahabiyat.nilecruise.data.models.ItineraryDifficulty.CHALLENGING -> androidx.compose.ui.graphics.Color.Red
                        },
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}

@Composable
private fun ErrorState(
    error: String,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Oops! Something went wrong",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = RoyalBlue
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = error,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Button(
            onClick = onRetry,
            colors = ButtonDefaults.buttonColors(
                containerColor = RoyalBlue
            )
        ) {
            Text(stringResource(R.string.action_retry))
        }
    }
}

@Composable
private fun EmptyState() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "No itineraries found",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = RoyalBlue
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Check back later for new routes",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
    }
}