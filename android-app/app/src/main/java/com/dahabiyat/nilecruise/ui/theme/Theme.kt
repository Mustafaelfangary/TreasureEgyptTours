package com.dahabiyat.nilecruise.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Enhanced luxury palette: vibrant blues + rich Egyptian gold
val RoyalBlue = Color(0xFF0D47A1)
val RoyalBlueDark = Color(0xFF002171)
val BrightBlue = Color(0xFF2196F3)
val NileBackground = Color(0xFFE3F2FD)
val TextPrimary = Color(0xFF1A237E)
val TextSecondary = Color(0xFF5C6BC0)
val EgyptianGold = Color(0xFFFFD700)
val EgyptianGoldDark = Color(0xFFFFC107)
val NileTurquoise = Color(0xFF26C6DA)
val SandyBeige = Color(0xFFF5DEB3)
val SunsetOrange = Color(0xFFFF7043)

private val LightColors = lightColorScheme(
    primary = RoyalBlue,
    onPrimary = Color.White,
    primaryContainer = RoyalBlueDark,
    onPrimaryContainer = Color.White,

    secondary = EgyptianGold,
    onSecondary = Color.Black,
    secondaryContainer = EgyptianGoldDark,
    onSecondaryContainer = Color.Black,
    
    tertiary = NileTurquoise,
    onTertiary = Color.Black,
    tertiaryContainer = SandyBeige,
    onTertiaryContainer = Color.Black,

    background = NileBackground,
    onBackground = TextPrimary,
    surface = Color.White,
    onSurface = TextPrimary,
    outline = TextSecondary,
    
    error = SunsetOrange,
    surfaceTint = RoyalBlue.copy(alpha = 0.1f)
)

private val DarkColors = darkColorScheme(
    primary = BrightBlue,
    onPrimary = Color.Black,
    primaryContainer = RoyalBlue,
    onPrimaryContainer = Color.White,

    secondary = EgyptianGold,
    onSecondary = Color.Black,
    secondaryContainer = EgyptianGoldDark,
    onSecondaryContainer = Color.Black,
    
    tertiary = NileTurquoise,
    onTertiary = Color.Black,
    tertiaryContainer = SandyBeige.copy(alpha = 0.7f),
    onTertiaryContainer = Color.Black,

    background = Color(0xFF001E3C),
    onBackground = Color(0xFFE3F2FD),
    surface = Color(0xFF0A1929),
    onSurface = Color(0xFFE3F2FD),
    outline = Color(0xFF64B5F6),
    
    error = SunsetOrange,
    surfaceTint = BrightBlue.copy(alpha = 0.2f)
)

@Composable
fun DahabiyatNileCruiseTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    colorScheme: ColorScheme = if (darkTheme) DarkColors else LightColors,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = Shapes,
        content = content
    )
}

// Basic Typography and Shapes (can be customized further)
val Typography = Typography()
val Shapes = Shapes()

