package com.dahabiyat.nilecruise.ui.screens.dahabiyas

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.ui.components.DahabiyaCard
import com.dahabiyat.nilecruise.ui.components.LoadingScreen
import com.dahabiyat.nilecruise.ui.theme.*
import com.dahabiyat.nilecruise.ui.viewmodels.DahabiyaListViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DahabiyaListScreen(
    onDahabiyaClick: (Dahabiya) -> Unit,
    onBackClick: () -> Unit,
    onFilterClick: () -> Unit,
    viewModel: DahabiyaListViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var searchQuery by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        viewModel.loadDahabiyas()
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
                    text = stringResource(R.string.dahabiyas_title),
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
            actions = {
                IconButton(onClick = onFilterClick) {
                    Icon(
                        imageVector = Icons.Default.FilterList,
                        contentDescription = "Filter"
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface,
                titleContentColor = RoyalBlue
            )
        )

        // Search bar
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { 
                    searchQuery = it
                    viewModel.searchDahabiyas(it)
                },
                placeholder = { Text("Search dahabiyas...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = RoyalBlue
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = RoyalBlue,
                    focusedLabelColor = RoyalBlue
                ),
                singleLine = true
            )
        }

        // Content
        when {
            uiState.isLoading -> {
                LoadingScreen(message = "Loading dahabiyas...")
            }
            uiState.error != null -> {
                ErrorState(
                    error = uiState.error ?: "",
                    onRetry = { viewModel.loadDahabiyas() }
                )
            }
            uiState.dahabiyas.isEmpty() -> {
                EmptyState()
            }
            else -> {
                DahabiyasList(
                    dahabiyas = uiState.filteredDahabiyas.ifEmpty { uiState.dahabiyas },
                    onDahabiyaClick = onDahabiyaClick
                )
            }
        }
    }
}

@Composable
private fun DahabiyasList(
    dahabiyas: List<Dahabiya>,
    onDahabiyaClick: (Dahabiya) -> Unit
) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "${dahabiyas.size} dahabiyas available",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
        }

        items(dahabiyas) { dahabiya ->
            DahabiyaCard(
                dahabiya = dahabiya,
                onClick = { onDahabiyaClick(dahabiya) }
            )
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
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
            text = "No dahabiyas found",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = RoyalBlue
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Try adjusting your search or filters",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
    }
}