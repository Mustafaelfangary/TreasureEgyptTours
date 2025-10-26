package com.dahabiyat.nilecruise.di

import android.content.Context
import com.dahabiyat.nilecruise.data.preferences.PreferencesManager
import com.dahabiyat.nilecruise.data.repository.ControlPanelRepository
import com.dahabiyat.nilecruise.data.repository.UserRepository
import com.dahabiyat.nilecruise.data.api.ControlPanelApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object PreferencesModule {

    @Provides
    @Singleton
    fun providePreferencesManager(
        @ApplicationContext context: Context
    ): PreferencesManager {
        return com.dahabiyat.nilecruise.data.preferences.DataStorePreferencesManager(context)
    }

    @Provides
    @Singleton
    fun provideUserRepository(): UserRepository {
        return UserRepository()
    }

    @Provides
    @Singleton
    fun provideControlPanelRepository(api: ControlPanelApiService): ControlPanelRepository {
        return ControlPanelRepository(api)
    }
}