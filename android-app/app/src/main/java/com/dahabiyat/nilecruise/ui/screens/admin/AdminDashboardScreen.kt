package com.dahabiyat.nilecruise.ui.screens.admin

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(
    onBackClick: () -> Unit,
    onOpenDahabiyas: () -> Unit,
    onOpenPackages: () -> Unit,
    onOpenBlogs: () -> Unit,
    onOpenItineraries: () -> Unit,
    onOpenRates: () -> Unit,
    onOpenAbout: () -> Unit,
    onOpenGalleryUpload: () -> Unit,
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Admin Dashboard") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) { Icon(Icons.Default.ArrowBack, contentDescription = "Back") }
                }
            )
        }
    ) { padding ->
        Content(padding,
            onOpenDahabiyas,
            onOpenPackages,
            onOpenBlogs,
            onOpenItineraries,
            onOpenRates,
            onOpenAbout,
            onOpenGalleryUpload)
    }
}

@Composable
private fun Content(
    paddingValues: PaddingValues,
    onOpenDahabiyas: () -> Unit,
    onOpenPackages: () -> Unit,
    onOpenBlogs: () -> Unit,
    onOpenItineraries: () -> Unit,
    onOpenRates: () -> Unit,
    onOpenAbout: () -> Unit,
    onOpenGalleryUpload: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddingValues)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Button(modifier = Modifier.fillMaxWidth(), onClick = onOpenDahabiyas) { Text("Dahabiyas") }
        Spacer(Modifier.height(8.dp))
        Button(modifier = Modifier.fillMaxWidth(), onClick = onOpenPackages) { Text("Packages") }
        Spacer(Modifier.height(8.dp))
        Button(modifier = Modifier.fillMaxWidth(), onClick = onOpenBlogs) { Text("Blogs") }
        Spacer(Modifier.height(8.dp))
        Button(modifier = Modifier.fillMaxWidth(), onClick = onOpenItineraries) { Text("Itineraries") }
        Spacer(Modifier.height(8.dp))
        Button(modifier = Modifier.fillMaxWidth(), onClick = onOpenRates) { Text("Schedule & Rates") }
        Spacer(Modifier.height(8.dp))
        Button(modifier = Modifier.fillMaxWidth(), onClick = onOpenAbout) { Text("About") }
        Spacer(Modifier.height(8.dp))
        Button(modifier = Modifier.fillMaxWidth(), onClick = onOpenGalleryUpload) { Text("Gallery Upload") }
    }
}
