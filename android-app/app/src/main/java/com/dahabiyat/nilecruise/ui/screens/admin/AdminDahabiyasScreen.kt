package com.dahabiyat.nilecruise.ui.screens.admin

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.dahabiyat.nilecruise.ui.viewmodels.AdminDahabiyasViewModel
import com.dahabiyat.nilecruise.data.models.Dahabiya

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDahabiyasScreen(
    onBackClick: () -> Unit,
    viewModel: AdminDahabiyasViewModel = hiltViewModel()
) {
    val ui by viewModel.ui.collectAsState()

    LaunchedEffect(Unit) { viewModel.load() }

    var name by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var capacity by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Admin: Dahabiyas") },
                navigationIcon = { IconButton(onClick = onBackClick) { Icon(Icons.Default.ArrowBack, contentDescription = "Back") } },
                actions = {
                    IconButton(onClick = {
                        val p = price.toDoubleOrNull()
                        val c = capacity.toIntOrNull()
                        if (name.isNotBlank()) {
                            viewModel.create(name.trim(), p, c)
                            name = ""; price = ""; capacity = ""
                        }
                    }) { Icon(Icons.Default.Add, contentDescription = "Create") }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
            if (ui.isLoading) {
                LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
                Spacer(Modifier.height(8.dp))
            }
            ui.error?.let { Text(it, color = MaterialTheme.colorScheme.error) }

            // Create form
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name") }, modifier = Modifier.weight(1f))
                OutlinedTextField(value = price, onValueChange = { price = it }, label = { Text("Price/Day") }, modifier = Modifier.weight(1f))
                OutlinedTextField(value = capacity, onValueChange = { capacity = it }, label = { Text("Capacity") }, modifier = Modifier.weight(1f))
            }
            Spacer(Modifier.height(12.dp))

            // List
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(ui.items) { item: Dahabiya ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Row(modifier = Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(item.name, style = MaterialTheme.typography.titleMedium)
                                Text("Capacity: ${item.capacity ?: 0}")
                                Text("Price/Day: ${item.pricePerDay ?: 0.0}")
                            }
                            IconButton(onClick = { viewModel.delete(item.id) }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete")
                            }
                        }
                    }
                }
            }
        }
    }
}
