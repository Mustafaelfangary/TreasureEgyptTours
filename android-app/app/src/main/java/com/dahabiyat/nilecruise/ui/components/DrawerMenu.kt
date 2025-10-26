package com.dahabiyat.nilecruise.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.ui.theme.*

data class DrawerMenuItem(
    val title: String,
    val icon: ImageVector,
    val route: String,
    val badge: String? = null
)

@Composable
fun DrawerMenu(
    navController: NavController,
    onCloseDrawer: () -> Unit
) {
    val menuItems = listOf(
        DrawerMenuItem("Home", Icons.Default.Home, "home"),
        DrawerMenuItem("Dahabiyas", Icons.Default.DirectionsBoat, "dahabiyas"),
        DrawerMenuItem("Packages", Icons.Default.CardGiftcard, "packages"),
        DrawerMenuItem("Itineraries", Icons.Default.Map, "itineraries"),
        DrawerMenuItem("Gallery", Icons.Default.PhotoLibrary, "gallery"),
        DrawerMenuItem("Blog", Icons.Default.Article, "blog"),
        DrawerMenuItem("Schedule & Rates", Icons.Default.Schedule, "schedule"),
        DrawerMenuItem("Contact", Icons.Default.ContactPhone, "contact"),
        DrawerMenuItem("About", Icons.Default.Info, "about"),
        DrawerMenuItem("Settings", Icons.Default.Settings, "settings")
    )

    Column(
        modifier = Modifier
            .fillMaxHeight()
            .width(300.dp)
            .background(MaterialTheme.colorScheme.surface)
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
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
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // App logo
                Image(
                    painter = painterResource(id = R.mipmap.ic_launcher_adaptive_fore),
                    contentDescription = "App Logo",
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.2f)),
                    contentScale = ContentScale.Fit
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = stringResource(R.string.app_name),
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimary
                )
                
                Text(
                    text = stringResource(R.string.app_tagline),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f)
                )
            }
        }
        
        // Menu items
        LazyColumn(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(vertical = 8.dp)
        ) {
            items(menuItems) { item ->
                DrawerMenuItemRow(
                    item = item,
                    onClick = {
                        navController.navigate(item.route) {
                            // Close drawer and navigate
                            launchSingleTop = true
                        }
                        onCloseDrawer()
                    }
                )
            }
        }
        
        // Footer
        Divider(
            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
            thickness = 1.dp
        )
        
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Version 1.0.0",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
            
            Text(
                text = "© 2024 Dahabiyat Nile Cruise",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
        }
    }
}

@Composable
private fun DrawerMenuItemRow(
    item: DrawerMenuItem,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = item.icon,
            contentDescription = item.title,
            tint = RoyalBlue,
            modifier = Modifier.size(24.dp)
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Text(
            text = item.title,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.weight(1f)
        )
        
        // Badge if available
        item.badge?.let { badge ->
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = EgyptianGold
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    text = badge,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSecondary,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}