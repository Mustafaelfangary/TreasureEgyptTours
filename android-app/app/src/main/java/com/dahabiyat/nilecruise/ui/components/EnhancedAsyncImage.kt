package com.dahabiyat.nilecruise.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.compose.AsyncImagePainter
import coil.request.ImageRequest
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.utils.MediaUtils

/**
 * Enhanced AsyncImage component with improved error handling, loading states, and fallbacks
 */
@Composable
fun EnhancedAsyncImage(
    imageUrl: String?,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    shape: Shape = RoundedCornerShape(8.dp),
    contentScale: ContentScale = ContentScale.Crop,
    showLoadingIndicator: Boolean = true,
    fallbackImages: List<String> = emptyList()
) {
    val context = LocalContext.current
    var currentImageIndex by remember { mutableStateOf(0) }
    
    // Prepare list of image URLs to try (main + fallbacks + default)
    val imagesToTry = buildList {
        // Add the primary image if it's valid
        MediaUtils.getImageUrl(imageUrl).takeIf { it.isNotBlank() }?.let { add(it) }
        // Add fallback images
        addAll(fallbackImages.map { MediaUtils.getImageUrl(it) }.filter { it.isNotBlank() })
        // Add default thumbnail as last resort
        add(MediaUtils.getThumbnailUrl(null))
    }
    
    val currentImageUrl = if (currentImageIndex < imagesToTry.size) {
        imagesToTry[currentImageIndex]
    } else {
        MediaUtils.getThumbnailUrl(null)
    }
    
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        AsyncImage(
            model = ImageRequest.Builder(context)
                .data(currentImageUrl)
                .crossfade(true)
                .placeholder(R.drawable.splash_logo)
                .error(R.drawable.splash_logo)
                .fallback(R.drawable.splash_logo)
                .build(),
            contentDescription = contentDescription,
            modifier = Modifier
                .fillMaxSize()
                .clip(shape),
            contentScale = contentScale,
            onState = { state ->
                when (state) {
                    is AsyncImagePainter.State.Error -> {
                        // Try next image in the list if current one fails
                        if (currentImageIndex < imagesToTry.size - 1) {
                            currentImageIndex++
                        }
                    }
                    is AsyncImagePainter.State.Success -> {
                        // Image loaded successfully, reset index for future loads
                    }
                    else -> { /* Handle other states if needed */ }
                }
            }
        )
        
        // Show loading indicator if enabled and image is loading
        if (showLoadingIndicator) {
            var isLoading by remember { mutableStateOf(true) }
            
            LaunchedEffect(currentImageUrl) {
                isLoading = true
            }
            
            AsyncImage(
                model = ImageRequest.Builder(context)
                    .data(currentImageUrl)
                    .build(),
                contentDescription = null,
                modifier = Modifier.size(0.dp), // Hidden image just for state tracking
                onState = { state ->
                    when (state) {
                        is AsyncImagePainter.State.Loading -> isLoading = true
                        is AsyncImagePainter.State.Success -> isLoading = false
                        is AsyncImagePainter.State.Error -> isLoading = false
                        else -> {}
                    }
                }
            )
            
            if (isLoading) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color.Black.copy(alpha = 0.3f),
                    shape = shape
                ) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        CircularProgressIndicator(
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }
            }
        }
    }
}

/**
 * Enhanced AsyncImage for card layouts with standardized styling
 */
@Composable
fun CardAsyncImage(
    imageUrl: String?,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    cornerRadius: androidx.compose.ui.unit.Dp = 12.dp
) {
    EnhancedAsyncImage(
        imageUrl = imageUrl,
        contentDescription = contentDescription,
        modifier = modifier,
        shape = RoundedCornerShape(cornerRadius),
        contentScale = ContentScale.Crop,
        showLoadingIndicator = true,
        fallbackImages = listOf(
            "/images/default-dahabiya.jpg",
            "/assets/images/placeholder.png"
        )
    )
}

/**
 * Enhanced AsyncImage for gallery layouts
 */
@Composable
fun GalleryAsyncImage(
    imageUrl: String?,
    contentDescription: String?,
    modifier: Modifier = Modifier
) {
    EnhancedAsyncImage(
        imageUrl = imageUrl,
        contentDescription = contentDescription,
        modifier = modifier,
        shape = RoundedCornerShape(8.dp),
        contentScale = ContentScale.Crop,
        showLoadingIndicator = true
    )
}