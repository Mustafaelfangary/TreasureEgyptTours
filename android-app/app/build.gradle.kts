plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("dagger.hilt.android.plugin")
    id("kotlinx-serialization")
}

android {
    namespace = "com.dahabiyat.nilecruise"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.dahabiyat.nilecruise"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        buildConfigField("String", "BASE_URL", "\"https://www.dahabiyatnilecruise.com/api/\"")
        buildConfigField("String", "WEBSITE_URL", "\"https://www.dahabiyatnilecruise.com/\"")
        buildConfigField("String", "PRODUCTION_URL", "\"${project.findProperty("PRODUCTION_WEBSITE_URL") ?: "https://www.dahabiyatnilecruise.com"}\"")
        buildConfigField("String", "PRODUCTION_API_URL", "\"${project.findProperty("PRODUCTION_API_URL") ?: "https://www.dahabiyatnilecruise.com/api/"}\"")
        buildConfigField("boolean", "DEBUG_API_CALLS", "${project.findProperty("DEBUG_API_CALLS") ?: "true"}")
        buildConfigField("boolean", "ENABLE_IN_APP_ADMIN", "${project.findProperty("ENABLE_IN_APP_ADMIN") ?: "false"}")
        manifestPlaceholders["MAPS_API_KEY"] = project.findProperty("MAPS_API_KEY") ?: "AIzaSyDummy_Replace_With_Your_Actual_Google_Maps_Key"

    }

    sourceSets {
        getByName("main") {
            java.srcDirs("src/main/java")
        }
        getByName("debug") {
            java.srcDirs("src/debug/java")
        }
    }

    buildTypes {
        debug {
            isDebuggable = true
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    // Build separate variants for users vs admins
    flavorDimensions += listOf("mode")
    productFlavors {
        create("user") {
            dimension = "mode"
            // Regular user build: no in-app admin panel
            buildConfigField("boolean", "ENABLE_IN_APP_ADMIN", "false")
            // Keep same app id; optional suffix for debug already applied above
            // Distinct app name
            resValue("string", "app_name", "Dahabiyat Nile Cruise")
        }
        create("admin") {
            dimension = "mode"
            // Admin build: enable in-app admin panel and routes
            buildConfigField("boolean", "ENABLE_IN_APP_ADMIN", "true")
            // Distinguish install alongside user build
            applicationIdSuffix = ".admin"
            versionNameSuffix = "-admin"
            // Distinct app name for clarity
            resValue("string", "app_name", "Dahabiyat Admin")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
        resValues = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("com.google.android.material:material:1.11.0")

    implementation("androidx.navigation:navigation-compose:2.7.6")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")

    implementation("com.google.dagger:hilt-android:2.47")
    kapt("com.google.dagger:hilt-compiler:2.47")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")

    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    implementation("io.coil-kt:coil-compose:2.5.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    implementation("com.airbnb.android:lottie-compose:6.1.0")
    implementation("androidx.webkit:webkit:1.8.0")
    implementation("androidx.core:core-splashscreen:1.0.1")
    implementation("com.jakewharton.timber:timber:5.0.1")

    // Additional dependencies for complete app
    implementation("androidx.compose.material:material-icons-extended:1.5.4")
    implementation("androidx.paging:paging-compose:3.2.1")
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    implementation("com.google.accompanist:accompanist-permissions:0.32.0")
    implementation("com.google.accompanist:accompanist-systemuicontroller:0.32.0")
    implementation("com.google.accompanist:accompanist-pager:0.32.0")
    implementation("com.google.accompanist:accompanist-pager-indicators:0.32.0")
    implementation("com.google.accompanist:accompanist-swiperefresh:0.32.0")

    // Maps and Location
    implementation("com.google.maps.android:maps-compose:2.15.0")
    implementation("com.google.android.gms:play-services-maps:18.2.0")
    implementation("com.google.android.gms:play-services-location:21.0.1")

    // Biometric Authentication
    implementation("androidx.biometric:biometric:1.1.0")

    // Date/Time Picker
    implementation("io.github.vanpra.compose-material-dialogs:datetime:0.9.0")

    // Image Picker
    implementation("com.github.skydoves:landscapist-coil:2.2.10")

    // WebView
    implementation("com.google.accompanist:accompanist-webview:0.32.0")

    // JSON parsing
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")

    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2023.10.01"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}