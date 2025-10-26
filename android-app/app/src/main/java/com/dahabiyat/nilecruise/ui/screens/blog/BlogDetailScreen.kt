package com.dahabiyat.nilecruise.ui.screens.blog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import coil.request.ImageRequest
import androidx.compose.ui.platform.LocalContext
import com.dahabiyat.nilecruise.ui.viewmodels.BlogDetailViewModel
import com.dahabiyat.nilecruise.utils.MediaUtils
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BlogDetailScreen(
    blogId: String,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: BlogDetailViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(blogId) {
        if (blogId.isNotBlank()) viewModel.load(blogId)
    }

    Scaffold(
        topBar = {
            SmallTopAppBar(
                title = { Text("Blog") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        when {
            state.isLoading -> {
                Box(
                    modifier = modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            state.error != null -> {
                Box(
                    modifier = modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = state.error ?: "Error", color = MaterialTheme.colorScheme.error)
                        Spacer(Modifier.height(12.dp))
                        OutlinedButton(onClick = { viewModel.load(blogId) }) { Text("Retry") }
                    }
                }
            }
            state.data != null -> {
                val post = state.data
                Column(
                    modifier = modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(padding)
                ) {
                    // Hero image if available
                    val context = LocalContext.current
                    val imageUrl = post?.featuredImage
                    if (!imageUrl.isNullOrBlank()) {
                        val normalizedUrl = MediaUtils.getImageUrl(imageUrl)
                        AsyncImage(
                            model = ImageRequest.Builder(context)
                                .data(if (normalizedUrl.isNotBlank()) normalizedUrl else MediaUtils.getThumbnailUrl(null))
                                .crossfade(true)
                                .placeholder(com.dahabiyat.nilecruise.R.drawable.splash_logo)
                                .error(com.dahabiyat.nilecruise.R.drawable.splash_logo)
                                .fallback(com.dahabiyat.nilecruise.R.drawable.splash_logo)
                                .build(),
                            contentDescription = post?.title,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(220.dp),
                            contentScale = ContentScale.Crop
                        )
                    }

                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = post?.title ?: "Untitled",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )

                    if (!post?.author.isNullOrBlank() || !post?.publishedAt.isNullOrBlank()) {
                        Spacer(Modifier.height(8.dp))
                        Text(
                            text = listOfNotNull(post?.author, post?.publishedAt).joinToString(" • "),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                    }

                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = post?.content ?: post?.excerpt ?: "",
                        style = MaterialTheme.typography.bodyLarge,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                    )

                    Spacer(Modifier.height(24.dp))
                }
            }
        }
    }
}
