package com.dahabiyat.nilecruise.di

import com.dahabiyat.nilecruise.data.api.ControlPanelApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Singleton
import javax.inject.Named

@Module
@InstallIn(SingletonComponent::class)
object ControlPanelModule {
    
    @Provides
    @Singleton
    fun provideControlPanelApiService(@Named("appRetrofit") retrofit: Retrofit): ControlPanelApiService {
        return retrofit.create(ControlPanelApiService::class.java)
    }
}