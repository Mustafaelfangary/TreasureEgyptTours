package com.dahabiyat.nilecruise.ui.screens.faq

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dahabiyat.nilecruise.ui.components.EgyptianHeader
import com.dahabiyat.nilecruise.ui.components.EgyptianSectionHeader
import com.dahabiyat.nilecruise.ui.theme.DahabiyatColors

data class FAQ(
    val id: String,
    val question: String,
    val answer: String,
    val category: String
)

@Composable
fun FAQScreen(
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Sample FAQ data - in a real app, this would come from a repository or ViewModel
    val faqs = remember {
        listOf(
            FAQ(
                id = "1",
                question = "What is a Dahabiya?",
                answer = "A Dahabiya is a traditional Egyptian sailing boat that was common on the Nile in the days of the monarchy (1920s-40s) when aristocrats and sophisticated travelers cruised the Nile in style and comfort. Today's Dahabiyas are essentially the same, but with modern conveniences like private bathrooms, air conditioning, and other amenities.",
                category = "General"
            ),
            FAQ(
                id = "2",
                question = "How many guests can a Dahabiya accommodate?",
                answer = "Most Dahabiyas accommodate between 10-16 guests in 5-8 cabins, providing an intimate and exclusive cruising experience compared to larger cruise ships that may carry 100+ passengers.",
                category = "General"
            ),
            FAQ(
                id = "3",
                question = "What is included in the cruise price?",
                answer = "Our cruise prices typically include accommodation, all meals, guided tours to temples and monuments, entrance fees, and transportation during the cruise. Drinks, gratuities, and optional activities are usually not included unless specifically stated.",
                category = "Booking"
            ),
            FAQ(
                id = "4",
                question = "What is the best time to cruise the Nile?",
                answer = "The best time to cruise the Nile is from October to April when temperatures are milder. Summer months (June-August) can be extremely hot, especially in Upper Egypt. The peak tourist season is from December to February.",
                category = "Planning"
            ),
            FAQ(
                id = "5",
                question = "Do I need a visa to visit Egypt?",
                answer = "Yes, most visitors to Egypt require a visa. Many nationalities can obtain a visa on arrival at Egyptian airports, or you can apply for an e-visa online before your trip. We recommend checking the latest visa requirements for your nationality before traveling.",
                category = "Planning"
            ),
            FAQ(
                id = "6",
                question = "What should I pack for a Nile cruise?",
                answer = "Pack light, breathable clothing, a hat, sunglasses, sunscreen, comfortable walking shoes, and a light jacket or shawl for evenings. For temple visits, modest clothing that covers shoulders and knees is recommended. Don't forget your camera, adapter plugs, and any necessary medications.",
                category = "Planning"
            ),
            FAQ(
                id = "7",
                question = "Is it safe to drink tap water on the Dahabiya?",
                answer = "We recommend drinking only bottled water, which is provided abundantly on our Dahabiyas. Tap water is not recommended for drinking but is safe for brushing teeth.",
                category = "Onboard"
            ),
            FAQ(
                id = "8",
                question = "Is there Wi-Fi on board?",
                answer = "Most of our Dahabiyas offer Wi-Fi service, though connectivity may be intermittent in some remote stretches of the Nile. This is part of the charm of disconnecting and enjoying the timeless river experience.",
                category = "Onboard"
            ),
            FAQ(
                id = "9",
                question = "What is the cancellation policy?",
                answer = "Our standard cancellation policy allows full refunds for cancellations made 60+ days before departure, 50% refund for 30-59 days, and no refund for less than 30 days. However, we recommend purchasing travel insurance to cover unexpected cancellations. Special terms may apply during peak seasons or for group bookings.",
                category = "Booking"
            ),
            FAQ(
                id = "10",
                question = "Are gratuities included?",
                answer = "Gratuities are not included in the cruise price. Tipping is customary in Egypt, and we recommend budgeting approximately $10-15 per person per day for the crew and guides collectively.",
                category = "Booking"
            )
        )
    }
    
    // Group FAQs by category
    val faqsByCategory = remember(faqs) {
        faqs.groupBy { it.category }
    }
    
    // Track which category is currently selected
    var selectedCategory by remember { mutableStateOf(faqsByCategory.keys.first()) }
    
    LazyColumn(
        modifier = modifier.fillMaxSize()
    ) {
        item {
            EgyptianHeader(
                title = "Frequently Asked Questions",
                subtitle = "Find answers to common questions about our Nile cruises",
                onBackClick = onBackClick,
                backgroundImage = "https://example.com/faq-hero.jpg"
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
        
        // Category tabs
        item {
            CategoryTabs(
                categories = faqsByCategory.keys.toList(),
                selectedCategory = selectedCategory,
                onCategorySelected = { selectedCategory = it },
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        // FAQ items for selected category
        items(faqsByCategory[selectedCategory] ?: emptyList()) { faq ->
            FAQItem(
                faq = faq,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
        
        // Contact for more questions
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = DahabiyatColors.SandBeige.copy(alpha = 0.2f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.ContactSupport,
                        contentDescription = null,
                        tint = DahabiyatColors.OceanBlue,
                        modifier = Modifier.size(48.dp)
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = "Still have questions?",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = "Our team is here to help you with any additional questions you may have about our Nile cruises.",
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Button(
                        onClick = { /* Navigate to contact page */ },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = DahabiyatColors.OceanBlue
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Email,
                            contentDescription = null,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Contact Us")
                    }
                }
            }
        }
        
        item {
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun CategoryTabs(
    categories: List<String>,
    selectedCategory: String,
    onCategorySelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    ScrollableTabRow(
        selectedTabIndex = categories.indexOf(selectedCategory),
        modifier = modifier,
        edgePadding = 0.dp,
        containerColor = MaterialTheme.colorScheme.surface,
        contentColor = MaterialTheme.colorScheme.primary,
        divider = {}
    ) {
        categories.forEachIndexed { index, category ->
            Tab(
                selected = category == selectedCategory,
                onClick = { onCategorySelected(category) },
                text = {
                    Text(
                        text = category,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = if (category == selectedCategory) FontWeight.Bold else FontWeight.Normal
                    )
                },
                modifier = Modifier.padding(vertical = 8.dp, horizontal = 16.dp)
            )
        }
    }
}

@Composable
private fun FAQItem(
    faq: FAQ,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }
    val rotationState by animateFloatAsState(
        targetValue = if (expanded) 180f else 0f
    )
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { expanded = !expanded },
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Question row with expand/collapse icon
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = faq.question,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.weight(1f)
                )
                
                IconButton(
                    onClick = { expanded = !expanded },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ExpandMore,
                        contentDescription = if (expanded) "Collapse" else "Expand",
                        modifier = Modifier.rotate(rotationState)
                    )
                }
            }
            
            // Answer (visible only when expanded)
            AnimatedVisibility(
                visible = expanded,
                enter = expandVertically(),
                exit = shrinkVertically()
            ) {
                Column {
                    Spacer(modifier = Modifier.height(8.dp))
                    Divider()
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = faq.answer,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = MaterialTheme.typography.bodyMedium.lineHeight * 1.2
                    )
                }
            }
        }
    }
}