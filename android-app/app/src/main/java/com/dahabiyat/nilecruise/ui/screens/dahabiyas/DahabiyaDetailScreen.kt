package com.dahabiyat.nilecruise.ui.screens.dahabiyas

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import androidx.compose.ui.platform.LocalContext
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.utils.MediaUtils
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DahabiyaDetailScreen(
    dahabiya: Dahabiya,
    onBackClick: () -> Unit,
    onBookNowClick: () -> Unit,
    onShareClick: () -> Unit,
    onFavoriteClick: () -> Unit
) {
    var isFavorite by remember { mutableStateOf(false) }

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
            title = { Text(dahabiya.name, fontWeight = FontWeight.Bold) },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
            },
            actions = {
                IconButton(onClick = onShareClick) {
                    Icon(Icons.Default.Share, contentDescription = "Share")
                }
                IconButton(onClick = { 
                    isFavorite = !isFavorite
                    onFavoriteClick() 
                }) {
                    Icon(
                        imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (isFavorite) androidx.compose.ui.graphics.Color.Red else MaterialTheme.colorScheme.onSurface
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface,
                titleContentColor = RoyalBlue
            )
        )

        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Image gallery
            item {
                ImageGallery(images = dahabiya.gallery.ifEmpty { listOf(dahabiya.mainImage ?: "") })
            }

            // Basic info card
            item {
                BasicInfoCard(dahabiya = dahabiya)
            }

            // Description
            item {
                DescriptionCard(description = dahabiya.description)
            }

            // Features
            if (dahabiya.features.isNotEmpty()) {
                item {
                    FeaturesCard(features = dahabiya.features)
                }
            }

            // Amenities
            if (dahabiya.amenities.isNotEmpty()) {
                item {
                    AmenitiesCard(amenities = dahabiya.amenities)
                }
            }

            // Activities
            if (dahabiya.activities.isNotEmpty()) {
                item {
                    ActivitiesCard(activities = dahabiya.activities)
                }
            }

            // Dining options
            if (dahabiya.diningOptions.isNotEmpty()) {
                item {
                    DiningCard(diningOptions = dahabiya.diningOptions)
                }
            }

            // Routes
            if (dahabiya.routes.isNotEmpty()) {
                item {
                    RoutesCard(routes = dahabiya.routes)
                }
            }

            // Reviews section
            item {
                ReviewsCard(rating = dahabiya.rating, reviewCount = dahabiya.reviewCount)
            }

            // Book now button
            item {
                Button(
                    onClick = onBookNowClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = EgyptianGold,
                        contentColor = MaterialTheme.colorScheme.onSecondary
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.BookOnline,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = stringResource(R.string.dahabiya_book_now),
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun ImageGallery(images: List<String>) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(images.filter { it.isNotBlank() }) { imageUrl ->
                val context = LocalContext.current
                val normalizedUrl = MediaUtils.getImageUrl(imageUrl)
                AsyncImage(
                    model = ImageRequest.Builder(context)
                        .data(if (normalizedUrl.isNotBlank()) normalizedUrl else MediaUtils.getThumbnailUrl(null))
                        .crossfade(true)
                        .placeholder(R.drawable.splash_logo)
                        .error(R.drawable.splash_logo)
                        .fallback(R.drawable.splash_logo)
                        .build(),
                    contentDescription = null,
                    modifier = Modifier
                        .size(200.dp, 150.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                )
            }
        }
    }
}

@Composable
private fun BasicInfoCard(dahabiya: Dahabiya) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = dahabiya.name,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = RoyalBlue
                    )
                    Text(
                        text = dahabiya.category.name.lowercase().replaceFirstChar { it.uppercase() },
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
                
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "$${String.format("%.0f", dahabiya.pricePerDay)}",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = EgyptianGold
                    )
                    Text(
                        text = stringResource(R.string.dahabiya_price_per_night),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
            }

            Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))

            // Specifications
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                SpecItem(
                    icon = Icons.Default.Person,
                    label = stringResource(R.string.dahabiya_capacity),
                    value = "${dahabiya.capacity} guests"
                )
                
                if (dahabiya.cabins != null) {
                    SpecItem(
                        icon = Icons.Default.Hotel,
                        label = stringResource(R.string.dahabiya_cabins),
                        value = "${dahabiya.cabins} cabins"
                    )
                }
                
                if (dahabiya.crew != null) {
                    SpecItem(
                        icon = Icons.Default.Groups,
                        label = stringResource(R.string.dahabiya_crew),
                        value = "${dahabiya.crew} crew"
                    )
                }
            }

            if (dahabiya.length != null && dahabiya.width != null) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    SpecItem(
                        icon = Icons.Default.Straighten,
                        label = "Length",
                        value = "${dahabiya.length}m"
                    )
                    
                    SpecItem(
                        icon = Icons.Default.Straighten,
                        label = "Width",
                        value = "${dahabiya.width}m"
                    )
                    
                    if (dahabiya.yearBuilt != null) {
                        SpecItem(
                            icon = Icons.Default.CalendarToday,
                            label = "Built",
                            value = "${dahabiya.yearBuilt}"
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun SpecItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = RoyalBlue,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = RoyalBlue
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
    }
}

@Composable
private fun DescriptionCard(description: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = "About This Dahabiya",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = RoyalBlue
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface,
                lineHeight = MaterialTheme.typography.bodyLarge.lineHeight
            )
        }
    }
}

@Composable
private fun FeaturesCard(features: List<String>) {
    InfoCard(
        title = stringResource(R.string.dahabiya_features),
        items = features,
        icon = Icons.Default.Star
    )
}

@Composable
private fun AmenitiesCard(amenities: List<String>) {
    InfoCard(
        title = stringResource(R.string.dahabiya_amenities),
        items = amenities,
        icon = Icons.Default.Wifi
    )
}

@Composable
private fun ActivitiesCard(activities: List<String>) {
    InfoCard(
        title = "Activities",
        items = activities,
        icon = Icons.Default.LocalActivity
    )
}

@Composable
private fun DiningCard(diningOptions: List<String>) {
    InfoCard(
        title = "Dining Options",
        items = diningOptions,
        icon = Icons.Default.Restaurant
    )
}

@Composable
private fun RoutesCard(routes: List<String>) {
    InfoCard(
        title = "Available Routes",
        items = routes,
        icon = Icons.Default.Route
    )
}

@Composable
private fun InfoCard(
    title: String,
    items: List<String>,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = RoyalBlue,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = RoyalBlue
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            items.forEach { item ->
                Row(
                    modifier = Modifier.padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = null,
                        tint = EgyptianGold,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = item,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
    }
}

@Composable
private fun ReviewsCard(rating: Double, reviewCount: Int) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = EgyptianGold,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Reviews & Ratings",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = RoyalBlue
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = String.format("%.1f", rating),
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = EgyptianGold
                )
                Spacer(modifier = Modifier.width(8.dp))
                
                repeat(5) { index ->
                    Icon(
                        imageVector = if (index < rating.toInt()) Icons.Default.Star else Icons.Default.StarBorder,
                        contentDescription = null,
                        tint = EgyptianGold,
                        modifier = Modifier.size(20.dp)
                    )
                }
                
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "($reviewCount reviews)",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }
        }
    }
}