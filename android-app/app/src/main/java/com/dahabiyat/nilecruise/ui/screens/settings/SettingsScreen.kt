package com.dahabiyat.nilecruise.ui.screens.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.dahabiyat.nilecruise.data.models.UserPreferences
import com.dahabiyat.nilecruise.ui.viewmodels.SettingsViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBackClick: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val userPreferences by viewModel.userPreferences.collectAsState()
    val isSaving by viewModel.isSaving.collectAsState()
    val saveSuccess by viewModel.saveSuccess.collectAsState()
    val scope = rememberCoroutineScope()
    
    val snackbarHostState = remember { SnackbarHostState() }
    
    LaunchedEffect(saveSuccess) {
        saveSuccess?.let { success ->
            val message = if (success) "Settings saved successfully" else "Failed to save settings"
            snackbarHostState.showSnackbar(message)
            viewModel.resetSaveStatus()
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (isSaving) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(24.dp),
                            color = MaterialTheme.colorScheme.primary,
                            strokeWidth = 2.dp
                        )
                    } else {
                        IconButton(onClick = { viewModel.savePreferences() }) {
                            Icon(Icons.Default.Save, contentDescription = "Save")
                        }
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // App Preferences Section
                PreferenceSection(title = "App Preferences") {
                    // Language Preference
                    DropdownPreference(
                        title = "Language",
                        icon = Icons.Default.Language,
                        selectedValue = userPreferences.language,
                        options = listOf("en" to "English", "ar" to "Arabic", "fr" to "French"),
                        onOptionSelected = { viewModel.updateLanguage(it) }
                    )
                    
                    // Currency Preference
                    DropdownPreference(
                        title = "Currency",
                        icon = Icons.Default.AttachMoney,
                        selectedValue = userPreferences.currency,
                        options = listOf("USD" to "US Dollar", "EUR" to "Euro", "EGP" to "Egyptian Pound"),
                        onOptionSelected = { viewModel.updateCurrency(it) }
                    )
                    
                    // Theme and biometric preferences have been removed from UserPreferences model.
                }
            }
            
            item {
                // Notification Preferences Section
                PreferenceSection(title = "Notification Preferences") {
                    // Push Notifications
                    SwitchPreference(
                        title = "Push Notifications",
                        description = "Receive notifications on your device",
                        icon = Icons.Default.Notifications,
                        checked = userPreferences.notifications.pushNotifications,
                        onCheckedChange = { viewModel.updatePushNotifications(it) }
                    )
                    
                    // Email Notifications
                    SwitchPreference(
                        title = "Email Notifications",
                        description = "Receive notifications via email",
                        icon = Icons.Default.Email,
                        checked = userPreferences.notifications.emailNotifications,
                        onCheckedChange = { viewModel.updateEmailNotifications(it) }
                    )
                    
                    // SMS Notifications
                    SwitchPreference(
                        title = "SMS Notifications",
                        description = "Receive notifications via SMS",
                        icon = Icons.Default.Sms,
                        checked = userPreferences.notifications.smsNotifications,
                        onCheckedChange = { viewModel.updateSmsNotifications(it) }
                    )
                }
            }
            
            item {
                // Content Preferences Section
                PreferenceSection(title = "Content Preferences") {
                    // Booking Updates
                    SwitchPreference(
                        title = "Booking Updates",
                        description = "Receive updates about your bookings",
                        icon = Icons.Default.BookOnline,
                        checked = userPreferences.notifications.bookingUpdates,
                        onCheckedChange = { viewModel.updateBookingUpdates(it) }
                    )
                    
                    // Special Offers
                    SwitchPreference(
                        title = "Special Offers",
                        description = "Receive special offers",
                        icon = Icons.Default.LocalOffer,
                        checked = userPreferences.notifications.specialOffers,
                        onCheckedChange = { viewModel.updateSpecialOffers(it) }
                    )
                    
                    // Marketing Emails
                    SwitchPreference(
                        title = "Marketing Emails",
                        description = "Receive marketing emails about our services",
                        icon = Icons.Default.MarkEmailRead,
                        checked = userPreferences.notifications.marketingEmails,
                        onCheckedChange = { viewModel.updateMarketingEmails(it) }
                    )
                }
            }
            
            item {
                Spacer(modifier = Modifier.height(32.dp))
                Button(
                    onClick = { viewModel.savePreferences() },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !isSaving
                ) {
                    if (isSaving) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(24.dp),
                            color = MaterialTheme.colorScheme.onPrimary,
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    Text("Save Settings")
                }
            }
        }
    }
}

@Composable
fun PreferenceSection(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                content = content
            )
        }
    }
}

@Composable
fun SwitchPreference(
    title: String,
    description: String,
    icon: ImageVector,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(24.dp)
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium
            )
            
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}

@Composable
fun DropdownPreference(
    title: String,
    icon: ImageVector,
    selectedValue: String,
    options: List<Pair<String, String>>,
    onOptionSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedLabel = options.find { it.first == selectedValue }?.second ?: options.firstOrNull()?.second ?: ""
    
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(24.dp)
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium
            )
            
            Text(
                text = selectedLabel,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        Box {
            IconButton(onClick = { expanded = true }) {
                Icon(Icons.Default.ArrowDropDown, contentDescription = "Select")
            }
            
            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false }
            ) {
                options.forEach { (value, label) ->
                    DropdownMenuItem(
                        text = { Text(label) },
                        onClick = {
                            onOptionSelected(value)
                            expanded = false
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun RadioPreference(
    title: String,
    description: String,
    icon: ImageVector,
    options: List<Pair<String, String>>,
    selectedValue: String,
    onOptionSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
                
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Column(
            modifier = Modifier.selectableGroup()
        ) {
            options.forEach { (value, label) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .selectable(
                            selected = value == selectedValue,
                            onClick = { onOptionSelected(value) },
                            role = Role.RadioButton
                        )
                        .padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = value == selectedValue,
                        onClick = null
                    )
                    
                    Spacer(modifier = Modifier.width(16.dp))
                    
                    Text(
                        text = label,
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            }
        }
    }
}