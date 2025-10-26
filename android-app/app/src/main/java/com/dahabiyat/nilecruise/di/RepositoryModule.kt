package com.dahabiyat.nilecruise.di

import com.dahabiyat.nilecruise.data.repositories.DahabiyaRepository
import com.dahabiyat.nilecruise.data.repositories.ItineraryRepository
import com.dahabiyat.nilecruise.data.repositories.PackageRepository
import com.dahabiyat.nilecruise.data.ContentGateway
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import com.dahabiyat.nilecruise.data.repositories.BlogRepository
import com.dahabiyat.nilecruise.data.repository.DahabiyaRepository as SingularDahabiyaRepository
import com.dahabiyat.nilecruise.data.repository.PackageRepository as SingularPackageRepository
import com.dahabiyat.nilecruise.data.repository.ItineraryRepository as SingularItineraryRepository

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideDahabiyaRepository(api: DahabiyatApiService): DahabiyaRepository {
        return DahabiyaRepository(api)
    }

    @Provides
    @Singleton
    fun providePackageRepository(api: DahabiyatApiService): PackageRepository {
        return PackageRepository(api)
    }

    @Provides
    @Singleton
    fun provideItineraryRepository(api: DahabiyatApiService): ItineraryRepository {
        return ItineraryRepository(api)
    }

    // Provide singular package repositories for modules still importing data.repository.*
    @Provides
    @Singleton
    fun provideSingularDahabiyaRepository(api: DahabiyatApiService): SingularDahabiyaRepository {
        return SingularDahabiyaRepository(api)
    }

    @Provides
    @Singleton
    fun provideSingularPackageRepository(api: DahabiyatApiService): SingularPackageRepository {
        return SingularPackageRepository(api)
    }

    @Provides
    @Singleton
    fun provideSingularItineraryRepository(api: DahabiyatApiService): SingularItineraryRepository {
        return SingularItineraryRepository(api)
    }

    @Provides
    @Singleton
    fun provideContentGateway(
        api: DahabiyatApiService,
        prefs: PreferencesManager
    ): ContentGateway {
        return ContentGateway(api, prefs)
    }

    @Provides
    @Singleton
    fun provideBlogRepository(api: DahabiyatApiService): BlogRepository {
        return BlogRepository(api)
    }
}