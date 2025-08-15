'use client'

import { useState, useRef } from 'react'
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'

interface DemoVideoProps {
  videoFileName?: string
  title?: string
  description?: string
}

export default function DemoVideo({ 
  videoFileName = 'demo-video.mp4', 
  title = "See GustavoAI in Action", 
  description = "Watch how our AI-powered platform streamlines property management workflows"
}: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Construct the video URL from the public directory
  const videoUrl = `/${videoFileName}`

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
        } else {
          await videoRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Error playing video:', error)
        setHasError(true)
      }
    }
  }

  const handleVideoError = () => {
    setIsLoading(false)
    setHasError(true)
    console.error('Failed to load demo video')
  }

  const handleVideoLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }

  const handleVideoCanPlay = () => {
    setIsLoading(false)
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div id="demo" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Video Container */}
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onLoadStart={handleVideoLoadStart}
                onCanPlay={handleVideoCanPlay}
                onError={handleVideoError}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
                preload="metadata"
                muted
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Fallback when video fails to load */}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlayIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-medium">Demo Video Coming Soon</p>
                    <p className="text-sm text-primary-100 mt-2">
                      Add your demo video to the public folder as "{videoFileName}"
                    </p>
                  </div>
                </div>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}

              {/* Custom Play/Pause Button Overlay */}
              {!isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayPause}
                    className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 group"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-8 h-8 text-primary-600" />
                    ) : (
                      <PlayIcon className="w-8 h-8 text-primary-600 ml-1" />
                    )}
                  </button>
                </div>
              )}

              {/* Video Progress Bar */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-100"
                    style={{
                      width: videoRef.current ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` : '0%'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    GustavoAI Platform Demo
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    See how our AI handles tenant management, payments, and maintenance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Ready to experience the power of AI-driven property management?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Start Free Trial
              </a>
              <a
                href="/login"
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 