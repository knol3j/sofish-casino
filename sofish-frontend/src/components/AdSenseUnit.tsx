import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle'
  style?: React.CSSProperties
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdSenseUnit({ adSlot, adFormat = 'auto', style }: AdSenseProps) {
  const location = useLocation()
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [location.pathname])  // Refresh on route change

  return (
    <ins
      ref={adRef}
      key={location.pathname}  // Force re-render on navigation
      className="adsbygoogle"
      style={style || { display: 'block' }}
      data-ad-client="ca-pub-4626165154390205"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  )
}
