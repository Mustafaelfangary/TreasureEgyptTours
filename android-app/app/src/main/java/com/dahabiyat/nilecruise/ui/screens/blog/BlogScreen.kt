package com.dahabiyat.nilecruise.ui.screens.blog

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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import androidx.compose.ui.platform.LocalContext
import com.dahabiyat.nilecruise.data.models.BlogPost
import com.dahabiyat.nilecruise.ui.components.EgyptianHeader
import com.dahabiyat.nilecruise.ui.components.ErrorScreen
import com.dahabiyat.nilecruise.ui.components.LoadingScreen
import com.dahabiyat.nilecruise.ui.theme.DahabiyatColors
import com.dahabiyat.nilecruise.utils.MediaUtils
import androidx.hilt.navigation.compose.hiltViewModel
import com.dahabiyat.nilecruise.ui.viewmodels.BlogViewModel

@Composable
fun BlogScreen(
    onBackClick: () -> Unit,
    onBlogClick: (BlogPost) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: BlogViewModel = hiltViewModel()
) {
    val ui by viewModel.uiState.collectAsState()

    when {
        ui.isLoading -> LoadingScreen(message = "Loading blog posts...")
        ui.error != null -> ErrorScreen(message = ui.error ?: "Error", onRetry = { viewModel.loadBlogs() })
        else -> {
            LazyColumn(
                modifier = modifier.fillMaxSize()
            ) {
                item {
                    EgyptianHeader(
                        title = "Our Blog",
                        subtitle = "Stories, insights, and adventures from the Nile",
                        onBackClick = onBackClick,
                        backgroundImage = null
                    )
                }
                item { Spacer(modifier = Modifier.height(24.dp)) }
                items(ui.data) { blogPost ->
                    BlogPostCard(
                        blogPost = blogPost,
                        onClick = { onBlogClick(blogPost) },
                        modifier = Modifier
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }
                item { Spacer(modifier = Modifier.height(16.dp)) }
            }
        }
    }
}

@Composable
private fun BlogPostCard(
    blogPost: BlogPost,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column {
            // Featured Image
            if (blogPost.featuredImage != null) {
                val context = LocalContext.current
                AsyncImage(
                    model = ImageRequest.Builder(context)
                        .data(MediaUtils.normalizeUrl(blogPost.featuredImage))
                        .crossfade(true)
                        .build(),
                    contentDescription = blogPost.title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)),
                    contentScale = ContentScale.Crop
                )
            }
            
            // Content
            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                // Category Badge
                Surface(
                    color = MaterialTheme.colorScheme.secondaryContainer,
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.padding(bottom = 12.dp)
                ) {
                    Text(
                        text = blogPost.category,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }
                
                // Title
                Text(
                    text = blogPost.title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                // Excerpt
                Text(
                    text = blogPost.excerpt,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = MaterialTheme.typography.bodyMedium.lineHeight * 1.2,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
                
                // Author and Date
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (blogPost.authorAvatar != null) {
                            val context = LocalContext.current
                            AsyncImage(
                                model = ImageRequest.Builder(context)
                                    .data(MediaUtils.normalizeUrl(blogPost.authorAvatar))
                                    .crossfade(true)
                                    .build(),
                                contentDescription = blogPost.author,
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(RoundedCornerShape(12.dp)),
                                contentScale = ContentScale.Crop
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = blogPost.author,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = formatDate(blogPost.publishedAt),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                // Tags
                if (blogPost.tags.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        blogPost.tags.take(3).forEach { tag ->
                            Surface(
                                color = MaterialTheme.colorScheme.surfaceVariant,
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Text(
                                    text = "#$tag",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun formatDate(dateString: String): String {
    // Simple date formatting - in real app use proper date formatting
    return try {
        val date = dateString.substring(0, 10)
        date.replace("-", "/")
    } catch (e: Exception) {
        "Recent"
    }
}
