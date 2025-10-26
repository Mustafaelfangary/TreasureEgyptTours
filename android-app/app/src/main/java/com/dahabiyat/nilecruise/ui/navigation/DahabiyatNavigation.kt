@file:OptIn(ExperimentalMaterial3Api::class)
package com.dahabiyat.nilecruise.ui.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.Image
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.hilt.navigation.compose.hiltViewModel
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.data.models.controlpanel.ControlPanelConfig
import com.dahabiyat.nilecruise.R
import com.dahabiyat.nilecruise.BuildConfig
import com.dahabiyat.nilecruise.ui.components.BottomNavigationBar
import com.dahabiyat.nilecruise.ui.components.DrawerMenu
import com.dahabiyat.nilecruise.ui.components.LoadingScreen
import kotlinx.coroutines.launch
import com.dahabiyat.nilecruise.ui.screens.home.HomeScreen
import com.dahabiyat.nilecruise.ui.screens.dahabiyas.DahabiyaListScreen
import com.dahabiyat.nilecruise.ui.screens.dahabiyas.DahabiyaDetailScreen
import com.dahabiyat.nilecruise.ui.screens.packages.PackageListScreen
import com.dahabiyat.nilecruise.ui.screens.packages.PackageDetailScreen
import com.dahabiyat.nilecruise.ui.screens.gallery.GalleryScreen
import com.dahabiyat.nilecruise.ui.screens.profile.ProfileScreen
import com.dahabiyat.nilecruise.ui.screens.auth.LoginScreen
import com.dahabiyat.nilecruise.ui.screens.auth.RegisterScreen
import com.dahabiyat.nilecruise.ui.screens.auth.OnboardingScreen
import com.dahabiyat.nilecruise.ui.screens.booking.BookingScreen
import com.dahabiyat.nilecruise.ui.screens.booking.BookingConfirmationScreen
import com.dahabiyat.nilecruise.ui.screens.contact.ContactScreen
import com.dahabiyat.nilecruise.ui.screens.ItineraryListScreen
import com.dahabiyat.nilecruise.ui.screens.ItineraryDetailScreen
import com.dahabiyat.nilecruise.ui.screens.blog.BlogScreen
import com.dahabiyat.nilecruise.ui.screens.admin.AdminLoginScreen
import com.dahabiyat.nilecruise.ui.screens.admin.AdminDashboardScreen
import com.dahabiyat.nilecruise.ui.screens.admin.AdminGalleryUploadScreen
import com.dahabiyat.nilecruise.ui.screens.admin.AdminDahabiyasScreen
import com.dahabiyat.nilecruise.ui.viewmodels.DahabiyaDetailViewModel
import com.dahabiyat.nilecruise.ui.viewmodels.PackageDetailViewModel
import com.dahabiyat.nilecruise.ui.screens.schedule.ScheduleRatesScreen
import com.dahabiyat.nilecruise.ui.screens.settings.SettingsScreen
import com.dahabiyat.nilecruise.ui.screens.faq.FAQScreen

