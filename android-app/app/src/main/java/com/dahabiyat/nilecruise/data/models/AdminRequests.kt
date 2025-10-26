package com.dahabiyat.nilecruise.data.models

data class CreateDahabiyaRequest(
    val name: String,
    val description: String? = null,
    val pricePerDay: Double? = null,
    val capacity: Int? = null
)

data class UpdateDahabiyaRequest(
    val name: String? = null,
    val description: String? = null,
    val pricePerDay: Double? = null,
    val capacity: Int? = null
)
