package com.dahabiyat.nilecruise.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.data.models.User
import com.dahabiyat.nilecruise.ui.theme.*

@Composable
fun ProfileScreen(
    user: User?,
    onEditProfileClick: () -> Unit,
    onBookingsClick: () -> Unit,
    onFavoritesClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onHelpClick: () -> Unit,
    onLogoutClick: () -> Unit,
    onLoginClick: () -> Unit
) {
    LazyColumn(
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
            ),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            if (user != null) {
                // User profile header
                ProfileHeader(
                    user = user,
                    onEditClick = onEditProfileClick
                )
            } else {
                // Guest user header
                GuestHeader(onLoginClick = onLoginClick)
            }
        }
        
        if (user != null) {
            item {
                // User stats
                UserStatsCard(user = user)
            }
            
            item {
                // Profile menu items
                ProfileMenuSection(
                    onBookingsClick = onBookingsClick,
                    onFavoritesClick = onFavoritesClick,
                    onSettingsClick = onSettingsClick,
                    onHelpClick = onHelpClick,
                    onLogoutClick = onLogoutClick
                )
            }
        } else {
            item {
                // Guest menu items
                GuestMenuSection(
                    onSettingsClick = onSettingsClick,
                    onHelpClick = onHelpClick
                )
            }
        }
    }
}

@Composable
private fun ProfileHeader(
    user: User,
    onEditClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Profile image
            AsyncImage(
                model = user.profileImage ?: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                contentDescription = "Profile Image",
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape)
                    .background(RoyalBlue.copy(alpha = 0.1f)),
                contentScale = ContentScale.Crop
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // User name
            Text(
                text = "${user.firstName} ${user.lastName}",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = RoyalBlue
            )
            
            // Email
            Text(
                text = user.email,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
            
            // Member since
            if (user.stats.memberSince != null) {
                Text(
                    text = "Member since ${user.stats.memberSince}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Edit profile button
            OutlinedButton(
                onClick = onEditClick,
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = RoyalBlue
                ),
                border = ButtonDefaults.outlinedButtonBorder.copy(
                    brush = Brush.horizontalGradient(listOf(RoyalBlue, RoyalBlue))
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(stringResource(R.string.profile_edit))
            }
        }
    }
}

@Composable
private fun GuestHeader(
    onLoginClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                modifier = Modifier
                    .size(80.dp)
                    .background(
                        RoyalBlue.copy(alpha = 0.1f),
                        CircleShape
                    )
                    .padding(20.dp),
                tint = RoyalBlue
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Welcome, Guest",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = RoyalBlue
            )
            
            Text(
                text = "Sign in to access your bookings and preferences",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = onLoginClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = RoyalBlue
                )
            ) {
                Text(stringResource(R.string.auth_sign_in))
            }
        }
    }
}

@Composable
private fun UserStatsCard(user: User) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = stringResource(R.string.profile_stats),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = RoyalBlue
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatItem(
                    title = stringResource(R.string.profile_total_bookings),
                    value = user.stats.totalBookings.toString(),
                    icon = Icons.Default.BookOnline
                )
                
                StatItem(
                    title = stringResource(R.string.profile_total_spent),
                    value = "$${String.format("%.0f", user.stats.totalSpent)}",
                    icon = Icons.Default.AttachMoney
                )
                
                StatItem(
                    title = stringResource(R.string.profile_reward_points),
                    value = user.stats.loyaltyPoints.toString(),
                    icon = Icons.Default.Stars
                )
            }
        }
    }
}

@Composable
private fun StatItem(
    title: String,
    value: String,
    icon: ImageVector
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = EgyptianGold,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = RoyalBlue
        )
        Text(
            text = title,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
    }
}

@Composable
private fun ProfileMenuSection(
    onBookingsClick: () -> Unit,
    onFavoritesClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onHelpClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(8.dp)
        ) {
            ProfileMenuItem(
                icon = Icons.Default.BookOnline,
                title = stringResource(R.string.profile_my_bookings),
                onClick = onBookingsClick
            )
            
            ProfileMenuItem(
                icon = Icons.Default.Favorite,
                title = "Favorites",
                onClick = onFavoritesClick
            )
            
            ProfileMenuItem(
                icon = Icons.Default.Settings,
                title = stringResource(R.string.nav_settings),
                onClick = onSettingsClick
            )
            
            ProfileMenuItem(
                icon = Icons.Default.Help,
                title = "Help & Support",
                onClick = onHelpClick
            )
            
            Divider(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
            )
            
            ProfileMenuItem(
                icon = Icons.Default.Logout,
                title = stringResource(R.string.auth_sign_out),
                onClick = onLogoutClick,
                textColor = MaterialTheme.colorScheme.error
            )
        }
    }
}

@Composable
private fun GuestMenuSection(
    onSettingsClick: () -> Unit,
    onHelpClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(8.dp)
        ) {
            ProfileMenuItem(
                icon = Icons.Default.Settings,
                title = stringResource(R.string.nav_settings),
                onClick = onSettingsClick
            )
            
            ProfileMenuItem(
                icon = Icons.Default.Help,
                title = "Help & Support",
                onClick = onHelpClick
            )
        }
    }
}

@Composable
private fun ProfileMenuItem(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit,
    textColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = if (textColor == MaterialTheme.colorScheme.error) textColor else RoyalBlue,
            modifier = Modifier.size(24.dp)
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Text(
            text = title,
            style = MaterialTheme.typography.bodyLarge,
            color = textColor,
            modifier = Modifier.weight(1f)
        )
        
        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f),
            modifier = Modifier.size(20.dp)
        )
    }
}