@Composable
fun DahabiyatNavigation(
    navController: NavHostController,
    isLoading: Boolean,
    isLoggedIn: Boolean,
    currentUser: User? = null,
    controlPanelConfig: ControlPanelConfig? = null
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Routes that should show bottom navigation
    val bottomNavRoutes = listOf("home", "dahabiyas", "profile")
    val showBottomNav = currentRoute in bottomNavRoutes
    
    // Drawer state and controller
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    // Start destination without in-app splash
    val startDestination = if (isLoggedIn) "home" else "onboarding"
    
    // Debug log for navigation state
    LaunchedEffect(currentRoute, isLoading, isLoggedIn) {
        // Use println to avoid requiring Timber here
        println("DahabiyatNavigation: route=" + (currentRoute ?: "<none>") + ", isLoading=" + isLoading + ", isLoggedIn=" + isLoggedIn)
    }

    if (isLoading) {
        LoadingScreen(message = "Loading...")
    } else {
        // If user becomes logged in and we're on onboarding, redirect to home once
        LaunchedEffect(isLoggedIn, currentRoute) {
            if (isLoggedIn && currentRoute == "onboarding") {
                navController.navigate("home") {
                    popUpTo("onboarding") { inclusive = true }
                    launchSingleTop = true
                }
            }
        }
        // Drawer layout using Material3 ModalNavigationDrawer
        ModalNavigationDrawer(
            drawerState = drawerState,
            drawerContent = {
                ModalDrawerSheet {
                    DrawerMenu(
                        navController = navController,
                        onCloseDrawer = { scope.launch { drawerState.close() } }
                    )
                }
            }
        ) {
            Scaffold(
                contentWindowInsets = WindowInsets.safeDrawing,
                topBar = {
                    var menuExpanded by remember { mutableStateOf(false) }
                    SmallTopAppBar(
                        modifier = Modifier.statusBarsPadding(),
                        title = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Image(
                                    painter = painterResource(id = R.mipmap.ic_launcher_adaptive_fore),
                                    contentDescription = "App Logo",
                                    modifier = Modifier
                                        .height(28.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Dahabiyat Nile Cruise")
                            }
                        },
                        actions = {
                            // Overflow dropdown
                            Box {
                                IconButton(onClick = { menuExpanded = true }) {
                                    Icon(Icons.Default.MoreVert, contentDescription = "More")
                                }
                                DropdownMenu(expanded = menuExpanded, onDismissRequest = { menuExpanded = false }) {
                                    DropdownMenuItem(
                                        text = { Text("Packages") },
                                        onClick = {
                                            menuExpanded = false
                                            navController.navigate("packages")
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Dahabiyas") },
                                        onClick = {
                                            menuExpanded = false
                                            navController.navigate("dahabiyas")
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Itineraries") },
                                        onClick = {
                                            menuExpanded = false
                                            navController.navigate("itineraries")
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Schedule & Rates") },
                                        onClick = {
                                            menuExpanded = false
                                            navController.navigate("schedule")
                                        }
                                    )
                                    if (BuildConfig.ENABLE_IN_APP_ADMIN) {
                                        DropdownMenuItem(
                                            text = { Text("Admin Panel") },
                                            onClick = {
                                                menuExpanded = false
                                                navController.navigate("admin/dashboard")
                                            }
                                        )
                                    }
                                }
                            }
                            // Right drawer opener
                            IconButton(onClick = { scope.launch { drawerState.open() } }) {
                                Icon(Icons.Default.Menu, contentDescription = "Menu")
                            }
                        }
                    )
                },
                bottomBar = {
                    if (showBottomNav) {
                        Box(Modifier.windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom))) {
                            BottomNavigationBar(navController = navController)
                        }
                    }
                }
            ) { paddingValues ->
            NavHost(
                navController = navController,
                startDestination = startDestination,
                modifier = Modifier.padding(paddingValues),
                enterTransition = NavAnimations.enterTransition,
                exitTransition = NavAnimations.exitTransition,
                popEnterTransition = NavAnimations.popEnterTransition,
                popExitTransition = NavAnimations.popExitTransition
            ) {
                // Onboarding
                composable("onboarding") {
                    OnboardingScreen(
                        onGetStartedClick = {
                            navController.navigate("home") {
                                popUpTo("onboarding") { inclusive = true }
                            }
                        }
                    )
                }

                // Authentication
                composable("login") {
                    LoginScreen(
                        onLoginClick = { email, password ->
                            // TODO: Handle login
                            navController.navigate("home") {
                                popUpTo("login") { inclusive = true }
                            }
                        },
                        onRegisterClick = {
                            navController.navigate("register")
                        },
                        onForgotPasswordClick = {
                            // TODO: Navigate to forgot password
                        }
                    )
                }

                composable("register") {
                    RegisterScreen(
                        onRegisterClick = { firstName, lastName, email, password ->
                            // TODO: Handle registration
                            navController.navigate("home") {
                                popUpTo("register") { inclusive = true }
                            }
                        },
                        onLoginClick = {
                            navController.popBackStack()
                        }
                    )
                }

                // Main screens
                composable("home") {
                    HomeScreen(
                        onDahabiyaClick = { dahabiya ->
                            navController.navigate("dahabiya_detail/${dahabiya.slug}")
                        },
                        onPackageClick = { packageItem ->
                            navController.navigate("package_detail/${packageItem.id}")
                        },
                        onItineraryClick = { itinerary ->
                            navController.navigate("itinerary_detail/${itinerary.id}")
                        },
                        onViewAllDahabiyasClick = {
                            navController.navigate("dahabiyas")
                        },
                        onViewAllPackagesClick = {
                            navController.navigate("packages")
                        },
                        onViewAllItinerariesClick = {
                            navController.navigate("itineraries")
                        },
                        onSearchClick = {
                            navController.navigate("dahabiyas")
                        }
                    )
                }

                composable("dahabiyas") {
                    DahabiyaListScreen(
                        onDahabiyaClick = { dahabiya ->
                            navController.navigate("dahabiya_detail/${dahabiya.slug}")
                        },
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onFilterClick = {
                            // TODO: Show filter dialog
                        }
                    )
                }

                composable("dahabiya_detail/{dahabiyaId}") { backStackEntry ->
                    val dahabiyaId = backStackEntry.arguments?.getString("dahabiyaId") ?: ""
                    val vm: DahabiyaDetailViewModel = hiltViewModel()
                    val state by vm.state.collectAsState()
                    LaunchedEffect(dahabiyaId) { if (dahabiyaId.isNotBlank()) vm.load(dahabiyaId) }

                    val item = state.dahabiya
                    when {
                        state.loading -> LoadingScreen(message = "Loading...")
                        state.error != null -> {
                            Column(Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                                Text(text = state.error ?: "Error", style = MaterialTheme.typography.bodyLarge)
                                Spacer(Modifier.height(12.dp))
                                Button(onClick = { vm.load(dahabiyaId) }) { Text("Retry") }
                            }
                        }
                        item != null -> {
                            DahabiyaDetailScreen(
                                dahabiya = item,
                                onBackClick = { navController.popBackStack() },
                                onBookNowClick = { navController.navigate("booking/dahabiya/${dahabiyaId}") },
                                onShareClick = { /* TODO */ },
                                onFavoriteClick = { /* TODO */ }
                            )
                        }
                    }
                }

                composable("packages") {
                    PackageListScreen(
                        onPackageClick = { packageItem ->
                            navController.navigate("package_detail/${packageItem.id}")
                        },
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onFilterClick = {
                            // TODO: Show filter dialog
                        }
                    )
                }
                
                composable("itineraries") {
                    ItineraryListScreen(
                        onItineraryClick = { itineraryId ->
                            navController.navigate("itinerary_detail/${itineraryId}")
                        },
                        onBackClick = {
                            navController.popBackStack()
                        },
                        isLoading = false
                    )
                }
                
                composable("itinerary_detail/{itineraryId}") { backStackEntry ->
                    val itineraryId = backStackEntry.arguments?.getString("itineraryId") ?: ""
                    com.dahabiyat.nilecruise.ui.screens.itineraries.ItineraryDetailRoute(
                        itineraryId = itineraryId,
                        onBackClick = { navController.popBackStack() },
                        onBookNowClick = { id -> navController.navigate("booking/itinerary/${id}") }
                    )
                }

                composable("package_detail/{packageId}") { backStackEntry ->
                    val packageId = backStackEntry.arguments?.getString("packageId") ?: ""

                    com.dahabiyat.nilecruise.ui.screens.packages.PackageDetailRoute(
                        packageId = packageId,
                        onBackClick = { navController.popBackStack() },
                        onBookNowClick = { navController.navigate("booking/package/${packageId}") },
                        onShareClick = { /* TODO: share */ },
                        onFavoriteClick = { /* TODO: favorite */ },
                        isFavorite = false
                    )
                }

                composable("gallery") {
                    GalleryScreen(
                        onImageClick = { image ->
                            // TODO: Show image detail
                        },
                        onFilterClick = {
                            // TODO: Show filter dialog
                        }
                    )
                }

                // Blog
                composable("blog") {
                    BlogScreen(
                        onBackClick = { navController.popBackStack() },
                        onBlogClick = { blogId -> navController.navigate("blog_detail/${'$'}blogId") }
                    )
                }

                composable("blog_detail/{blogId}") { backStackEntry ->
                    val blogId = backStackEntry.arguments?.getString("blogId") ?: ""
                    com.dahabiyat.nilecruise.ui.screens.blog.BlogDetailScreen(
                        blogId = blogId,
                        onBackClick = { navController.popBackStack() }
                    )
                }

                composable("profile") {
                    ProfileScreen(
                        user = currentUser,
                        onEditProfileClick = {
                            // TODO: Navigate to edit profile
                        },
                        onBookingsClick = {
                            // TODO: Navigate to bookings
                        },
                        onFavoritesClick = {
                            // TODO: Navigate to favorites
                        },
                        onSettingsClick = {
                            navController.navigate("settings")
                        },
                        onHelpClick = {
                            navController.navigate("contact")
                        },
                        onLogoutClick = {
                            // TODO: Handle logout
                            navController.navigate("onboarding") {
                                popUpTo(0) { inclusive = true }
                            }
                        },
                        onLoginClick = {
                            navController.navigate("login")
                        }
                    )
                }

                // Booking flow (load real item data instead of hardcoded values)
                composable("booking/{type}/{itemId}") { backStackEntry ->
                    val type = backStackEntry.arguments?.getString("type") ?: ""
                    val itemId = backStackEntry.arguments?.getString("itemId") ?: ""

                    when (type) {
                        "dahabiya" -> {
                            val vm: com.dahabiyat.nilecruise.ui.viewmodels.DahabiyaDetailViewModel = hiltViewModel()
                            val state by vm.state.collectAsState()
                            LaunchedEffect(itemId) { if (itemId.isNotBlank()) vm.load(itemId) }

                            when {
                                state.loading -> LoadingScreen(message = "Loading...")
                                state.error != null -> {
                                    Column(Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                                        Text(text = state.error ?: "Error", style = MaterialTheme.typography.bodyLarge)
                                        Spacer(Modifier.height(12.dp))
                                        Button(onClick = { vm.load(itemId) }) { Text("Retry") }
                                    }
                                }
                                state.dahabiya != null -> {
                                    val item = state.dahabiya
                                    val bookingVm: com.dahabiyat.nilecruise.ui.viewmodels.BookingViewModel = hiltViewModel()
                                    val bookingState by bookingVm.uiState.collectAsState()

                                    // Navigate to confirmation when booking succeeds
                                    LaunchedEffect(bookingState.currentBooking) {
                                        bookingState.currentBooking?.let { booking ->
                                            navController.navigate("booking_confirmation/${booking.id}") {
                                                popUpTo("home")
                                            }
                                            // Clear current booking after navigation
                                            bookingVm.clearCurrentBooking()
                                        }
                                    }

                                    BookingScreen(
                                        itemName = item!!.name,
                                        itemPrice = item.pricePerDay,
                                        onBackClick = { navController.popBackStack() },
                                        onConfirmBooking = { startDate, endDate, guests, guestDetails, contactInfo, specialRequests ->
                                            bookingVm.createBooking(
                                                dahabiyaId = itemId,
                                                packageId = null,
                                                startDate = startDate,
                                                endDate = endDate,
                                                guests = guests,
                                                guestDetails = guestDetails,
                                                contactInfo = contactInfo,
                                                specialRequests = specialRequests,
                                                promoCode = null
                                            )
                                        },
                                        isLoading = bookingState.isCreatingBooking
                                    )
                                }
                            }
                        }
                        "package" -> {
                            val vm: com.dahabiyat.nilecruise.ui.viewmodels.PackageDetailViewModel = hiltViewModel()
                            val uiState by vm.uiState.collectAsState()
                            LaunchedEffect(itemId) { if (itemId.isNotBlank()) vm.load(itemId) }

                            when {
                                uiState.isLoading -> LoadingScreen(message = "Loading...")
                                uiState.error != null -> {
                                    Column(Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                                        Text(text = uiState.error ?: "Error", style = MaterialTheme.typography.bodyLarge)
                                        Spacer(Modifier.height(12.dp))
                                        Button(onClick = { vm.load(itemId) }) { Text("Retry") }
                                    }
                                }
                                uiState.data != null -> {
                                    val item = uiState.data
                                    val bookingVm: com.dahabiyat.nilecruise.ui.viewmodels.BookingViewModel = hiltViewModel()
                                    val bookingState by bookingVm.uiState.collectAsState()

                                    // Navigate to confirmation when booking succeeds
                                    LaunchedEffect(bookingState.currentBooking) {
                                        bookingState.currentBooking?.let { booking ->
                                            navController.navigate("booking_confirmation/${booking.id}") {
                                                popUpTo("home")
                                            }
                                            bookingVm.clearCurrentBooking()
                                        }
                                    }

                                    BookingScreen(
                                        itemName = item!!.name,
                                        itemPrice = item.price,
                                        onBackClick = { navController.popBackStack() },
                                        onConfirmBooking = { startDate, endDate, guests, guestDetails, contactInfo, specialRequests ->
                                            bookingVm.createBooking(
                                                dahabiyaId = null,
                                                packageId = itemId,
                                                startDate = startDate,
                                                endDate = endDate,
                                                guests = guests,
                                                guestDetails = guestDetails,
                                                contactInfo = contactInfo,
                                                specialRequests = specialRequests,
                                                promoCode = null
                                            )
                                        },
                                        isLoading = bookingState.isCreatingBooking
                                    )
                                }
                            }
                        }
                        else -> {
                            Column(Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                                Text(text = "Unknown booking type", style = MaterialTheme.typography.bodyLarge)
                                Spacer(Modifier.height(12.dp))
                                Button(onClick = { navController.popBackStack() }) { Text("Back") }
                            }
                        }
                    }
                }

                composable("booking_confirmation/{bookingId}") { backStackEntry ->
                    val bookingId = backStackEntry.arguments?.getString("bookingId") ?: ""

                    val bookingVm: com.dahabiyat.nilecruise.ui.viewmodels.BookingViewModel = hiltViewModel()
                    val uiState by bookingVm.uiState.collectAsState()

                    // Load the booking when entering this screen
                    LaunchedEffect(bookingId) {
                        if (bookingId.isNotBlank()) {
                            bookingVm.loadBookingById(bookingId)
                        }
                    }

                    when {
                        uiState.isLoading -> {
                            LoadingScreen(message = "Loading booking...")
                        }
                        uiState.error != null -> {
                            Column(
                                modifier = Modifier.fillMaxSize(),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Text(text = uiState.error ?: "Error", style = MaterialTheme.typography.bodyLarge)
                                Spacer(Modifier.height(12.dp))
                                Button(onClick = { bookingVm.loadBookingById(bookingId) }) { Text("Retry") }
                                Spacer(Modifier.height(12.dp))
                                OutlinedButton(onClick = {
                                    navController.navigate("home") {
                                        popUpTo("home") { inclusive = true }
                                    }
                                }) { Text("Back to Home") }
                            }
                        }
                        uiState.currentBooking != null -> {
                            BookingConfirmationScreen(
                                booking = uiState.currentBooking!!,
                                onBackToHomeClick = {
                                    navController.navigate("home") {
                                        popUpTo("home") { inclusive = true }
                                    }
                                },
                                onViewBookingClick = {
                                    // If you add a dedicated booking details screen, navigate to it here
                                }
                            )
                        }
                    }
                }

                // Contact
                composable("contact") {
                    ContactScreen(
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onSendMessageClick = { name, email, subject, message ->
                            // TODO: Send message
                        },
                        onCallClick = { phoneNumber ->
                            // TODO: Open phone dialer
                        },
                        onEmailClick = { email ->
                            // TODO: Open email client
                        }
                    )
                }
                
                composable("faq") {
                    FAQScreen(
                        onBackClick = {
                            navController.popBackStack()
                        }
                    )
                }
                
                // Schedule & Rates
                composable("schedule") {
                    ScheduleRatesScreen(
                        onBackClick = { navController.popBackStack() }
                    )
                }

                // Settings screen
                composable("settings") {
                    SettingsScreen(
                        onBackClick = {
                            navController.popBackStack()
                        }
                    )
                }

                if (BuildConfig.ENABLE_IN_APP_ADMIN) {
                    // Admin: Login
                    composable("admin/login") {
                        AdminLoginScreen(
                            onBackClick = { navController.popBackStack() },
                            onLoggedIn = {
                                navController.navigate("admin/dashboard") {
                                    popUpTo("admin/login") { inclusive = true }
                                    launchSingleTop = true
                                }
                            },
                            onForgotPassword = { /* TODO */ }
                        )
                    }

                    // Admin: Dashboard
                    composable("admin/dashboard") {
                        AdminDashboardScreen(
                            onBackClick = { navController.popBackStack() },
                            onOpenDahabiyas = { navController.navigate("admin/dahabiyas") },
                            onOpenPackages = { /* TODO */ },
                            onOpenBlogs = { /* TODO */ },
                            onOpenItineraries = { /* TODO */ },
                            onOpenRates = { /* TODO */ },
                            onOpenAbout = { /* TODO */ },
                            onOpenGalleryUpload = { navController.navigate("admin/gallery/upload") }
                        )
                    }

                    // Admin: Gallery Upload
                    composable("admin/gallery/upload") {
                        AdminGalleryUploadScreen(
                            onBackClick = { navController.popBackStack() }
                        )
                    }

                    // Admin: Dahabiyas CRUD
                    composable("admin/dahabiyas") {
                        AdminDahabiyasScreen(
                            onBackClick = { navController.popBackStack() }
                        )
                    }
                }
            }
            }
        }
    }
}
