package com.dahabiyat.nilecruise.ui.screens.admin

import android.content.Context
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.ImageLoader
import coil.request.ImageRequest
import coil.request.SuccessResult
import com.dahabiyat.nilecruise.ui.viewmodels.AdminGalleryViewModel
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminGalleryUploadScreen(
    onBackClick: () -> Unit,
    viewModel: AdminGalleryViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var pickedUri by remember { mutableStateOf<Uri?>(null) }
    var title by remember { mutableStateOf("") }
    var caption by remember { mutableStateOf("") }
    val uploading by viewModel.isUploading.collectAsState()
    val message by viewModel.message.collectAsState()

    val pickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent(),
        onResult = { uri -> pickedUri = uri }
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Gallery Upload") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) { Icon(Icons.Default.ArrowBack, contentDescription = "Back") }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.Top,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (message != null) {
                Text(text = message!!, color = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.height(8.dp))
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Title (optional)") },
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = caption,
                    onValueChange = { caption = it },
                    label = { Text("Caption (optional)") },
                    modifier = Modifier.weight(1f)
                )
            }
            Spacer(Modifier.height(12.dp))
            Button(onClick = { pickerLauncher.launch("image/*") }) { Text("Pick Image") }
            Spacer(Modifier.height(12.dp))
            pickedUri?.let { uri ->
                // Show a small preview using Coil to get a bitmap
                val bitmap = remember(uri) { mutableStateOf<android.graphics.Bitmap?>(null) }
                LaunchedEffect(uri) {
                    val loader = ImageLoader(context)
                    val request = ImageRequest.Builder(context)
                        .data(uri)
                        .allowHardware(false)
                        .build()
                    val result = loader.execute(request)
                    if (result is SuccessResult) {
                        bitmap.value = (result.drawable as android.graphics.drawable.BitmapDrawable).bitmap
                    }
                }
                bitmap.value?.let { bmp ->
                    Image(bitmap = bmp.asImageBitmap(), contentDescription = null, modifier = Modifier.size(180.dp))
                }
            }
            Spacer(Modifier.height(16.dp))
            Button(
                onClick = {
                    val uri = pickedUri ?: return@Button
                    scope.launch {
                        val file = uriToTempFile(context, uri)
                        viewModel.upload(file, title.ifBlank { null }, caption.ifBlank { null })
                    }
                },
                enabled = pickedUri != null && !uploading,
                modifier = Modifier.fillMaxWidth()
            ) { Text(if (uploading) "Uploading..." else "Upload") }
        }
    }
}

private fun uriToTempFile(context: Context, uri: Uri): File {
    val input = context.contentResolver.openInputStream(uri) ?: error("Cannot open selected image")
    val tempFile = File.createTempFile("upload_", ".jpg", context.cacheDir)
    FileOutputStream(tempFile).use { out ->
        input.copyTo(out)
    }
    input.close()
    return tempFile
}
