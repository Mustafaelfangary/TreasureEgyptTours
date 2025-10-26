package com.dahabiyat.nilecruise.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.ui.components.DahabiyaCard
import com.dahabiyat.nilecruise.ui.components.PackageCard
import com.dahabiyat.nilecruise.ui.components.LoadingScreen
import com.dahabiyat.nilecruise.ui.theme.*
import com.dahabiyat.nilecruise.ui.viewmodels.HomeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onDahabiyaClick: (Dahabiya) -> Unit,
    onPackageClick: (Package) -> Unit,
    onItineraryClick: (Itinerary) -> Unit,
    onViewAllDahabiyasClick: () -> Unit,
    onViewAllPackagesClick: () -> Unit,
    onViewAllItinerariesClick: () -> Unit,
    onSearchClick: () -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadHomeData()
    }

    if (uiState.isLoading) {
        LoadingScreen(message = stringResource(R.string.status_loading))
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Hero Section
            item {
                HeroSection(onSearchClick = onSearchClick)
            }

            // Featured Dahabiyas
            if (uiState.featuredDahabiyas.isNotEmpty()) {
                item {
                    SectionHeader(
                        title = stringResource(R.string.home_featured_dahabiyas),
                        onViewAllClick = onViewAllDahabiyasClick
                    )
                }
                item {
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp)
                    ) {
                        items(uiState.featuredDahabiyas) { dahabiya ->
                            DahabiyaCard(
                                dahabiya = dahabiya,
                                onClick = { onDahabiyaClick(dahabiya) },
                                modifier = Modifier.width(280.dp)
                            )
                        }
                    }
                }
            }

            // Popular Packages
            if (uiState.popularPackages.isNotEmpty()) {
                item {
                    SectionHeader(
                        title = stringResource(R.string.home_popular_packages),
                        onViewAllClick = onViewAllPackagesClick
                    )
                }
                item {
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp)
                    ) {
                        items(uiState.popularPackages) { packageItem ->
                            PackageCard(
                                packageItem = packageItem,
                                onClick = { onPackageClick(packageItem) },
                                modifier = Modifier.width(280.dp)
                            )
                        }
                    }
                }
            }

            // Why Choose Us Section
            item {
                WhyChooseUsSection()
            }

            // Bottom spacing
            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun HeroSection(onSearchClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        RoyalBlue,
                        RoyalBlueDark
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = stringResource(R.string.home_hero_title),
                style = MaterialTheme.typography.headlineLarge,
                color = MaterialTheme.colorScheme.onPrimary,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = stringResource(R.string.home_hero_subtitle),
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.9f)
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Button(
                onClick = onSearchClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = EgyptianGold,
                    contentColor = MaterialTheme.colorScheme.onSecondary
                ),
                modifier = Modifier.height(48.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = stringResource(R.string.action_search),
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
private fun SectionHeader(
    title: String,
    onViewAllClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = RoyalBlue
        )
        
        TextButton(onClick = onViewAllClick) {
            Text(
                text = stringResource(R.string.home_explore_all),
                color = RoyalBlue
            )
        }
    }
}

@Composable
private fun WhyChooseUsSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = stringResource(R.string.about_why_choose_us),
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = RoyalBlue,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        val features = listOf(
            "Authentic Egyptian Experience" to "Traditional dahabiyas with modern luxury",
            "Expert Local Guides" to "Knowledgeable guides sharing ancient secrets",
            "Personalized Service" to "Small groups for intimate experiences",
            "Premium Amenities" to "Luxury accommodations and fine dining"
        )
        
        features.forEach { (title, description) ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Medium,
                        color = RoyalBlue
                    )
                    Text(
                        text = description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        }
    }
}