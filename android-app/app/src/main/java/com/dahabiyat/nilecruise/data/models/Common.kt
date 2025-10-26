package com.dahabiyat.nilecruise.data.models

import kotlinx.serialization.Serializable

@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val message: String? = null,
    val data: T? = null,
    val error: String? = null
)

@Serializable
data class PaginatedResponse<T>(
    val data: List<T>,
    val pagination: PaginationInfo
)

// Matches backend response: { "dahabiyas": [...], "total": X, "pages": Y, "currentPage": Z }
@Serializable
data class DahabiyasListResponse(
    val dahabiyas: List<Dahabiya>,
    val total: Int,
    val pages: Int,
    val currentPage: Int
)

@Serializable
data class PaginationInfo(
    val currentPage: Int,
    val totalPages: Int,
    val totalItems: Int,
    val itemsPerPage: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
)

@Serializable
data class Review(
    val id: String,
    val userId: String,
    val userName: String,
    val userAvatar: String? = null,
    val dahabiyaId: String? = null,
    val packageId: String? = null,
    val rating: Int,
    val title: String,
    val comment: String,
    val images: List<String> = emptyList(),
    val isVerified: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class GalleryImage(
    val id: String,
    val url: String,
    val title: String? = null,
    val description: String? = null,
    val category: String? = null,
    val tags: List<String> = emptyList(),
    val dahabiyaId: String? = null,
    val packageId: String? = null
)

@Serializable
data class BlogPost(
    val id: String,
    val title: String,
    val slug: String,
    val excerpt: String,
    val content: String,
    val featuredImage: String? = null,
    val author: String,
    val authorAvatar: String? = null,
    val category: String,
    val tags: List<String> = emptyList(),
    val isPublished: Boolean = true,
    val publishedAt: String,
    val createdAt: String,
    val updatedAt: String
)
