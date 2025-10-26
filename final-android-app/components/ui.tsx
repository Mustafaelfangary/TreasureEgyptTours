/**
 * UI Components for Dahabiyat Mobile App
 * Ocean Blue Theme with Egyptian-inspired design
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Luxury Dahabiyat Color Scheme - Inspired by Egyptian royalty and Nile waters
const COLORS = {
  PRIMARY: '#1e3a8a', // Royal deep blue - like the deep Nile
  SECONDARY: '#3b82f6', // Bright blue - like the sky reflecting on water
  TERTIARY: '#1e40af', // Medium blue for accents
  BACKGROUND: '#f8fafc', // Off-white with slight blue tint
  CARD_BACKGROUND: '#ffffff', // Pure white for cards
  TEXT: '#1e293b', // Dark slate for primary text
  TEXT_SECONDARY: '#64748b', // Medium slate for secondary text
  TEXT_LIGHT: '#94a3b8', // Light slate for subtle text
  WHITE: '#ffffff',
  GOLD: '#fbbf24', // Warm Egyptian gold
  GOLD_DARK: '#f59e0b', // Darker gold for accents
  GRADIENT_START: '#1e3a8a', // Deep blue
  GRADIENT_END: '#3b82f6', // Bright blue
  SHADOW: 'rgba(30, 58, 138, 0.1)', // Blue-tinted shadow
  BORDER: '#e2e8f0', // Light border color
  SUCCESS: '#10b981', // Emerald for success states
  WARNING: '#f59e0b', // Amber for warnings
  ERROR: '#ef4444', // Red for errors
};

// Gradient Background Component
interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: string[];
  style?: ViewStyle;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors = [COLORS.GRADIENT_START, COLORS.GRADIENT_END],
  style,
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};

// Button Component
interface ButtonProps {
  title?: string; // allow either title or children for convenience
  children?: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'outline' && styles.buttonOutline,
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'primary' && styles.buttonTextPrimary,
    variant === 'secondary' && styles.buttonTextSecondary,
    variant === 'outline' && styles.buttonTextOutline,
    disabled && styles.buttonTextDisabled,
  ];

  const label = children ?? title;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {typeof label === 'string' || typeof label === 'number' ? (
          <Text style={textStyle}>{label}</Text>
        ) : (
          label
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

// Typography Components
interface TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const Heading1: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.heading1, style]}>{children}</Text>;
};

export const Heading2: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.heading2, style]}>{children}</Text>;
};

export const BodyText: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.bodyText, style]}>{children}</Text>;
};

export const AccentText: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.accentText, style]}>{children}</Text>;
};

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = COLORS.PRIMARY,
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

// Hieroglyphic Text Component
interface HieroglyphicTextProps {
  fontSize?: number;
  color?: string;
  isTop?: boolean;
  style?: ViewStyle;
}

export const HieroglyphicText: React.FC<HieroglyphicTextProps> = ({
  fontSize = 12,
  color,
  isTop = true,
  style,
}) => {
  return (
    <View style={[
      styles.hieroglyphicContainer,
      isTop ? styles.hieroglyphicTop : styles.hieroglyphicBottom,
      style
    ]}>
      <Text style={[
        styles.hieroglyphicText,
        {
          fontSize,
          color: color || COLORS.GOLD + '80', // Golden hieroglyphs with transparency
        }
      ]}>
        𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿 ⚱️ 𓂀 𓊪𓏏𓇯 𓈖𓇋𓃭
      </Text>
    </View>
  );
};

// Enhanced Card with Gradient Border
interface LuxuryCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'premium' | 'gold';
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({ 
  children, 
  style, 
  variant = 'default' 
}) => {
  const cardStyle = [
    styles.card,
    variant === 'premium' && styles.premiumCard,
    variant === 'gold' && styles.goldCard,
    style
  ];

  if (variant === 'premium') {
    return (
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumGradientOuter}
      >
        <View style={[styles.card, styles.premiumCardInner, style]}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

// Styles
const styles = StyleSheet.create({
  // Button Styles
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
  },
  buttonSecondary: {
    backgroundColor: COLORS.GOLD,
    shadowColor: COLORS.GOLD_DARK,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    shadowOpacity: 0.1,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextPrimary: {
    color: COLORS.WHITE,
  },
  buttonTextSecondary: {
    color: COLORS.WHITE,
  },
  buttonTextOutline: {
    color: COLORS.PRIMARY,
  },
  buttonTextDisabled: {
    color: '#999999',
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    marginHorizontal: 4,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  // Typography Styles
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heading2: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  bodyText: {
    fontSize: 16,
    color: COLORS.TEXT,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  accentText: {
    fontSize: 14,
    color: COLORS.GOLD_DARK,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },

  // Hieroglyphic Text Styles
  hieroglyphicContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  hieroglyphicTop: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  hieroglyphicBottom: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  hieroglyphicText: {
    fontWeight: '300',
    letterSpacing: 3,
    textAlign: 'center',
    opacity: 0.7,
  },

  // Premium Card Styles
  premiumGradientOuter: {
    borderRadius: 22,
    padding: 2,
  },
  premiumCardInner: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 20,
    margin: 0,
    borderWidth: 0,
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: COLORS.GOLD,
    shadowColor: COLORS.GOLD,
    shadowOpacity: 0.3,
  },
  goldCard: {
    backgroundColor: COLORS.GOLD + '10',
    borderWidth: 2,
    borderColor: COLORS.GOLD,
    shadowColor: COLORS.GOLD_DARK,
    shadowOpacity: 0.4,
  },
});

export { COLORS };
